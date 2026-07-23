import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { CustomerOrder, OrderStatus, PaymentStatus, PaymentMethod } from "@/types/order";

// Helper to safely convert timestamps
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

// Fetch all orders (for admin dashboard)
export const fetchAllOrders = async (): Promise<CustomerOrder[]> => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        orderNumber: data.orderNumber || `#LMH-${Date.now()}`,
        customerId: data.customerId || "",
        customerName: data.customerName || "Customer",
        customerEmail: data.customerEmail || "",
        customerPhone: data.customerPhone || "",
        customerAvatar: data.customerAvatar || "",
        products: data.products || [],
        subtotal: data.subtotal || 0,
        shippingFee: data.shippingFee || 0,
        discount: data.discount || 0,
        tax: data.tax || 0,
        total: data.total || 0,
        paymentMethod: (data.paymentMethod as PaymentMethod) || "card",
        paymentStatus: (data.paymentStatus as PaymentStatus) || "Pending",
        transactionId: data.transactionId || "",
        deliveryStatus: (data.deliveryStatus as OrderStatus) || "Pending",
        trackingNumber: data.trackingNumber || "",
        courier: data.courier || "",
        estimatedDelivery: data.estimatedDelivery ? toISOString(data.estimatedDelivery) : "",
        shippingAddress: data.shippingAddress || {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        billingAddress: data.billingAddress || {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        status: (data.status as OrderStatus) || "Pending",
        adminNotes: data.adminNotes || [],
        timeline: data.timeline || [],
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
      };
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

// Fetch order by order number (for customer tracking)
export const fetchOrderByOrderId = async (orderNumber: string, userId?: string): Promise<CustomerOrder | null> => {
  try {
    const q = query(collection(db, "orders"), where("orderNumber", "==", orderNumber));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    // If userId is provided, verify it's the customer's order
    if (userId && data.customerId !== userId) {
      return null;
    }
    
    return {
      id: doc.id,
      orderNumber: data.orderNumber || `#LMH-${Date.now()}`,
      customerId: data.customerId || "",
      customerName: data.customerName || "Customer",
      customerEmail: data.customerEmail || "",
      customerPhone: data.customerPhone || "",
      customerAvatar: data.customerAvatar || "",
      products: data.products || [],
      subtotal: data.subtotal || 0,
      shippingFee: data.shippingFee || 0,
      discount: data.discount || 0,
      tax: data.tax || 0,
      total: data.total || 0,
      paymentMethod: (data.paymentMethod as PaymentMethod) || "card",
      paymentStatus: (data.paymentStatus as PaymentStatus) || "Pending",
      transactionId: data.transactionId || "",
      deliveryStatus: (data.deliveryStatus as OrderStatus) || "Pending",
      trackingNumber: data.trackingNumber || "",
      courier: data.courier || "",
      estimatedDelivery: data.estimatedDelivery ? toISOString(data.estimatedDelivery) : "",
      shippingAddress: data.shippingAddress || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      billingAddress: data.billingAddress || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      status: (data.status as OrderStatus) || "Pending",
      adminNotes: data.adminNotes || [],
      timeline: data.timeline || [],
      createdAt: toISOString(data.createdAt),
      updatedAt: toISOString(data.updatedAt),
    };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};
