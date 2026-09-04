
import { createVerify } from "node:crypto";

const SECURETOKEN_X509_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

type CacheEntry = {
  keys: Record<string, string>;
  fetchedAt: number;
  ttlMs: number;
};

let keysCache: CacheEntry | null = null;

function base64UrlDecode(input: string): string {
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
}

function base64UrlToBuffer(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad === 0 ? base64 : base64 + "=".repeat(4 - pad);
  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(padded, "base64"));
  }
  const binary = atob(padded);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function parseCacheTtl(cacheControl: string | null): number {
  if (!cacheControl) return 60 * 60 * 1000;
  const match = /max-age\s*=\s*(\d+)/i.exec(cacheControl);
  if (match && match[1]) {
    const seconds = parseInt(match[1], 10);
    if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
  }
  return 60 * 60 * 1000;
}

async function fetchKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  if (keysCache && now - keysCache.fetchedAt < keysCache.ttlMs) {
    return keysCache.keys;
  }

  const res = await fetch(SECURETOKEN_X509_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Firebase public keys: HTTP ${res.status} ${res.statusText}`
    );
  }
  const cacheControl = res.headers.get("cache-control");
  const ttlMs = parseCacheTtl(cacheControl);
  const keys = (await res.json()) as Record<string, string>;
  keysCache = { keys, fetchedAt: now, ttlMs };
  return keys;
}

function pemToDerPublicKey(pem: string): string {
  // Node crypto's createVerify accepts the x509 PEM certificate directly.
  // We wrap and return as-is; begin/end markers are required.
  if (
    pem.includes("-----BEGIN CERTIFICATE-----") ||
    pem.includes("-----BEGIN PUBLIC KEY-----")
  ) {
    return pem;
  }
  return `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----\n`;
}

function verifyRsaSha256(
  signingInput: string,
  signatureBytes: Uint8Array,
  publicKeyPem: string
): boolean {
  const key = pemToDerPublicKey(publicKeyPem);
  const verifier = createVerify("RSA-SHA256");
  verifier.update(signingInput, "utf-8");
  return verifier.verify(key, Buffer.from(signatureBytes));
}

export interface DecodedFirebaseIdToken {
  header: {
    alg: string;
    kid: string;
    typ?: string;
  };
  payload: {
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    sub: string;
    auth_time?: number;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    user_id?: string;
    firebase?: Record<string, unknown>;
    [k: string]: unknown;
  };
}

export async function decodeAndVerifyFirebaseIdToken(
  token: string,
  projectId: string
): Promise<DecodedFirebaseIdToken> {
  if (typeof token !== "string" || token.length < 10) {
    throw new Error("Invalid ID token format.");
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid ID token format.");
  }

  let header: DecodedFirebaseIdToken["header"];
  let payload: DecodedFirebaseIdToken["payload"];
  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new Error("Invalid ID token encoding.");
  }

  if (!header || typeof header !== "object") throw new Error("Invalid ID token header.");
  if (header.alg !== "RS256") {
    throw new Error(`Unsupported token algorithm: ${String(header.alg ?? "none")}`);
  }
  if (!header.kid || typeof header.kid !== "string") {
    throw new Error("ID token header missing 'kid'.");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid ID token payload.");
  }

  const now = Math.floor(Date.now() / 1000);
  const CLOCK_SKEW_SECONDS = 60;
  const exp = Number(payload.exp);
  if (!Number.isFinite(exp) || exp <= now - CLOCK_SKEW_SECONDS) {
    throw new Error("ID token has expired.");
  }
  const iat = Number(payload.iat);
  if (!Number.isFinite(iat) || iat > now + 300) {
    throw new Error("ID token 'iat' is in the future.");
  }
  const auth_time = payload.auth_time != null ? Number(payload.auth_time) : null;
  if (auth_time != null && Number.isFinite(auth_time) && auth_time > now + 300) {
    throw new Error("ID token 'auth_time' is in the future.");
  }
  if (payload.aud !== projectId) {
    throw new Error(
      `ID token has wrong audience (aud="${String(payload.aud)}"). Expected "${projectId}".`
    );
  }
  const expectedIss = `https://securetoken.google.com/${projectId}`;
  if (payload.iss !== expectedIss) {
    throw new Error(
      `ID token has wrong issuer (iss="${String(payload.iss)}"). Expected "${expectedIss}".`
    );
  }
  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("ID token missing 'sub' claim.");
  }
  if (payload.user_id && typeof payload.user_id === "string") {
    if (payload.user_id !== payload.sub) {
      throw new Error("ID token 'user_id' does not match 'sub'.");
    }
  }

  const keys = await fetchKeys();
  const publicKeyPem = keys[header.kid];
  if (!publicKeyPem) {
    throw new Error(
      `Firebase public key for kid="${header.kid}" not found in latest key set. The token may be forged or the key set has rotated — please sign in again.`
    );
  }

  const signingInput = `${parts[0]}.${parts[1]}`;
  const signatureBytes = base64UrlToBuffer(parts[2]);
  const ok = verifyRsaSha256(signingInput, signatureBytes, publicKeyPem);
  if (!ok) {
    throw new Error(
      "ID token signature verification failed. The token may be forged or corrupted — please sign in again."
    );
  }

  return { header, payload };
}
