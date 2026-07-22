import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Admin } from "@/types/admin";

// Helper to safely convert timestamps
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

// Fetch admin profile (first admin)
export const fetchAdminProfile = async (): Promise<Admin | null> => {
  try {
    const q = query(collection(db, "admins"), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      name: data.name || "Admin",
      email: data.email || "",
      avatar: data.avatar || "",
      role: data.role || "admin",
      createdAt: toISOString(data.createdAt),
    };
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return null;
  }
};
