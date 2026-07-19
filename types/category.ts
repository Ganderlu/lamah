
export type Category = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
  status: "Active" | "Inactive" | "Draft";
  createdAt: string;
  updatedAt?: string;
  image?: string;
  bannerImage?: string;
  featured: boolean;
  sortOrder?: number;
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
};
