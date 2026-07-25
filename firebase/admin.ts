
/**
 * Firebase Admin SDK (lazy / safe initialization)
 *
 * - Does NOT throw at module-import time.
 * - Private key is parsed (and validated) only when `initFirebaseAdmin()` / the
 *   lazy getters are actually called (inside request handlers, NOT during
 *   Next.js static/page-data collection).
 * - Tolerates missing env vars during `next build` so prerendering of routes
 *   that only import this module can still succeed.
 */

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import type { App as AdminApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { Auth as AdminAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { Firestore as AdminFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { Storage as AdminStorage } from "firebase-admin/storage";

let appCache: AdminApp | null = null;
let authCache: AdminAuth | null = null;
let dbCache: AdminFirestore | null = null;
let storageCache: AdminStorage | null = null;
let hasInitFailed = false;

function readPrivateKeyFromEnv(): string | null {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return null;
  // Support both JSON-style `\n` literal escapes (typical for Vercel) and real newlines.
  // Keep the full key intact; only unescape the newline control sequence.
  if (raw.includes("\\n") && !raw.includes("\n")) {
    return raw.replace(/\\n/g, "\n");
  }
  return raw;
}

export function initFirebaseAdmin(): AdminApp {
  if (appCache) return appCache;

  const existing = getApps().length > 0 ? getApp() : null;
  if (existing) {
    appCache = existing;
    return existing;
  }

  if (hasInitFailed) {
    throw new Error(
      "Firebase Admin failed to initialize earlier — check your FIREBASE_* environment variables."
    );
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = readPrivateKeyFromEnv();
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (projectId && clientEmail && privateKey) {
      const credential = cert({
        projectId,
        clientEmail,
        privateKey,
      });
      initializeApp({
        credential,
        ...(storageBucket ? { storageBucket } : {}),
      });
    } else {
      // Application Default Credentials (GCP / Firebase Emulator / local dev)
      initializeApp();
    }

    appCache = getApp();
    return appCache;
  } catch (err) {
    hasInitFailed = true;
    const message =
      err instanceof Error ? err.message : "Unknown Firebase Admin init error";
    throw new Error(`Failed to initialize Firebase Admin: ${message}`, {
      cause: err,
    });
  }
}

export function getAdminAuth(): AdminAuth {
  if (authCache) return authCache;
  const theApp = initFirebaseAdmin();
  authCache = getAuth(theApp);
  return authCache;
}

export function getAdminFirestore(): AdminFirestore {
  if (dbCache) return dbCache;
  const theApp = initFirebaseAdmin();
  dbCache = getFirestore(theApp);
  return dbCache;
}

export function getAdminStorage(): AdminStorage {
  if (storageCache) return storageCache;
  const theApp = initFirebaseAdmin();
  storageCache = getStorage(theApp);
  return storageCache;
}

// Convenience getters — only resolve after a successful lazy init inside a request.
// Named `auth` / `db` / `storage` for backwards compatibility with callers that
// import `{ auth }` etc. (but note: these are getters, not values, so they throw
// only at access time if init has never been called successfully).
export const auth = new Proxy(
  {},
  {
    get(_target, prop, receiver) {
      const resolved = getAdminAuth() as unknown as Record<string | symbol, unknown>;
      if (prop in resolved) {
        const value = resolved[prop as string | symbol];
        return typeof value === "function"
          ? (value as (...args: unknown[]) => unknown).bind(resolved)
          : Reflect.get(resolved, prop, receiver);
      }
      return undefined;
    },
  }
) as unknown as AdminAuth;

export const db = new Proxy(
  {},
  {
    get(_target, prop, receiver) {
      const resolved = getAdminFirestore() as unknown as Record<string | symbol, unknown>;
      if (prop in resolved) {
        const value = resolved[prop as string | symbol];
        return typeof value === "function"
          ? (value as (...args: unknown[]) => unknown).bind(resolved)
          : Reflect.get(resolved, prop, receiver);
      }
      return undefined;
    },
  }
) as unknown as AdminFirestore;

export const storage = new Proxy(
  {},
  {
    get(_target, prop, receiver) {
      const resolved = getAdminStorage() as unknown as Record<string | symbol, unknown>;
      if (prop in resolved) {
        const value = resolved[prop as string | symbol];
        return typeof value === "function"
          ? (value as (...args: unknown[]) => unknown).bind(resolved)
          : Reflect.get(resolved, prop, receiver);
      }
      return undefined;
    },
  }
) as unknown as AdminStorage;

export const app = new Proxy(
  {},
  {
    get(_target, prop, receiver) {
      const resolved = initFirebaseAdmin() as unknown as Record<string | symbol, unknown>;
      if (prop in resolved) {
        const value = resolved[prop as string | symbol];
        return typeof value === "function"
          ? (value as (...args: unknown[]) => unknown).bind(resolved)
          : Reflect.get(resolved, prop, receiver);
      }
      return undefined;
    },
  }
) as unknown as AdminApp;
