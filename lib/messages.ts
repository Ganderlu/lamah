import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Message } from "@/types/message";

// Helper to safely convert timestamps
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

// Fetch all messages
export const fetchMessages = async (): Promise<Message[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "messages"));
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId || "",
        senderName: data.senderName || "",
        senderEmail: data.senderEmail || "",
        message: data.message || "",
        read: data.read || false,
        createdAt: toISOString(data.createdAt),
      };
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Fetch unread messages count
export const fetchUnreadMessagesCount = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, "messages"),
      where("read", "==", false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    return 0;
  }
};
