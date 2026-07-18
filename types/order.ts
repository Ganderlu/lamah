export type OrderStatus =
  | "All Orders"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: string;
  shippingStatus: string;
  createdAt: string;
  updatedAt: string;
}
