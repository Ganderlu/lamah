
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRKQjpatOqRthffdSeXhOyUZ3C04abLXs",
  authDomain: "lamahclothing.firebaseapp.com",
  projectId: "lamahclothing",
  storageBucket: "lamahclothing.firebasestorage.app",
  messagingSenderId: "1021007445890",
  appId: "1:1021007445890:web:803a8996ef6a437182d99b",
  measurementId: "G-NR36Z3J6KB"
};

// Single shared Firebase App for BOTH customers and admins.
//
// We previously used a separate "lamah-admin" app so you could be signed-in
// as both a customer and an admin in one browser.  But because Firestore
// (`db`) was always attached to the user app, admin sign-ins were never
// propagated to Firestore security rules → "Missing or insufficient
// permissions".  We now use ONE app so Firestore rules always see the
// signed-in user's `request.auth.uid`, whether they are a customer or an
// admin. Role-based access is still enforced in firestore.rules (admins
// collection + user.role checks).
const getOrCreateApp = (name?: string): FirebaseApp => {
  const existing = getApps().find((app) => app.name === (name ?? "[DEFAULT]"));
  if (existing) return existing;
  return initializeApp(firebaseConfig, name);
};

const app = getOrCreateApp();
const auth = getAuth(app);

// `adminAuth` now points to the SAME Auth instance. This keeps all existing
// code that imports & uses `adminAuth` working without renames — sign-in,
// sign-out, onAuthStateChanged, createUserWithEmailAndPassword all still
// behave exactly the same, but now Firestore actually sees the admin's uid.
const adminAuth = auth;

const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Kept for backwards compatibility for any code that might have already
// imported `adminDb` / `adminStorage` (they now all point to the same
// shared instance).
const adminDb = db;
const adminStorage = storage;

export { auth, adminAuth, db, storage, analytics, adminDb, adminStorage };
