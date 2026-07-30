
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

const USER_APP_NAME = "[DEFAULT]";
const ADMIN_APP_NAME = "lamah-admin";

const getOrCreateApp = (name: string): FirebaseApp => {
  const existing = getApps().find((app) => app.name === name);
  if (existing) return existing;
  return initializeApp(firebaseConfig, name);
};

// Primary (customer / user) app and auth
const userApp = getOrCreateApp(USER_APP_NAME);
const auth = getAuth(userApp);

// Separate admin app and auth — independent session / persistence from the user app
const adminApp = getOrCreateApp(ADMIN_APP_NAME);
const adminAuth = getAuth(adminApp);

// Shared Firestore / Storage instances (data is partitioned by collection)
const db = getFirestore(userApp);
const storage = getStorage(userApp);
const analytics = typeof window !== 'undefined' ? getAnalytics(userApp) : null;

export { auth, adminAuth, db, storage, analytics };
