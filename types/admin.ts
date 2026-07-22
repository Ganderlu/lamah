export interface Admin {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "super_admin" | "admin" | "staff";
  createdAt: string;
}
