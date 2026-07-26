import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  limit,
  query,
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

const SOCIAL_URL_KEYS = [
  "instagram",
  "youtube",
  "twitter",
  "twitch",
  "facebook",
  "tiktok",
] as const;

type SocialUrlKey = (typeof SOCIAL_URL_KEYS)[number];

/**
 * Seed social links with the values actually used in the store Footer.
 * This only runs when loading an existing `settings` doc from Firestore and
 * some of the social fields are empty / missing — we prefer the Footer's
 * live URLs over empty strings so admins always see the current links when
 * they first open Store Information.
 */
function withFooterSocialSeeds(loaded: Partial<Settings>): Partial<Settings> {
  const next: Partial<Settings> = { ...loaded };

  for (const key of SOCIAL_URL_KEYS) {
    const current = (next as Record<SocialUrlKey, unknown>)[key];
    const defaulted = (defaultSettings as Record<SocialUrlKey, unknown>)[key];
    if (!current && defaulted) {
      (next as Record<SocialUrlKey, unknown>)[key] = defaulted;
    }
  }

  return next;
}

/**
 * Strip fields we never want to write to Firestore (ids and timestamps are
 * managed by the server helpers below) and trim/sanitize user-editable
 * string fields so whitespace-only inputs get treated as "no value" instead
 * of being persisted as padded strings.
 */
function sanitizeForWrite(
  data: Partial<Omit<Settings, "id" | "createdAt" | "updatedAt">>
): Partial<Omit<Settings, "id" | "createdAt" | "updatedAt">> {
  const cloned = { ...data } as Record<string, unknown>;
  delete cloned.id;
  delete cloned.createdAt;
  delete cloned.updatedAt;

  const trimmedStringKeys: Array<keyof Settings> = [
    "storeName",
    "storeEmail",
    "supportEmail",
    "phone",
    "currency",
    "timezone",
    "language",
    "description",
    "logo",
    "favicon",
    "address",
    "country",
    "state",
    "city",
    "postalCode",
    "businessNumber",
    "vatNumber",
    "websiteUrl",
    ...SOCIAL_URL_KEYS,
  ];

  for (const key of trimmedStringKeys) {
    const value = cloned[key as string];
    if (typeof value === "string") {
      const trimmed = value.trim();
      // Keep empty strings for socials (admin intentionally clearing them),
      // but still remove leading/trailing whitespace for consistency.
      cloned[key as string] = trimmed;
    }
  }

  return cloned as Partial<Omit<Settings, "id" | "createdAt" | "updatedAt">>;
}

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
  facebook: "",
  instagram: "https://www.instagram.com/notlamarama/",
  tiktok: "",
  youtube: "https://m.youtube.com/channel/UC0hT2jgzSioOqkkCcQRN8Rg?ra=m",
  twitter: "https://x.com/notlamarama",
  twitch:
    "https://www.twitch.tv/r/e/eyJsb2NhdGlvbiI6ImNoYW5uZWxfbmFtZSIsImVtYWlsX2lkIjoiODU4MzIwNDctYmJmOC00MTU5LWJhODctMzVmMTIxZjQ4MWUzIiwibmFtZSI6ImxvZ2luX2NoYW5nZSIsInNvdXJjZV9lbWFpbCI6IiIsImN0YV92YWx1ZSI6IiIsImNoYW5uZWwiOiIiLCJsb2dpbiI6IiJ9/1177990052/30f5746a5e55a7d532394c0440a72b5c667cc09e7a9024c0b23b2ce0300f8d57/notlamarama?ignore_query=true&tt_content=login_change&tt_email_id=85832047-bbf8-4159-ba87-35f121f481e3&tt_medium=email",
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
    const q = query(collection(db, "settings"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return defaultSettings;
    }

    const fetched = querySnapshot.docs[0];
    const data = fetched.data();
    const seeded = withFooterSocialSeeds(data);

    return {
      id: fetched.id,
      ...defaultSettings,
      ...seeded,
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
): Promise<{ id: string }> => {
  try {
    const sanitized = sanitizeForWrite(settingsData);

    if (id) {
      const settingsRef = doc(db, "settings", id);
      await updateDoc(settingsRef, {
        ...sanitized,
        updatedAt: serverTimestamp(),
      });
      return { id };
    }

    // If no document exists, create one with a stable id so subsequent saves
    // continue updating the same document instead of creating duplicates.
    const stableId = "store";
    const settingsRef = doc(db, "settings", stableId);
    await setDoc(settingsRef, {
      ...defaultSettings,
      ...sanitized,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: stableId };
  } catch (error) {
    console.error("Error updating settings: ", error);
    throw error;
  }
};
