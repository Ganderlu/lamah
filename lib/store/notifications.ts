"use client";

import { create } from "zustand";
import { db, auth } from "@/firebase/client";
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

interface NotificationsStore {
  items: Notification[];
  loading: boolean;
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  initializeNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => {
  let unsubscribeAuth: (() => void) | null = null;

  const loadFromFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      set({ items: [], loading: false, unreadCount: 0 });
      return;
    }

    try {
      const notificationsRef = collection(db, "notifications");
      let querySnapshot;
      let usedOrderBy = true;
      
      // Try with orderBy first (requires composite index)
      try {
        const q = query(
          notificationsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(50)
        );
        querySnapshot = await getDocs(q);
      } catch (indexError) {
        // If index error, fall back to query without orderBy
        console.warn("Falling back to notifications query without orderBy - create the index here:", "https://console.firebase.google.com/v1/r/project/lamahclothing/firestore/indexes?create_composite=ClNwcm9qZWN0cy9sYW1haGNsb3RoaW5nL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9ub3RpZmljYXRpb25zL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI");
        const fallbackQ = query(
          notificationsRef,
          where("userId", "==", user.uid),
          limit(50)
        );
        querySnapshot = await getDocs(fallbackQ);
        usedOrderBy = false;
      }
      
      const items: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          message: data.message,
          type: data.type,
          read: data.read,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      // If we didn't order by createdAt, sort locally
      if (!usedOrderBy) {
        items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      const unreadCount = items.filter((item) => !item.read).length;

      set({ items, loading: false, unreadCount });
    } catch (error) {
      console.error("Error loading notifications:", error);
      set({ items: [], loading: false, unreadCount: 0 });
    }
  };

  return {
    items: [],
    loading: true,
    unreadCount: 0,

    initializeNotifications: () => {
      if (unsubscribeAuth) return;

      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await loadFromFirestore();
        } else {
          set({ items: [], loading: false, unreadCount: 0 });
        }
      });
    },

    fetchNotifications: async () => {
      await loadFromFirestore();
    },

    markAsRead: async (id: string) => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const notificationRef = doc(db, "notifications", id);
        await setDoc(notificationRef, { read: true }, { merge: true });
        
        // Update local state
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, read: true } : item
          );
          const unreadCount = newItems.filter((item) => !item.read).length;
          return { items: newItems, unreadCount };
        });
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },

    markAllAsRead: async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Update local state first
        set((state) => {
          const newItems = state.items.map((item) => ({ ...item, read: true }));
          return { items: newItems, unreadCount: 0 };
        });

        // TODO: Update Firestore in bulk (could use batch write)
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    },
  };
});
