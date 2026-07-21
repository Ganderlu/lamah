"use client";

import { create } from "zustand";
import { db, auth } from "@/firebase/client";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  loading: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  initializeCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => {
  let unsubscribeAuth: (() => void) | null = null;

  const syncToFirestore = async (items: CartItem[]) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const cartRef = doc(db, "carts", user.uid);
      await setDoc(cartRef, { items, updatedAt: new Date() }, { merge: true });
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const loadFromFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      set({ items: [], loading: false });
      return;
    }

    try {
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        const data = cartSnap.data();
        set({ items: data.items || [], loading: false });
      } else {
        set({ items: [], loading: false });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      set({ items: [], loading: false });
    }
  };

  return {
    items: [],
    loading: true,

    initializeCart: () => {
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
      const existingItem = currentItems.find((i) => i.id === item.id);
      
      let newItems;
      if (existingItem) {
        newItems = currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...currentItems, { ...item, quantity: 1 }];
      }

      set({ items: newItems });
      await syncToFirestore(newItems);
    },

    removeItem: async (id) => {
      const newItems = get().items.filter((i) => i.id !== id);
      set({ items: newItems });
      await syncToFirestore(newItems);
    },

    updateQuantity: async (id, quantity) => {
      const newItems = get().items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      );
      set({ items: newItems });
      await syncToFirestore(newItems);
    },

    clearCart: async () => {
      set({ items: [] });
      await syncToFirestore([]);
    },

    getTotalItems: () =>
      get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
      get().items.reduce((total, item) => total + item.price * item.quantity, 0),
  };
});
