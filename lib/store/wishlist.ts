"use client";

import { create } from "zustand";
import { db, auth } from "@/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (id: string) => boolean;
  initializeWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => {
  let unsubscribeAuth: (() => void) | null = null;

  const syncToFirestore = async (items: WishlistItem[]) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const wishlistRef = doc(db, "wishlists", user.uid);
      await setDoc(wishlistRef, { items, updatedAt: new Date() }, { merge: true });
    } catch (error) {
      console.error("Error syncing wishlist:", error);
    }
  };

  const loadFromFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      set({ items: [], loading: false });
      return;
    }

    try {
      const wishlistRef = doc(db, "wishlists", user.uid);
      const wishlistSnap = await getDoc(wishlistRef);
      
      if (wishlistSnap.exists()) {
        const data = wishlistSnap.data();
        set({ items: data.items || [], loading: false });
      } else {
        set({ items: [], loading: false });
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      set({ items: [], loading: false });
    }
  };

  return {
    items: [],
    loading: true,

    initializeWishlist: () => {
      if (unsubscribeAuth) return;

      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await loadFromFirestore();
        } else {
          set({ items: [], loading: false });
        }
      });
    },

    addItem: async (item) => {
      const currentItems = get().items;
      const exists = currentItems.find((i) => i.id === item.id);
      
      if (!exists) {
        const newItems = [...currentItems, item];
        set({ items: newItems });
        await syncToFirestore(newItems);
      }
    },

    removeItem: async (id) => {
      const newItems = get().items.filter((i) => i.id !== id);
      set({ items: newItems });
      await syncToFirestore(newItems);
    },

    clearWishlist: async () => {
      set({ items: [] });
      await syncToFirestore([]);
    },

    isInWishlist: (id) => get().items.some((item) => item.id === id),
  };
});
