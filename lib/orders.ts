import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { CustomerOrder, OrderStatus } from "@/types/order";

// Helper to safely convert timestamps
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

// Fetch a single order by orderId
export const fetchOrderByOrderId = async (
  orderId: string,
  userId?: string
): Promise<CustomerOrder | null> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("orderId", "==", orderId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    // If userId is provided, ensure the order belongs to that user
    if (userId && data.userId !== userId) return null;
    
    return {
      id: doc.id,
      orderId: data.orderId || "",
      userId: data.userId || "",
      items: data.items || [],
      total: data.total || 0,
      status: data.status || "Processing",
      paymentStatus: data.paymentStatus || "Pending",
      shippingStatus: data.shippingStatus || "Processing",
      createdAt: toISOString(data.createdAt),
      updatedAt: toISOString(data.updatedAt),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Fetch all orders for a user
export const fetchUserOrders = async (userId: string): Promise<CustomerOrder[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        orderId: data.orderId || "",
        userId: data.userId || "",
        items: data.items || [],
        total: data.total || 0,
        status: data.status || "Processing",
        paymentStatus: data.paymentStatus || "Pending",
        shippingStatus: data.shippingStatus || "Processing",
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
      };
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};
