import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Notification } from "@/types/notification";

// Helper to safely convert timestamps
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

// Fetch all notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        message: data.message || "",
        type: data.type || "info",
        read: data.read || false,
        createdAt: toISOString(data.createdAt),
      };
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Fetch unread notifications count
export const fetchUnreadNotificationsCount = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("read", "==", false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return 0;
  }
};
