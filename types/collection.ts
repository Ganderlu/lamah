export type Collection = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  bannerImage?: string;
  featured: boolean;
  status: "Active" | "Inactive" | "Draft";
  productCount: number;
  productIds: string[];
  createdAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};
