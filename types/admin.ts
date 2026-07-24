export type AdminRole =
  | "super_admin"
  | "manager"
  | "director"
  | "inventory_manager"
  | "marketing_manager"
  | "customer_support";

export interface Admin {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: "active" | "inactive" | "suspended";
  profileImage: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
