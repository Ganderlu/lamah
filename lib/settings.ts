
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Settings } from "@/types/settings";

// Helper to safely convert to ISO string
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return new Date().toISOString();
};

export const defaultSettings: Settings = {
  storeName: "Lamah Clothing Co.",
  storeEmail: "store@lamahclothing.com",
  supportEmail: "support@lamahclothing.com",
  phone: "+234 800 123 4567",
  currency: "NGN",
  timezone: "Africa/Lagos",
  language: "en",
  description: "Premium streetwear brand",
  logo: "",
  favicon: "",
  address: "123 Fashion Street",
  country: "Nigeria",
  state: "Lagos",
  city: "Lekki",
  postalCode: "101245",
  businessNumber: "RC12345678",
  vatNumber: "VAT12345678",
  websiteUrl: "https://lamahclothing.com",
  facebook: "https://facebook.com/lamahclothing",
  instagram: "https://instagram.com/lamahclothing",
  tiktok: "https://tiktok.com/@lamahclothing",
  youtube: "https://youtube.com/@lamahclothing",
  twitter: "https://twitter.com/lamahclothing",
  paymentSettings: {
    stripe: true,
    flutterwave: true,
    paystack: true,
    paypal: true,
    cashOnDelivery: true,
  },
  shippingSettings: {
    defaultShippingFee: 2000,
    freeShippingThreshold: 50000,
    estimatedDelivery: "3-5 business days",
    shippingRegions: ["Lagos", "Abuja", "Port Harcourt"],
    courierServices: {
      dhl: true,
      fedex: true,
      ups: true,
      gigLogistics: true,
    },
    enablePickup: true,
    enableDelivery: true,
  },
  taxSettings: {
    enableTax: true,
    taxPercentage: 7.5,
    vat: 7.5,
    countryTaxRules: "Nigerian VAT rules apply",
  },
  notificationSettings: {
    emailNotifications: true,
    smsNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerRegistrationAlerts: true,
    newsletterNotifications: true,
    adminLoginAlerts: true,
  },
  securitySettings: {
    adminPasswordChange: "",
    twoFactorAuth: false,
    sessionTimeout: 30,
    deviceManagement: true,
    loginHistory: true,
    backupAuthCodes: true,
    securityLogs: true,
  },
  apiKeys: {
    firebaseConfig: "",
    cloudinary: {
      cloudName: "",
      apiKey: "",
      apiSecret: "",
    },
    stripe: {
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
    },
    flutterwave: {
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
    },
    paystack: {
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
    },
    googleMapsApi: "",
    smtpSettings: {
      host: "",
      port: 587,
      user: "",
      pass: "",
      from: "",
    },
    webhookUrl: "",
  },
};

// Fetch settings
export const fetchSettings = async (): Promise<Settings> => {
  try {
    const querySnapshot = await getDocs(collection(db, "settings"));
    
    if (querySnapshot.empty) {
      return defaultSettings;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      ...defaultSettings,
      ...data,
      updatedAt: data.updatedAt ? toISOString(data.updatedAt) : undefined,
      createdAt: data.createdAt ? toISOString(data.createdAt) : undefined,
    } as Settings;
  } catch (error) {
    console.error("Error fetching settings: ", error);
    return defaultSettings;
  }
};

// Update settings
export const updateSettings = async (
  id: string | undefined,
  settingsData: Partial<Omit<Settings, "id" | "createdAt" | "updatedAt">>
): Promise<void> => {
  try {
    if (id) {
      const settingsRef = doc(db, "settings", id);
      await updateDoc(settingsRef, {
        ...settingsData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // If no document exists, create one
      await setDoc(doc(collection(db, "settings")), {
        ...defaultSettings,
        ...settingsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating settings: ", error);
    throw error;
  }
};
