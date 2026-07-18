
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
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

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // if already initialized, use that one
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, storage, analytics };
