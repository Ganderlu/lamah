import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase/client";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import type { AuthUserProfile } from "@/lib/store/auth";

// Fetch user profile from Firestore
export const fetchUserProfile = async (uid: string): Promise<AuthUserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AuthUserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (
  uid: string,
  data: Partial<Omit<AuthUserProfile, "uid">>
): Promise<void> => {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Update user email (requires reauth)
export const updateUserEmail = async (
  user: User,
  newEmail: string,
  password: string
): Promise<void> => {
  try {
    if (!user.email) throw new Error("No email found");
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};

// Update user password (requires reauth)
export const updateUserPassword = async (
  user: User,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    if (!user.email) throw new Error("No email found");
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
