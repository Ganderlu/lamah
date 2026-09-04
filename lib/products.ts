import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Product } from "@/types/product";

const normalizeCategory = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

// Fetch products by category
export const fetchProductsByCategory = async (
  categoryName: string
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", categoryName)
    );
    const querySnapshot = await getDocs(q);
    const exactMatches = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        sku: data.sku || "",
        description: data.description || "",
        category: data.category || "",
        collection: data.collection || "",
        brand: data.brand || "",
        price: data.price || 0,
        discountPrice: data.discountPrice,
        stock: data.stock || 0,
        weight: data.weight,
        sizes: data.sizes || [],
        colors: data.colors || [],
        tags: data.tags || [],
        thumbnail: data.thumbnail,
        gallery: data.gallery || [],
        featured: data.featured || false,
        status: data.status || "Draft",
        createdAt: (data.createdAt?.toDate?.() || new Date()).toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
      } as Product;
    });

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    const targetNormalized = normalizeCategory(categoryName);
    const allSnapshot = await getDocs(collection(db, "products"));
    return allSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return normalizeCategory(data.category || "") === targetNormalized;
      })
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          sku: data.sku || "",
          description: data.description || "",
          category: data.category || "",
          collection: data.collection || "",
          brand: data.brand || "",
          price: data.price || 0,
          discountPrice: data.discountPrice,
          stock: data.stock || 0,
          weight: data.weight,
          sizes: data.sizes || [],
          colors: data.colors || [],
          tags: data.tags || [],
          thumbnail: data.thumbnail,
          gallery: data.gallery || [],
          featured: data.featured || false,
          status: data.status || "Draft",
          createdAt: (data.createdAt?.toDate?.() || new Date()).toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        } as Product;
      });
  } catch (error) {
    console.error("Error fetching products by category: ", error);
    throw error;
  }
};

// Fetch all products
export const fetchProducts = async (
  statusFilter: "All" | "Active" | "Inactive" | "Draft" = "All"
): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    let products = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        sku: data.sku || "",
        description: data.description || "",
        category: data.category || "",
        collection: data.collection || "",
        brand: data.brand || "",
        price: data.price || 0,
        discountPrice: data.discountPrice,
        stock: data.stock || 0,
        weight: data.weight,
        sizes: data.sizes || [],
        colors: data.colors || [],
        tags: data.tags || [],
        thumbnail: data.thumbnail,
        gallery: data.gallery || [],
        featured: data.featured || false,
        status: data.status || "Draft",
        createdAt: (data.createdAt?.toDate?.() || new Date()).toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
      } as Product;
    });

    // Filter by status if needed
    if (statusFilter && statusFilter !== "All") {
      products = products.filter((p) => p.status === statusFilter);
    }

    // Sort by createdAt descending
    products.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) return null;

    const data = productSnap.data();
    return {
      id: productSnap.id,
      name: data.name || "",
      sku: data.sku || "",
      description: data.description || "",
      category: data.category || "",
      collection: data.collection || "",
      brand: data.brand || "",
      price: data.price || 0,
      discountPrice: data.discountPrice,
      stock: data.stock || 0,
      weight: data.weight,
      sizes: data.sizes || [],
      colors: data.colors || [],
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      gallery: data.gallery || [],
      featured: data.featured || false,
      status: data.status || "Draft",
      createdAt: (data.createdAt?.toDate?.() || new Date()).toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
    } as Product;
  } catch (error) {
    console.error("Error fetching product by id: ", error);
    return null;
  }
};

// Helper to remove undefined fields
const removeUndefinedFields = (obj: any) => {
  const newObj: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

// Create a new product
export const createProduct = async (
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const cleanData = removeUndefinedFields(productData);
    const docRef = await addDoc(collection(db, "products"), {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product: ", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, "id" | "createdAt">>
): Promise<void> => {
  try {
    const cleanData = removeUndefinedFields(productData);
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};
