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
import type { Collection } from "@/types/collection";
import { fetchProducts } from "./products";
import { fetchNewArrivals } from "./newArrivals";

// Helper to safely convert to ISO string
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") {
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

// Function to generate slug from name
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Fetch all collections
export const fetchCollections = async (
  statusFilter?: "All" | "Active" | "Inactive" | "Draft"
): Promise<Collection[]> => {
  try {
    const [collectionsSnapshot, products, newArrivals] = await Promise.all([
      getDocs(collection(db, "collections")),
      fetchProducts(),
      fetchNewArrivals(),
    ]);
    
    // Count products per collection
    const productCountMap: Record<string, number> = {};
    products.forEach((product) => {
      const collectionName = product.collection || "";
      if (collectionName) {
        productCountMap[collectionName] = (productCountMap[collectionName] || 0) + 1;
      }
    });
    // Count new arrivals per collection
    newArrivals.forEach((arrival) => {
      const collectionName = arrival.collection || "";
      if (collectionName) {
        productCountMap[collectionName] = (productCountMap[collectionName] || 0) + 1;
      }
    });
    
    let collections = collectionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const name = data.name || "";
      const productCount = productCountMap[name] || 0;
      return {
        id: doc.id,
        name: name,
        slug: data.slug || generateSlug(name),
        description: data.description || "",
        coverImage: data.coverImage || "",
        bannerImage: data.bannerImage || "",
        featured: data.featured || false,
        status: data.status || "Draft",
        productCount: productCount,
        productIds: data.productIds || [],
        createdAt: toISOString(data.createdAt),
        updatedAt: data.updatedAt ? toISOString(data.updatedAt) : undefined,
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
      } as Collection;
    });

    // Filter by status if needed
    if (statusFilter && statusFilter !== "All") {
      collections = collections.filter(col => col.status === statusFilter);
    }

    // Sort by createdAt descending
    collections.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return collections;
  } catch (error) {
    console.error("Error fetching collections: ", error);
    throw error;
  }
};

// Create a new collection
export const createCollection = async (
  collectionData: Omit<Collection, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "collections"), {
      ...collectionData,
      productCount: 0, // Default to 0
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating collection: ", error);
    throw error;
  }
};

// Update a collection
export const updateCollection = async (
  id: string,
  collectionData: Partial<Omit<Collection, "id" | "createdAt">>
): Promise<void> => {
  try {
    const collectionRef = doc(db, "collections", id);
    const { productCount, ...rest } = collectionData; // Don't let users update productCount manually
    await updateDoc(collectionRef, {
      ...rest,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating collection: ", error);
    throw error;
  }
};

// Delete a collection
export const deleteCollection = async (id: string): Promise<void> => {
  try {
    const collectionRef = doc(db, "collections", id);
    await deleteDoc(collectionRef);
  } catch (error) {
    console.error("Error deleting collection: ", error);
    throw error;
  }
};
