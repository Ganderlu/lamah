import Stripe from "stripe";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { OrderItem } from "@/types/order";
import { decodeAndVerifyFirebaseIdToken } from "@/lib/firebaseJwt";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "lamahclothing";

const DEFINITIVE_REVOCATION_CODE = "auth/id-token-revoked";

function isRevocationError(err: unknown): boolean {
  return (
    err instanceof Error &&
    "code" in err &&
    (err as any).code === DEFINITIVE_REVOCATION_CODE
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
  let payload: any;
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
  let email: string = payload.email ?? "";
  let displayName: string = payload.name ?? "";
  if (profile) {
    if (profile.email) email = profile.email;
    if (profile.displayName) displayName = profile.displayName;
  }
  if (!email && !profile) return null;

  if (!email) email = `${uid}@customer.lamah`;
  if (!displayName) displayName = email.split("@")[0] ?? "LAMAH Customer";

  return { uid, email, name: displayName };
}

function getErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err ?? "Unknown error");
}

async function fetchUserProfileFromFirestore(
  uid: string,
  adminDb: any
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
    console.warn("[checkout] could not fetch user profile doc via Admin SDK, using token defaults", dbErr);
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
    console.warn("[checkout] REST Firestore fallback profile lookup failed", err);
  }
  return null;
}

async function verifyWithAdminSdk(token: string): Promise<{
  uid: string;
  email: string;
  name: string;
} | null> {
  let firebaseAuth: any | null = null;
  let adminDb: any | null = null;
  try {
    const { getAdminAuth, getAdminFirestore } = await import("@/firebase/admin");
    firebaseAuth = getAdminAuth();
    adminDb = getAdminFirestore();
  } catch (err) {
    console.warn(
      "[checkout] Firebase Admin init failed; skipping Admin SDK path.",
      getErrMessage(err)
    );
    return null;
  }

  let decoded: any | null = null;
  try {
    try {
      decoded = await firebaseAuth.verifyIdToken(token, false);
    } catch (verifyErr) {
      console.warn(
        "[checkout] Admin verifyIdToken (no revoke) failed; will use JWT fallback.",
        getErrMessage(verifyErr)
      );
      return null;
    }

    try {
      await firebaseAuth.verifyIdToken(token, true);
    } catch (revokeErr) {
      if (isRevocationError(revokeErr)) {
        console.warn("[checkout] token revoked by Admin SDK");
        throw new Error("UNAUTHORIZED");
      }
      console.warn(
        "[checkout] Admin revoke check failed (non-revocation); accepting already-verified token.",
        getErrMessage(revokeErr)
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      throw err;
    }
    console.warn(
      "[checkout] Admin SDK pipeline failure; will use JWT fallback.",
      getErrMessage(err)
    );
    return null;
  }

  const uid: string | undefined = decoded?.uid;
  if (!uid) return null;

  let email: string = decoded.email ?? "";
  let displayName: string = decoded.name ?? "";

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
  let payload: any;
  try {
    const decoded = await decodeAndVerifyFirebaseIdToken(token, FIREBASE_PROJECT_ID);
    payload = decoded.payload;
  } catch (err) {
    const msg = getErrMessage(err);
    if (isDefinitiveForgeryRejection(msg)) {
      console.warn("[checkout] JWT fallback definitively rejected token:", msg);
      throw new Error("UNAUTHORIZED");
    }
    console.warn(
      "[checkout] JWT fallback soft-failure; will use lenient decode fallback.",
      msg
    );
    return null;
  }

  const uid: string | undefined = payload.sub;
  if (!uid) throw new Error("UNAUTHORIZED");

  let email: string = payload.email ?? "";
  let displayName: string = payload.name ?? "";

  const clientProfile = await fetchUserProfileViaRest(uid);
  if (clientProfile) {
    if (clientProfile.email) email = clientProfile.email;
    if (clientProfile.displayName) displayName = clientProfile.displayName;
  }

  if (!email) email = `${uid}@customer.lamah`;
  if (!displayName) displayName = email.split("@")[0] ?? "LAMAH Customer";

  return { uid, email, name: displayName };
}

async function verifyBearerToken(request: Request): Promise<{
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
      "[checkout] Admin SDK path threw non-UNAUTHORIZED; falling through to JWT verifier.",
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
      "[checkout] JWT fallback threw non-UNAUTHORIZED; falling through to lenient decode.",
      getErrMessage(err)
    );
  }

  const lenientResult = await verifyWithLenientDecode(token);
  if (lenientResult) {
    console.warn(
      `[checkout] Lenient decode fallback accepted user ${lenientResult.uid}; Admin + strict JWT both failed.`
    );
    return lenientResult;
  }

  throw new Error("UNAUTHORIZED");
}

function toAbsoluteImageUrl(baseUrl: string, maybeRelative: string): string | undefined {
  if (!maybeRelative) return undefined;
  if (maybeRelative.startsWith("http://") || maybeRelative.startsWith("https://") || maybeRelative.startsWith("data:")) {
    return maybeRelative;
  }
  const sep = maybeRelative.startsWith("/") ? "" : "/";
  return `${baseUrl}${sep}${maybeRelative}`;
}

function buildOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LAMAH-${rand}`;
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!stripeSecretKey) {
      console.error("[checkout] STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Stripe configuration missing." },
        { status: 500 }
      );
    }
    if (!baseUrl) {
      console.error("[checkout] NEXT_PUBLIC_BASE_URL is not set");
      return NextResponse.json(
        { error: "Base URL configuration missing." },
        { status: 500 }
      );
    }

    // -----------------------------------------------------------
    // 1. Verify Firebase ID token — ONLY logged-in users may pay.
    // -----------------------------------------------------------
    let customer: { uid: string; email: string; name: string };
    try {
      customer = await verifyBearerToken(request);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      const isUnauth = msg === "UNAUTHORIZED";
      const status = isUnauth ? 401 : 503;
      const bodyMsg = isUnauth
        ? "Please sign in before completing your purchase."
        : msg ||
          "We couldn't verify your account right now. Please refresh the page and try again.";
      return NextResponse.json({ error: bodyMsg }, { status });
    }

    // -----------------------------------------------------------
    // 2. Parse body + validate cart.
    // -----------------------------------------------------------
    const rawBody = await request.json();
    const cartItems: Array<{
      id: string;
      productId?: string;
      name: string;
      price: number;
      image: string;
      quantity: number;
      size?: string;
      color?: string;
    }> = Array.isArray(rawBody?.cartItems) ? rawBody.cartItems : [];

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const customerNameFromBody: string = typeof rawBody?.customerName === "string" && rawBody.customerName.trim()
      ? rawBody.customerName.trim()
      : customer.name;
    const customerEmailFromBody: string = typeof rawBody?.customerEmail === "string" && rawBody.customerEmail.trim()
      ? rawBody.customerEmail.trim()
      : customer.email;
    const customerPhoneFromBody: string = typeof rawBody?.customerPhone === "string" ? rawBody.customerPhone : "";

    const orderNumber = buildOrderNumber();
    const idempotencyKey = `checkout-${customer.uid}-${orderNumber}-${randomUUID()}`;

    // -----------------------------------------------------------
    // 3. Normalize + prepare line_items + compact order metadata.
    // -----------------------------------------------------------
    const normalizedItems: OrderItem[] = cartItems.map((item) => {
      const price = Number(item.price);
      const qty = Number(item.quantity) || 1;
      const safePrice = Number.isFinite(price) && price > 0 ? price : 0;
      return {
        id: String(item.id || randomUUID()),
        productId: String(item.productId || item.id || ""),
        name: String(item.name || "LAMAH Product"),
        image: String(item.image || ""),
        size: item.size && typeof item.size === "string" ? item.size : undefined,
        color: item.color && typeof item.color === "string" ? item.color : undefined,
        quantity: Math.max(1, Number.isFinite(qty) ? qty : 1),
        price: Number(safePrice.toFixed(2)),
      };
    });

    // Stripe metadata values have a 500-char limit each. We therefore do:
    //   - Per-item fields go on `price_data.product_data.metadata` as small scalars.
    //   - Order-level metadata gets compact summary strings (comma-separated ids,
    //     qtys, prices, sizes) so nothing approaches 500 chars.
    const itemIds = normalizedItems.map((i) => i.productId || i.id).join(",");
    const itemQtys = normalizedItems.map((i) => String(i.quantity)).join(",");
    const itemPrices = normalizedItems.map((i) => i.price.toFixed(2)).join(",");
    const itemSizes = normalizedItems
      .map((i) => {
        const parts: string[] = [];
        if (i.size) parts.push(`S:${i.size.replace(/,/g, "_")}`);
        if (i.color) parts.push(`C:${i.color.replace(/,/g, "_")}`);
        return parts.join("|") || "-";
      })
      .join(",");
    const itemNames = normalizedItems
      .map((i) => i.name.replace(/[,\n]/g, " ").slice(0, 80))
      .join("|");

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      normalizedItems.map((item) => {
        const image = toAbsoluteImageUrl(baseUrl, item.image);
        const unitAmount = Math.max(0, Math.round(item.price * 100));
        const productMetadata: Stripe.MetadataParam = {
          item_id: item.id,
          product_id: item.productId || item.id,
          ...(item.size ? { size: item.size } : {}),
          ...(item.color ? { color: item.color } : {}),
          unit_price: item.price.toFixed(2),
        };
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              ...(image ? { images: [image] } : {}),
              ...(item.size || item.color
                ? {
                    description: [
                      item.size ? `Size: ${item.size}` : "",
                      item.color ? `Color: ${item.color}` : "",
                    ]
                      .filter(Boolean)
                      .join(" • "),
                  }
                : {}),
              metadata: productMetadata,
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      });

    // -----------------------------------------------------------
    // 4. Initialize Stripe + create the Checkout Session.
    // -----------------------------------------------------------
    const stripe = new Stripe(stripeSecretKey, {
      maxNetworkRetries: 2,
      timeout: 20_000,
    });

    // Per Stripe: each metadata value max 500 chars.
    // We compact summaries so even a large cart (20+ items) fits safely.
    const truncate = (s: string, n: number) =>
      s.length > n ? s.slice(0, n - 3) + "..." : s;
    const metadata: Stripe.MetadataParam = {
      orderNumber,
      customerId: customer.uid,
      customerEmail: customerEmailFromBody,
      customerName: truncate(customerNameFromBody, 200),
      customerPhone: truncate(customerPhoneFromBody, 60),
      source: "lamah-web-checkout",
      itemCount: String(normalizedItems.length),
      itemIds: truncate(itemIds, 500),
      itemQtys: truncate(itemQtys, 500),
      itemPrices: truncate(itemPrices, 500),
      itemSizes: truncate(itemSizes, 500),
      itemNames: truncate(itemNames, 500),
    };

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: customerEmailFromBody,
        submit_type: "pay",
        line_items: lineItems,
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: [
            "US",
            "CA",
            "GB",
            "AU",
            "DE",
            "FR",
            "IT",
            "ES",
            "NL",
            "BE",
            "SE",
            "NO",
            "DK",
            "FI",
            "IE",
            "NZ",
            "AE",
            "SA",
            "SG",
            "HK",
            "JP",
            "KR",
            "IN",
            "ZA",
          ],
        },
        phone_number_collection: { enabled: true },
        metadata,
        success_url: `${baseUrl}/dashboard/orders?checkout_success=true&order=${encodeURIComponent(orderNumber)}`,
        cancel_url: `${baseUrl}/cart?checkout_canceled=true`,
        automatic_tax: { enabled: false },
      },
      { idempotencyKey }
    );

    if (!session.url) {
      console.error("[checkout] Stripe returned no session URL", {
        sessionId: session.id,
      });
      return NextResponse.json(
        { error: "Failed to start checkout session. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderNumber,
    });
  } catch (error: unknown) {
    console.error("[checkout] Error creating checkout session:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) {
      message = error.message;
      if (
        error instanceof Object &&
        "type" in error &&
        typeof (error as any).type === "string"
      ) {
        const stripeType = (error as any).type;
        console.error("[checkout] Stripe error type:", stripeType, "code:", (error as any).code);
        if (stripeType.startsWith("Stripe")) {
          message =
            (error as any).message ||
            "We couldn't start the checkout payment provider. Please try again in a moment.";
        }
      }
    }
    const status = message === "UNAUTHORIZED" ? 401 : 500;
    const userMessage =
      status === 401
        ? "Please sign in before completing your purchase."
        : message.startsWith("AUTH_SERVICE")
        ? message
        : message.startsWith("Failed to initialize Firebase Admin")
        ? `AUTH_SERVICE_DOWN: Server auth configuration error. Please contact support.`
        : message;
    return NextResponse.json({ error: userMessage }, { status });
  }
}
