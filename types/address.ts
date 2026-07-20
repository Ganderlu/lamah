export interface Address {
  id?: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  street: string;
  apartment?: string;
  postalCode: string;
  addressType: "Home" | "Office" | "Other";
  isDefault: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
