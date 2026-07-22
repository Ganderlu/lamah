export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Out For Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Failed"
  | "Refunded";

export type PaymentMethod =
  | "Stripe"
  | "Paystack"
  | "Flutterwave"
  | "PayPal"
  | "Visa"
  | "Mastercard"
  | "Bank Transfer"
  | "Cash on Delivery";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface OrderNote {
  id: string;
  text: string;
  adminId: string;
  adminName: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  event: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  products: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  deliveryStatus: OrderStatus;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  adminNotes: OrderNote[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
