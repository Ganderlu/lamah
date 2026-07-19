import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import type { NewArrival } from "@/types/newArrival";

// Helper to safely convert to ISO string
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") {
    // It's a Firestore Timestamp
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return new Date().toISOString();
};

// Fetch all new arrivals
export const fetchNewArrivals = async (
  statusFilter?: "All" | "Active" | "Draft" | "Inactive"
): Promise<NewArrival[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "newArrivals"));
    let arrivals = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        productName: data.productName || "",
        sku: data.sku || "",
        category: data.category || "",
        collection: data.collection || "",
        price: data.price || 0,
        discountPrice: data.discountPrice || undefined,
        stock: data.stock || 0,
        status: data.status || "Draft",
        featured: data.featured || false,
        newArrival: data.newArrival || false,
        thumbnail: data.thumbnail || "",
        gallery: data.gallery || [],
        views: data.views || 0,
        orders: data.orders || 0,
        createdAt: toISOString(data.createdAt),
        updatedAt: data.updatedAt ? toISOString(data.updatedAt) : undefined,
        sizes: data.sizes || [],
        colors: data.colors || [],
        tags: data.tags || [],
        description: data.description || "",
      } as NewArrival;
    });

    if (statusFilter && statusFilter !== "All") {
      arrivals = arrivals.filter((a) => a.status === statusFilter);
    }

    arrivals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return arrivals;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

// Create new arrival
export const createNewArrival = async (
  arrivalData: Omit<NewArrival, "id" | "createdAt" | "updatedAt" | "views" | "orders">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "newArrivals"), {
      ...arrivalData,
      views: 0,
      orders: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating new arrival:", error);
    throw error;
  }
};

// Update new arrival
export const updateNewArrival = async (
  id: string,
  arrivalData: Partial<Omit<NewArrival, "id" | "createdAt">>
): Promise<void> => {
  try {
    const docRef = doc(db, "newArrivals", id);
    await updateDoc(docRef, {
      ...arrivalData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating new arrival:", error);
    throw error;
  }
};

// Delete new arrival
export const deleteNewArrival = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "newArrivals", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting new arrival:", error);
    throw error;
  }
};
