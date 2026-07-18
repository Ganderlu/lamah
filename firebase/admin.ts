
/**
 * Firebase Admin SDK
 * Use environment variables on Vercel instead of a local service-account.json file.
 */

import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      ...(storageBucket ? { storageBucket } : {}),
    });
  } else {
    admin.initializeApp();
  }
}

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

export { admin, auth, db, storage };
