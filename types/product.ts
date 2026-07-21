export interface Product {
  id?: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  collection: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  weight?: number;
  sizes: string[];
  colors: string[];
  tags: string[];
  thumbnail?: string;
  gallery: string[];
  featured: boolean;
  status: "Active" | "Inactive" | "Draft";
  createdAt: string;
  updatedAt?: string;
}
