
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Category } from "@/types/category";

// Fetch all categories
export const fetchCategories = async (
  statusFilter?: "All" | "Active" | "Inactive" | "Draft"
): Promise<Category[]> => {
  try {
    // First, try to fetch all and filter/sort in memory to avoid index requirement
    const querySnapshot = await getDocs(collection(db, "categories"));
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
        // Already an ISO string or similar
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

    let categories = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const name = data.name || "";
      return {
        id: doc.id,
        name: name,
        slug: data.slug || generateSlug(name),
        description: data.description || "",
        productCount: data.productCount || 0,
        status: data.status || "Draft",
        createdAt: toISOString(data.createdAt),
        updatedAt: data.updatedAt ? toISOString(data.updatedAt) : undefined,
        image: data.image || "",
        bannerImage: data.bannerImage || "",
        featured: data.featured || false,
        sortOrder: data.sortOrder || 0,
        parentId: data.parentId || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
      } as Category;
    });

    // Filter by status if needed
    if (statusFilter && statusFilter !== "All") {
      categories = categories.filter(cat => cat.status === statusFilter);
    }

    // Sort by createdAt descending
    categories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return categories;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating category: ", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (
  id: string,
  categoryData: Partial<Omit<Category, "id" | "createdAt">>
): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating category: ", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category: ", error);
    throw error;
  }
};
