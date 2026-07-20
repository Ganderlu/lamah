import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Address } from "@/types/address";

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

// Fetch user addresses
export const fetchAddresses = async (userId: string): Promise<Address[]> => {
  try {
    const q = query(
      collection(db, "addresses"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const addresses = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || "",
        fullName: data.fullName || "",
        phone: data.phone || "",
        email: data.email || "",
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",
        street: data.street || "",
        apartment: data.apartment || "",
        postalCode: data.postalCode || "",
        addressType: data.addressType || "Home",
        isDefault: data.isDefault || false,
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
      } as Address;
    });

    // Sort by isDefault (default first), then createdAt descending
    addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return addresses;
  } catch (error) {
    console.error("Error fetching addresses: ", error);
    throw error;
  }
};

// Create a new address
export const createAddress = async (
  addressData: Omit<Address, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const batch = writeBatch(db);

    // If new address is default, unset all other addresses as default
    if (addressData.isDefault) {
      const q = query(
        collection(db, "addresses"),
        where("userId", "==", addressData.userId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isDefault: false, updatedAt: serverTimestamp() });
      });
    }

    const docRef = doc(collection(db, "addresses"));
    batch.set(docRef, {
      ...addressData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    return docRef.id;
  } catch (error) {
    console.error("Error creating address: ", error);
    throw error;
  }
};

// Update an address
export const updateAddress = async (
  id: string,
  userId: string,
  addressData: Partial<Omit<Address, "id" | "createdAt" | "userId">>
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    // If updating to default, unset all other addresses as default
    if (addressData.isDefault) {
      const q = query(
        collection(db, "addresses"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        if (doc.id !== id) {
          batch.update(doc.ref, { isDefault: false, updatedAt: serverTimestamp() });
        }
      });
    }

    const addressRef = doc(db, "addresses", id);
    batch.update(addressRef, {
      ...addressData,
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  } catch (error) {
    console.error("Error updating address: ", error);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (id: string): Promise<void> => {
  try {
    const addressRef = doc(db, "addresses", id);
    await deleteDoc(addressRef);
  } catch (error) {
    console.error("Error deleting address: ", error);
    throw error;
  }
};
