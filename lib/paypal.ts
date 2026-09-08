import type { OrderItem } from "@/types/order";

const PAYPAL_BASE_URLS: Record<string, string> = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

export function getPaypalEnvironment(): string {
  return process.env.PAYPAL_ENVIRONMENT || "sandbox";
}

export function getPaypalBaseUrl(): string {
  const env = getPaypalEnvironment();
  return PAYPAL_BASE_URLS[env] || PAYPAL_BASE_URLS.sandbox;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export async function getPaypalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal client ID or secret is not configured.");
  }

  const now = Date.now();
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60_000) {
    return cachedAccessToken.token;
  }

  const baseUrl = getPaypalBaseUrl();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[paypal] Failed to get access token:", response.status, errText);
    throw new Error("Failed to authenticate with PayPal.");
  }

  const data = await response.json();
  const accessToken: string = data.access_token;
  const expiresIn: number = Number(data.expires_in) || 32400;

  cachedAccessToken = {
    token: accessToken,
    expiresAt: now + expiresIn * 1000,
  };

  return accessToken;
}

export interface CreatePaypalOrderInput {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  currency?: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  itemIds: string;
  itemQtys: string;
  itemPrices: string;
  itemSizes: string;
  itemNames: string;
  itemCount: string;
}

export async function createPaypalOrder(input: CreatePaypalOrderInput): Promise<{
  id: string;
  status: string;
}> {
  const accessToken = await getPaypalAccessToken();
  const baseUrl = getPaypalBaseUrl();
  const currency = input.currency || "USD";

  const unitAmount = Number((input.total).toFixed(2));

  const payload: Record<string, unknown> = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: input.orderNumber,
        description: `Lamah Order ${input.orderNumber}`,
        custom_id: JSON.stringify({
          orderNumber: input.orderNumber,
          customerId: input.customerId,
          customerEmail: input.customerEmail,
          customerName: input.customerName,
          customerPhone: input.customerPhone || "",
          itemIds: input.itemIds,
          itemQtys: input.itemQtys,
          itemPrices: input.itemPrices,
          itemSizes: input.itemSizes,
          itemNames: input.itemNames,
          itemCount: input.itemCount,
          total: String(input.total),
          currency,
        }),
        amount: {
          currency_code: currency,
          value: String(unitAmount),
        },
      },
    ],
    application_context: {
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders?checkout_success=true&order=${encodeURIComponent(input.orderNumber)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?checkout_canceled=true`,
      brand_name: "LAMAH",
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      shipping_preference: "GET_FROM_FILE",
    },
  };

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `lamah-${input.orderNumber}-${Date.now()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[paypal] Failed to create order:", response.status, errText);
    throw new Error("Failed to create PayPal order. Please try again.");
  }

  return await response.json();
}

export async function capturePaypalOrder(orderId: string): Promise<Record<string, unknown>> {
  const accessToken = await getPaypalAccessToken();
  const baseUrl = getPaypalBaseUrl();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `capture-${orderId}-${Date.now()}`,
      Prefer: "return=representation",
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[paypal] Failed to capture order:", response.status, errText);
    throw new Error("Failed to capture PayPal payment. Please try again.");
  }

  return await response.json();
}

export async function getPaypalOrderDetails(orderId: string): Promise<Record<string, unknown>> {
  const accessToken = await getPaypalAccessToken();
  const baseUrl = getPaypalBaseUrl();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[paypal] Failed to get order details:", response.status, errText);
    throw new Error("Failed to retrieve PayPal order details.");
  }

  return await response.json();
}

export function buildOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LAMAH-${rand}`;
}

export function truncateForMeta(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 3) + "..." : s;
}
