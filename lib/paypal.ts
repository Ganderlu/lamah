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

let cachedAccessToken: {
  clientId: string;
  token: string;
  expiresAt: number;
} | null = null;

function parsePaypalError(errText: string, fallback: string): { name: string; message: string; debugId: string; details: string } {
  try {
    const parsed = JSON.parse(errText);
    const name = typeof parsed.name === "string" ? parsed.name : "";
    const message = typeof parsed.message === "string" ? parsed.message : fallback;
    const debugId = typeof parsed.debug_id === "string" ? parsed.debug_id : "";
    const detailsArr = Array.isArray(parsed.details) ? parsed.details : [];
    const details = detailsArr
      .map((d: any) => {
        const parts: string[] = [];
        if (d?.field) parts.push(`field=${d.field}`);
        if (d?.issue) parts.push(`issue=${d.issue}`);
        if (d?.description) parts.push(d.description);
        return parts.join(" ");
      })
      .filter(Boolean)
      .join(" | ");
    return { name, message, debugId, details };
  } catch {
    return { name: "", message: fallback, debugId: "", details: "" };
  }
}

export async function getPaypalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal client ID or secret is not configured.");
  }

  const now = Date.now();
  if (
    cachedAccessToken &&
    cachedAccessToken.clientId === clientId &&
    cachedAccessToken.expiresAt > now + 60_000
  ) {
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
    const parsed = parsePaypalError(errText, "Authentication failed");
    const statusLabel = `HTTP ${response.status}`;
    const debugLabel = parsed.debugId ? ` (debug_id: ${parsed.debugId})` : "";
    const detailLabel = parsed.details ? ` — ${parsed.details}` : "";
    const nameLabel = parsed.name ? ` [${parsed.name}]` : "";
    const composed = `PayPal auth failed${nameLabel}${debugLabel}: ${statusLabel} ${parsed.message}${detailLabel}`;
    console.error("[paypal] Failed to get access token:", composed);
    console.error("[paypal] raw error body:", errText);
    throw new Error(composed);
  }

  const data = await response.json();
  const accessToken: string = data.access_token;
  const expiresIn: number = Number(data.expires_in) || 32400;

  cachedAccessToken = {
    clientId,
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
        custom_id: input.orderNumber,
        invoice_id: input.orderNumber,
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
    const parsed = parsePaypalError(errText, "Order creation rejected by PayPal");
    const statusLabel = `HTTP ${response.status}`;
    const debugLabel = parsed.debugId ? ` (debug_id: ${parsed.debugId})` : "";
    const detailLabel = parsed.details ? ` — ${parsed.details}` : "";
    const nameLabel = parsed.name ? ` [${parsed.name}]` : "";
    const composed = `PayPal order creation failed${nameLabel}${debugLabel}: ${statusLabel} ${parsed.message}${detailLabel}`;
    console.error("[paypal] Failed to create order:", composed);
    console.error("[paypal] raw error body:", errText);
    throw new Error(composed);
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
    const parsed = parsePaypalError(errText, "Payment capture rejected by PayPal");
    const statusLabel = `HTTP ${response.status}`;
    const debugLabel = parsed.debugId ? ` (debug_id: ${parsed.debugId})` : "";
    const detailLabel = parsed.details ? ` — ${parsed.details}` : "";
    const nameLabel = parsed.name ? ` [${parsed.name}]` : "";
    const composed = `PayPal capture failed${nameLabel}${debugLabel}: ${statusLabel} ${parsed.message}${detailLabel}`;
    console.error("[paypal] Failed to capture order:", composed);
    console.error("[paypal] raw error body:", errText);
    throw new Error(composed);
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
    const parsed = parsePaypalError(errText, "Could not retrieve order from PayPal");
    const statusLabel = `HTTP ${response.status}`;
    const debugLabel = parsed.debugId ? ` (debug_id: ${parsed.debugId})` : "";
    const detailLabel = parsed.details ? ` — ${parsed.details}` : "";
    const nameLabel = parsed.name ? ` [${parsed.name}]` : "";
    const composed = `PayPal order lookup failed${nameLabel}${debugLabel}: ${statusLabel} ${parsed.message}${detailLabel}`;
    console.error("[paypal] Failed to get order details:", composed);
    console.error("[paypal] raw error body:", errText);
    throw new Error(composed);
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
