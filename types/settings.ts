
export interface PaymentGateways {
  stripe: boolean;
  flutterwave: boolean;
  paystack: boolean;
  paypal: boolean;
  cashOnDelivery: boolean;
}

export interface ShippingSettings {
  defaultShippingFee: number;
  freeShippingThreshold: number;
  estimatedDelivery: string;
  shippingRegions: string[];
  courierServices: {
    dhl: boolean;
    fedex: boolean;
    ups: boolean;
    gigLogistics: boolean;
  };
  enablePickup: boolean;
  enableDelivery: boolean;
}

export interface TaxSettings {
  enableTax: boolean;
  taxPercentage: number;
  vat: number;
  countryTaxRules: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  customerRegistrationAlerts: boolean;
  newsletterNotifications: boolean;
  adminLoginAlerts: boolean;
}

export interface SecuritySettings {
  adminPasswordChange: string;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  deviceManagement: boolean;
  loginHistory: boolean;
  backupAuthCodes: boolean;
  securityLogs: boolean;
}

export interface ApiKeys {
  firebaseConfig: string;
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  stripe: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  flutterwave: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paystack: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  googleMapsApi: string;
  smtpSettings: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  webhookUrl: string;
}

export interface Settings {
  id?: string;
  storeName: string;
  storeEmail: string;
  supportEmail: string;
  phone: string;
  currency: string;
  timezone: string;
  language: string;
  description: string;
  logo: string;
  favicon: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  businessNumber: string;
  vatNumber: string;
  websiteUrl: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  paymentSettings: PaymentGateways;
  shippingSettings: ShippingSettings;
  taxSettings: TaxSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  apiKeys: ApiKeys;
  updatedAt?: string;
  createdAt?: string;
}

