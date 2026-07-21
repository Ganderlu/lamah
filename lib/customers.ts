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
import type { Customer } from "@/types/customer";

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

// Fetch all customers
export const fetchCustomers = async (
  statusFilter?: "All" | "Active" | "Inactive" | "Blocked",
  membershipFilter?: "All" | "Gold Member" | "Silver Member" | "Bronze Member" | "Regular Customer"
): Promise<Customer[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    
    let customers = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const firstName = data.firstName || "";
      const lastName = data.lastName || "";
      return {
        id: doc.id,
        uid: data.uid || doc.id,
        firstName: firstName,
        lastName: lastName,
        username: data.username || `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        email: data.email || "",
        phone: data.phone || "",
        avatar: data.avatar || "",
        gender: data.gender || "",
        membership: data.membership || "Regular Customer",
        status: data.status || "Active",
        rewardPoints: data.rewardPoints || 0,
        wishlistCount: data.wishlistCount || 0,
        ordersCount: data.ordersCount || 0,
        totalSpent: data.totalSpent || 0,
        defaultAddress: data.defaultAddress || "",
        createdAt: toISOString(data.createdAt),
        updatedAt: data.updatedAt ? toISOString(data.updatedAt) : undefined,
      } as Customer;
    });

    // Filter by status if needed
    if (statusFilter && statusFilter !== "All") {
      customers = customers.filter(c => c.status === statusFilter);
    }
    
    // Filter by membership if needed
    if (membershipFilter && membershipFilter !== "All") {
      customers = customers.filter(c => c.membership === membershipFilter);
    }

    // Sort by createdAt descending
    customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return customers;
  } catch (error) {
    console.error("Error fetching customers: ", error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (
  id: string,
  customerData: Partial<Omit<Customer, "id" | "createdAt" | "uid">>
): Promise<void> => {
  try {
    const customerRef = doc(db, "users", id);
    await updateDoc(customerRef, {
      ...customerData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating customer: ", error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const customerRef = doc(db, "users", id);
    await deleteDoc(customerRef);
  } catch (error) {
    console.error("Error deleting customer: ", error);
    throw error;
  }
};
