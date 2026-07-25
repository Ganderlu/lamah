import Stripe from "stripe";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { OrderItem } from "@/types/order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function verifyBearerToken(request: Request): Promise<{
  uid: string;
  email: string;
  name: string;
}> {
  // Lazy import — Firebase Admin is only initialized inside the handler.
  // This keeps Next.js static/page-data collection from parsing the private
  // key at build time (which can fail if the key is malformed / missing).
  const { getAdminAuth, getAdminFirestore } = await import("@/firebase/admin");
  const firebaseAuth = getAdminAuth();
  const adminDb = getAdminFirestore();

  const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const decoded = await firebaseAuth.verifyIdToken(token, true);
    const uid = decoded.uid;
    if (!uid) throw new Error("UNAUTHORIZED");

    // Prefer the users/uid Firestore record for the most accurate contact
    // details; fall back to the decoded token claims.
    let email: string = decoded.email ?? "";
    let displayName: string = decoded.name ?? "";

    try {
      const snap = await adminDb.collection("users").doc(uid).get();
      if (snap.exists) {
        const data = (snap.data() ?? {}) as Record<string, unknown>;
        if (data.email && typeof data.email === "string") email = data.email;
        const first = String(data.firstName ?? "");
        const last = String(data.lastName ?? "");
        if (first || last) displayName = [first, last].filter(Boolean).join(" ").trim();
        else if (data.username && typeof data.username === "string") displayName = data.username;
        if (!email && data.email) email = String(data.email);
      }
    } catch {
      /* fall through to decoded-token values */
    }

    if (!email) email = `${uid}@customer.lamah`;
    if (!displayName) displayName = email.split("@")[0] ?? "LAMAH Customer";

    return { uid, email, name: displayName };
  } catch (err) {
    console.error("[checkout] token verification failed", err);
    throw new Error("UNAUTHORIZED");
  }
}

function toAbsoluteImageUrl(baseUrl: string, maybeRelative: string): string | undefined {
  if (!maybeRelative) return undefined;
  if (maybeRelative.startsWith("http://") || maybeRelative.startsWith("https://") || maybeRelative.startsWith("data:")) {
    return maybeRelative;
  }
  const sep = maybeRelative.startsWith("/") ? "" : "/";
  return `${baseUrl}${sep}${maybeRelative}`;
}

function buildOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LAMAH-${rand}`;
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!stripeSecretKey) {
      console.error("[checkout] STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Stripe configuration missing." },
        { status: 500 }
      );
    }
    if (!baseUrl) {
      console.error("[checkout] NEXT_PUBLIC_BASE_URL is not set");
      return NextResponse.json(
        { error: "Base URL configuration missing." },
        { status: 500 }
      );
    }

    // -----------------------------------------------------------
    // 1. Verify Firebase ID token — ONLY logged-in users may pay.
    // -----------------------------------------------------------
    let customer: { uid: string; email: string; name: string };
    try {
      customer = await verifyBearerToken(request);
    } catch {
      return NextResponse.json(
        { error: "Please sign in before completing your purchase." },
        { status: 401 }
      );
    }

    // -----------------------------------------------------------
    // 2. Parse body + validate cart.
    // -----------------------------------------------------------
    const rawBody = await request.json();
    const cartItems: Array<{
      id: string;
      productId?: string;
      name: string;
      price: number;
      image: string;
      quantity: number;
      size?: string;
      color?: string;
    }> = Array.isArray(rawBody?.cartItems) ? rawBody.cartItems : [];

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const customerNameFromBody: string = typeof rawBody?.customerName === "string" && rawBody.customerName.trim()
      ? rawBody.customerName.trim()
      : customer.name;
    const customerEmailFromBody: string = typeof rawBody?.customerEmail === "string" && rawBody.customerEmail.trim()
      ? rawBody.customerEmail.trim()
      : customer.email;
    const customerPhoneFromBody: string = typeof rawBody?.customerPhone === "string" ? rawBody.customerPhone : "";

    const orderNumber = buildOrderNumber();
    const idempotencyKey = `checkout-${customer.uid}-${orderNumber}-${randomUUID()}`;

    // -----------------------------------------------------------
    // 3. Normalize + prepare line_items + compact order metadata.
    // -----------------------------------------------------------
    const normalizedItems: OrderItem[] = cartItems.map((item) => {
      const price = Number(item.price);
      const qty = Number(item.quantity) || 1;
      const safePrice = Number.isFinite(price) && price > 0 ? price : 0;
      return {
        id: String(item.id || randomUUID()),
        productId: String(item.productId || item.id || ""),
        name: String(item.name || "LAMAH Product"),
        image: String(item.image || ""),
        size: item.size && typeof item.size === "string" ? item.size : undefined,
        color: item.color && typeof item.color === "string" ? item.color : undefined,
        quantity: Math.max(1, Number.isFinite(qty) ? qty : 1),
        price: Number(safePrice.toFixed(2)),
      };
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      normalizedItems.map((item) => {
        const image = toAbsoluteImageUrl(baseUrl, item.image);
        const unitAmount = Math.max(0, Math.round(item.price * 100));
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              ...(image ? { images: [image] } : {}),
              ...(item.size || item.color
                ? {
                    description: [
                      item.size ? `Size: ${item.size}` : "",
                      item.color ? `Color: ${item.color}` : "",
                    ]
                      .filter(Boolean)
                      .join(" • "),
                  }
                : {}),
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      });

    // -----------------------------------------------------------
    // 4. Initialize Stripe + create the Checkout Session.
    // -----------------------------------------------------------
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-06-24.dahlia",
      maxNetworkRetries: 2,
      timeout: 20_000,
    });

    const metadata: Stripe.MetadataParam = {
      orderNumber,
      customerId: customer.uid,
      customerEmail: customerEmailFromBody,
      customerName: customerNameFromBody,
      customerPhone: customerPhoneFromBody,
      source: "lamah-web-checkout",
      items: JSON.stringify(normalizedItems),
    };

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: customerEmailFromBody,
        submit_type: "pay",
        line_items: lineItems,
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: [
            "US",
            "CA",
            "GB",
            "AU",
            "DE",
            "FR",
            "IT",
            "ES",
            "NL",
            "BE",
            "SE",
            "NO",
            "DK",
            "FI",
            "IE",
            "NZ",
            "AE",
            "SA",
            "SG",
            "HK",
            "JP",
            "KR",
            "IN",
            "ZA",
          ],
        },
        phone_number_collection: { enabled: true },
        metadata,
        success_url: `${baseUrl}/dashboard/orders?checkout_success=true&order=${encodeURIComponent(orderNumber)}`,
        cancel_url: `${baseUrl}/cart?checkout_canceled=true`,
        automatic_tax: { enabled: false },
      },
      { idempotencyKey }
    );

    if (!session.url) {
      console.error("[checkout] Stripe returned no session URL", {
        sessionId: session.id,
      });
      return NextResponse.json(
        { error: "Failed to start checkout session. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderNumber,
    });
  } catch (error: unknown) {
    console.error("[checkout] Error creating checkout session:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const status = message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "Please sign in before completing your purchase." : message },
      { status }
    );
  }
}
