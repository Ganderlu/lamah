
/**
 * Firebase Admin SDK
 * NOTE: Never commit your service-account.json to GitHub! It's already in .gitignore!
 */

import admin from "firebase-admin";
import serviceAccount from "./service-account.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

export { admin, auth, db, storage };
