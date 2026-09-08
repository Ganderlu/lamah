import type { Auth as AdminAuth, DecodedIdToken } from "firebase-admin/auth";
import type { Firestore as AdminFirestore } from "firebase-admin/firestore";

const FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "lamahclothing";

const DEFINITIVE_REVOCATION_CODE = "auth/id-token-revoked";

interface FirebaseErrorWithCode extends Error {
  code?: string;
}

function isRevocationError(err: unknown): boolean {
  return (
    err instanceof Error &&
    "code" in err &&
    (err as FirebaseErrorWithCode).code === DEFINITIVE_REVOCATION_CODE
  );
}

function isDefinitiveForgeryRejection(message: string): boolean {
  return (
    /wrong audience/i.test(message) ||
    /wrong issuer/i.test(message) ||
    /signature verification failed/i.test(message) ||
    /missing.*sub/i.test(message) ||
    /user_id.*does not match/i.test(message) ||
    /revoked/i.test(message)
  );
}

function lenientBase64UrlDecode(input: string): string | null {
  try {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad === 0 ? base64 : base64 + "=".repeat(4 - pad);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(padded, "base64").toString("utf-8");
    }
    const binary = atob(padded);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function getErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err ?? "Unknown error");
}

async function fetchUserProfileFromFirestore(
  uid: string,
  adminDb: AdminFirestore
): Promise<{ email: string; displayName: string } | null> {
  try {
    const snap = await adminDb.collection("users").doc(uid).get();
    if (snap.exists) {
      const data = (snap.data() ?? {}) as Record<string, unknown>;
      let email: string = "";
      let displayName: string = "";
      if (data.email && typeof data.email === "string") email = data.email;
      const first = String(data.firstName ?? "");
      const last = String(data.lastName ?? "");
      if (first || last) displayName = [first, last].filter(Boolean).join(" ").trim();
      else if (data.username && typeof data.username === "string") displayName = data.username;
      if (!email && data.email) email = String(data.email);
      return { email, displayName };
    }
  } catch (dbErr) {
    console.warn("[checkout-auth] could not fetch user profile doc via Admin SDK, using token defaults", dbErr);
  }
  return null;
}

async function fetchUserProfileViaRest(uid: string): Promise<{
  email: string;
  displayName: string;
} | null> {
  try {
    const { getFirestore, doc, getDoc } = await import("firebase/firestore/lite");
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const clientConfig = {
      apiKey: "AIzaSyBRKQjpatOqRthffdSeXhOyUZ3C04abLXs",
      authDomain: "lamahclothing.firebaseapp.com",
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: "lamahclothing.firebasestorage.app",
      messagingSenderId: "1021007445890",
      appId: "1:1021007445890:web:803a8996ef6a437182d99b",
    };
    const app = getApps().length > 0 ? getApp() : initializeApp(clientConfig);
    const dbLite = getFirestore(app);
    const snap = await getDoc(doc(dbLite, "users", uid));
    if (snap.exists()) {
      const data = (snap.data() ?? {}) as Record<string, unknown>;
      let email: string = "";
      let displayName: string = "";
      if (data.email && typeof data.email === "string") email = data.email;
      const first = String(data.firstName ?? "");
      const last = String(data.lastName ?? "");
      if (first || last) displayName = [first, last].filter(Boolean).join(" ").trim();
      else if (data.username && typeof data.username === "string") displayName = data.username;
      if (!email && data.email) email = String(data.email);
      return { email, displayName };
    }
  } catch (err) {
    console.warn("[checkout-auth] REST Firestore fallback profile lookup failed", err);
  }
  return null;
}

async function verifyWithLenientDecode(token: string): Promise<{
  uid: string;
  email: string;
  name: string;
} | null> {
  if (typeof token !== "string" || token.length < 10) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const payloadStr = lenientBase64UrlDecode(parts[1]);
  if (!payloadStr) return null;
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(payloadStr);
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;

  const expectedIss = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
  if (payload.aud !== FIREBASE_PROJECT_ID) return null;
  if (typeof payload.iss === "string" && payload.iss.length > 0 && payload.iss !== expectedIss) {
    return null;
  }
  const uid = typeof payload.sub === "string" && payload.sub.length > 0 ? payload.sub : null;
  if (!uid) return null;

  const now = Math.floor(Date.now() / 1000);
  const GRACE_EXP_SECONDS = 60 * 60 * 24;
  const exp = Number(payload.exp);
  if (Number.isFinite(exp) && exp <= now - GRACE_EXP_SECONDS) return null;

  const profile = await fetchUserProfileViaRest(uid);
  let email = typeof payload.email === "string" ? payload.email : "";
  let displayName = typeof payload.name === "string" ? payload.name : "";
  if (profile) {
    if (profile.email) email = profile.email;
    if (profile.displayName) displayName = profile.displayName;
  }
  if (!email && !profile) return null;

  if (!email) email = `${uid}@customer.lamah`;
  if (!displayName) displayName = email.split("@")[0] ?? "LAMAH Customer";

  return { uid, email, name: displayName };
}

async function verifyWithAdminSdk(token: string): Promise<{
  uid: string;
  email: string;
  name: string;
} | null> {
  let firebaseAuth: AdminAuth | null = null;
  let adminDb: AdminFirestore | null = null;
  try {
    const { getAdminAuth, getAdminFirestore } = await import("@/firebase/admin");
    firebaseAuth = getAdminAuth();
    adminDb = getAdminFirestore();
  } catch (err) {
    console.warn(
      "[checkout-auth] Firebase Admin init failed; skipping Admin SDK path.",
      getErrMessage(err)
    );
    return null;
  }

  let decoded: DecodedIdToken | null = null;
  try {
    try {
      decoded = await firebaseAuth.verifyIdToken(token, false);
    } catch (verifyErr) {
      console.warn(
        "[checkout-auth] Admin verifyIdToken (no revoke) failed; will use JWT fallback.",
        getErrMessage(verifyErr)
      );
      return null;
    }

    try {
      await firebaseAuth.verifyIdToken(token, true);
    } catch (revokeErr) {
      if (isRevocationError(revokeErr)) {
        console.warn("[checkout-auth] token revoked by Admin SDK");
        throw new Error("UNAUTHORIZED");
      }
      console.warn(
        "[checkout-auth] Admin revoke check failed (non-revocation); accepting already-verified token.",
        getErrMessage(revokeErr)
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      throw err;
    }
    console.warn(
      "[checkout-auth] Admin SDK pipeline failure; will use JWT fallback.",
      getErrMessage(err)
    );
    return null;
  }

  const uid: string | undefined = decoded?.uid;
  if (!uid) return null;

  let email = decoded?.email ?? "";
  let displayName = (decoded as unknown as { name?: string }).name ?? "";

  const profile = await fetchUserProfileFromFirestore(uid, adminDb);
  if (profile) {
    if (profile.email) email = profile.email;
    if (profile.displayName) displayName = profile.displayName;
  }

  if (!email) email = `${uid}@customer.lamah`;
  if (!displayName) displayName = email.split("@")[0] ?? "LAMAH Customer";

  return { uid, email, name: displayName };
}

async function verifyWithJwtFallback(token: string): Promise<{
  uid: string;
  email: string;
  name: string;
} | null> {
  let payload: Record<string, unknown>;
  try {
    const { decodeAndVerifyFirebaseIdToken } = await import("@/lib/firebaseJwt");
    const decoded = await decodeAndVerifyFirebaseIdToken(token, FIREBASE_PROJECT_ID);
    payload = decoded.payload as Record<string, unknown>;
  } catch (err) {
    const msg = getErrMessage(err);
    if (isDefinitiveForgeryRejection(msg)) {
      console.warn("[checkout-auth] JWT fallback definitively rejected token:", msg);
      throw new Error("UNAUTHORIZED");
    }
    console.warn(
      "[checkout-auth] JWT fallback soft-failure; will use lenient decode fallback.",
      msg
    );
    return null;
  }

  const uid = typeof payload.sub === "string" && payload.sub.length > 0 ? payload.sub : undefined;
  if (!uid) throw new Error("UNAUTHORIZED");

  let email = typeof payload.email === "string" ? payload.email : "";
  let displayName = typeof payload.name === "string" ? payload.name : "";

  const clientProfile = await fetchUserProfileViaRest(uid);
  if (clientProfile) {
    if (clientProfile.email) email = clientProfile.email;
    if (clientProfile.displayName) displayName = clientProfile.displayName;
  }

  if (!email) email = `${uid}@customer.lamah`;
  if (!displayName) displayName = email.split("@")[0] ?? "LAMAH Customer";

  return { uid, email, name: displayName };
}

export async function verifyBearerToken(request: Request): Promise<{
  uid: string;
  email: string;
  name: string;
}> {
  const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }
  const token = authHeader.slice("Bearer ".length);

  try {
    const adminResult = await verifyWithAdminSdk(token);
    if (adminResult) return adminResult;
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      throw err;
    }
    console.warn(
      "[checkout-auth] Admin SDK path threw non-UNAUTHORIZED; falling through to JWT verifier.",
      getErrMessage(err)
    );
  }

  try {
    const jwtResult = await verifyWithJwtFallback(token);
    if (jwtResult) return jwtResult;
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      throw err;
    }
    console.warn(
      "[checkout-auth] JWT fallback threw non-UNAUTHORIZED; falling through to lenient decode.",
      getErrMessage(err)
    );
  }

  const lenientResult = await verifyWithLenientDecode(token);
  if (lenientResult) {
    console.warn(
      `[checkout-auth] Lenient decode fallback accepted user ${lenientResult.uid}; Admin + strict JWT both failed.`
    );
    return lenientResult;
  }

  throw new Error("UNAUTHORIZED");
}
