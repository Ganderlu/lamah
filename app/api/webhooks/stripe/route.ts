import Stripe from "stripe";
import { NextResponse } from "next/server";
import type {
  Address,
  CustomerOrder,
  OrderItem,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  TimelineEvent,
} from "@/types/order";

/**
 * Zero-decimal (smallest-unit-only) currencies recognised by Stripe.
 *
 * Money sent by Stripe is ALWAYS in the currency's smallest unit.
 *   - 2-decimal currencies (USD, EUR, GBP, …): divide by 100
 *   - 0-decimal currencies (JPY, KRW, …):       divide by 1
 *   - 3-decimal currencies (BHD, …):            divide by 1000
 *
 * The SDK's `Stripe.CURRENCIES_WITHOUT_DECIMALS` was removed in v22, so we
 * maintain the list here inline along with Stripe's published three-decimal
 * set. Reference: https://docs.stripe.com/currencies
 */
const ZERO_DECIMAL_CURRENCIES = new Set<string>([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf",
  "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);
const THREE_DECIMAL_CURRENCIES = new Set<string>([
  "bhd", "jod", "kwd", "omr", "tnd",
]);

function smallestUnitDivisor(currency: string | null | undefined): number {
  const key = (currency ?? "usd").toLowerCase();
  if (ZERO_DECIMAL_CURRENCIES.has(key)) return 1;
  if (THREE_DECIMAL_CURRENCIES.has(key)) return 1000;
  return 100;
}

/**
 * Stripe Webhook Handler — Next.js 16 App Router (Vercel-ready)
 *
 * Endpoint: POST /api/webhooks/stripe
 *
 * Reference
 * - Stripe SDK:          https://docs.stripe.com/api?lang=node
 * - Webhook signature:   https://docs.stripe.com/webhooks#verify-manually
 * - Checkout events:     https://docs.stripe.com/api/checkout/sessions/object
 *
 * Required environment variables:
 *   STRIPE_SECRET_KEY       — server-side Stripe secret (sk_live_...  / sk_test_...)
 *   STRIPE_WEBHOOK_SECRET   — signing secret for this endpoint (whsec_...)
 *
 * Set them in:
 *   1) .env.local (local dev):
 *        STRIPE_SECRET_KEY=sk_live_xxx
 *        STRIPE_WEBHOOK_SECRET=whsec_xxx
 *   2) Vercel Project → Settings → Environment Variables
 *        (add to Production / Preview / Development as needed)
 *
 * Install the Stripe Node SDK (already pinned in package.json ^22.3.2,
 * but re-run to make sure you have the latest):
 *
 *     npm install stripe
 */

/**
 * Stripe SDK is initialized lazily ONCE on first request and then cached
 * for the lifespan of the serverless function instance. This avoids
 * re-creating the client (and re-resolving API types) on every webhook.
 */
let cachedStripe: Stripe | null = null;
function getStripe(secret: string): Stripe {
  if (!cachedStripe) {
    cachedStripe = new Stripe(secret, {
      // Use the Stripe SDK's built-in default API version (matches the TS
      // types shipped by stripe@^22). Do NOT hardcode a custom/unknown
      // version string — it breaks API requests.
      maxNetworkRetries: 2,
      timeout: 20_000,
      typescript: true,
    });
  }
  return cachedStripe;
}

/**
 * Disable Next.js body parsing so we can verify the signature against the
 * *raw* bytes of the request body. Signature verification MUST operate on
 * the exact bytes Stripe sent; any JSON re-stringifying, buffering with a
 * different encoding, or middleware rewriting the body will break the HMAC.
 *
 * In the App Router (Next 13+) we simply call `await req.text()` to obtain
 * the raw body string before any JSON parsing.
 */
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

/**
 * Small structured-logger helper. In production this would ship to
 * Datadog/New Relic/Sentry; locally we just pretty-print.
 */
function logWebhook(level: "info" | "warn" | "error", message: string, extra?: Record<string, unknown>) {
  const base = { level, ts: new Date().toISOString(), source: "stripe-webhook", message };
  // eslint-disable-next-line no-console
  const printer = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  printer(extra ? { ...base, ...extra } : base);
}

/**
 * Map Stripe's `shipping_details / address / customer_details` objects to
 * the project's canonical `Address` type (types/order.ts).
 */
function toAddress(stripeAddress?: Stripe.Address | null, shippingName?: string | null): Address {
  return {
    street: [stripeAddress?.line1, stripeAddress?.line2].filter(Boolean).join(" ") ?? "",
    city: stripeAddress?.city ?? "",
    state: stripeAddress?.state ?? "",
    postalCode: stripeAddress?.postal_code ?? "",
    country: stripeAddress?.country ?? "",
    // shippingName is not part of Address but we preserve it inline via
    // customerName on the order object instead.
  };
  // satisfy unused-param lint without removing useful data:
  void shippingName;
}

/**
 * Extract Stripe line_items from a completed checkout session.
 *
 * The SDK does NOT include line_items by default in the checkout session
 * object delivered with the webhook event. To guarantee we have products
 * to persist, we:
 *   a) prefer `session.metadata` populated by YOUR checkout route with
 *      a compact JSON payload (recommended: deterministic + fast),
 *   b) fall back to re-fetching the session with `expand: ["line_items"]`.
 *
 * Update app/api/checkout/route.ts to include:
 *   metadata: {
 *     orderNumber: "LAMAH-12345",
 *     items: JSON.stringify([{productId, name, image, size, color, quantity, price}]),
 *     customerName,
 *     customerPhone,
 *     shippingAddress: JSON.stringify(address),
 *     billingAddress: JSON.stringify(address),
 *   }
 */
function splitCsv(s: string | null | undefined): string[] {
  if (!s) return [];
  return s.split(",").map((p) => p.trim()).filter(Boolean);
}

function buildItemsFromCompactMeta(metadata: Stripe.Metadata | null | undefined): OrderItem[] | null {
  if (!metadata) return null;
  const ids = splitCsv(metadata.itemIds);
  const qtys = splitCsv(metadata.itemQtys);
  const prices = splitCsv(metadata.itemPrices);
  const sizes = splitCsv(metadata.itemSizes);
  const names = (metadata.itemNames || "").split("|").map((s) => s.trim());
  if (ids.length === 0) return null;
  const n = Math.max(ids.length, qtys.length, prices.length, sizes.length, names.length);
  const items: OrderItem[] = [];
  for (let i = 0; i < n; i++) {
    const id = ids[i] ?? `item-${i + 1}`;
    const qtyRaw = qtys[i] ?? "1";
    const priceRaw = prices[i] ?? "0";
    const sizeRaw = sizes[i] ?? "-";
    const name = (names[i] ?? `Product ${i + 1}`).trim() || `Product ${i + 1}`;
    const quantity = Math.max(1, Number.parseInt(qtyRaw, 10) || 1);
    const price = Number(Number.parseFloat(priceRaw || "0").toFixed(2));
    let size: string | undefined;
    let color: string | undefined;
    if (sizeRaw && sizeRaw !== "-") {
      const parts = sizeRaw.split("|");
      parts.forEach((part) => {
        if (part.startsWith("S:")) size = part.slice(2) || undefined;
        if (part.startsWith("C:")) color = part.slice(2) || undefined;
      });
    }
    items.push({
      id,
      productId: id,
      name,
      image: "",
      quantity,
      price: Number.isFinite(price) ? price : 0,
      ...(size ? { size } : {}),
      ...(color ? { color } : {}),
    });
  }
  return items.length > 0 ? items : null;
}

async function getCheckoutLineItems(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<{ items: OrderItem[]; orderNumber: string }> {
  const metaOrderNumber = session.metadata?.orderNumber;

  // 1. Legacy JSON fallback (`metadata.items`): old checkout sessions may
  //    still have this. Use it if present and valid.
  const metaItemsRaw = session.metadata?.items;
  if (metaItemsRaw && metaOrderNumber) {
    try {
      const parsed = JSON.parse(metaItemsRaw) as OrderItem[];
      return { orderNumber: metaOrderNumber, items: parsed };
    } catch {
      logWebhook("warn", "checkout.metadata.items was present but failed JSON.parse", {
        sessionId: session.id,
      });
    }
  }

  // 2. Compact summary metadata (new checkout API emits itemIds/itemQtys/
  //    itemPrices/itemSizes/itemNames — each < 500 chars). No API call.
  const compactItems = buildItemsFromCompactMeta(session.metadata);
  if (compactItems && compactItems.length > 0) {
    return {
      orderNumber: metaOrderNumber ?? `LAMAH-${session.id.slice(-8).toUpperCase()}`,
      items: compactItems,
    };
  }

  // 3. Final fallback: fetch + expand line_items + price.product from Stripe.
  logWebhook("info", "Re-fetching checkout session with expand=line_items", {
    sessionId: session.id,
  });
  const expanded = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const items: OrderItem[] =
    expanded.line_items?.data.map((li, idx): OrderItem => {
      const price = li.price;
      const productObj: Stripe.Product | Stripe.DeletedProduct | null =
        price && typeof price.product === "object" ? price.product : null;
      const isLiveProduct =
        productObj && !("deleted" in productObj && productObj.deleted === true);
      const name: string =
        li.description ??
        (isLiveProduct ? productObj.name : null) ??
        `Product ${idx + 1}`;
      const divisor = smallestUnitDivisor(li.currency ?? "usd");
      const unitAmount =
        li.amount_total != null && li.quantity && li.quantity > 0
          ? (li.amount_total / li.quantity) / divisor
          : 0;
      const image =
        isLiveProduct && Array.isArray(productObj.images) && productObj.images[0]
          ? productObj.images[0]
          : "";
      const priceProductMetadata =
        isLiveProduct && productObj.metadata && typeof productObj.metadata === "object"
          ? (productObj.metadata as Record<string, string>)
          : null;
      const size = priceProductMetadata?.size || undefined;
      const color = priceProductMetadata?.color || undefined;
      const metadataItemId = priceProductMetadata?.item_id;
      const metadataProductId = priceProductMetadata?.product_id;
      return {
        id: metadataItemId || li.id,
        productId:
          metadataProductId ||
          (typeof price?.product === "string"
            ? price.product
            : isLiveProduct
            ? productObj.id
            : null) ||
          li.id,
        name,
        image,
        quantity: li.quantity ?? 1,
        price: Number(unitAmount.toFixed(2)),
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      };
    }) ?? [];

  return {
    orderNumber: metaOrderNumber ?? `LAMAH-${session.id.slice(-8).toUpperCase()}`,
    items,
  };
}

/**
 * Business logic for `checkout.session.completed`.
 *
 * This fires AFTER a customer has paid for a Checkout Session. It is the
 * PRIMARY event to rely on for order fulfillment — do NOT trust the
 * `success_url` page (customers can close the tab, hit back, etc.).
 */
async function handleCheckoutSessionCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  // Lazy import + init Firebase Admin ONLY when actually persisting data.
  // This prevents Next.js from invoking cert() with the private key during
  // `next build` page-data collection (which can throw OSSL errors if the
  // key is malformed or not present at build time).
  const { getAdminFirestore } = await import("@/firebase/admin");
  const adminDb = getAdminFirestore();

  logWebhook("info", "checkout.session.completed → starting", {
    sessionId: session.id,
  });

  // ---- Extract every field the event gives us (audit-log everything) ----
  // Note: across Stripe SDK + API version combinations, fields such as
  // amount_discount, amount_tax, amount_subtotal, shipping_cost, created,
  // and shipping_details are variably declared on Checkout.Session types.
  // We read the well-known ones via the declared type and the remainder via
  // a widened raw view so the handler remains forward-compatible.
  const {
    id: sessionId,
    payment_intent,
    customer,
    amount_total,
    currency,
    payment_status,
    metadata,
    customer_details,
  } = session;

  const rawSession = session as unknown as Record<string, unknown>;

  const getRawNumber = (key: string): number | undefined => {
    const v = rawSession[key];
    return typeof v === "number" ? v : undefined;
  };

  const amount_subtotal = getRawNumber("amount_subtotal");
  const amount_discount = getRawNumber("amount_discount");
  const amount_tax = getRawNumber("amount_tax");
  const created = getRawNumber("created");

  const shipping_cost_raw = rawSession.shipping_cost;
  const shipping_cost:
    | {
        amount_subtotal?: number | null;
        amount_tax?: number | null;
        amount_total?: number | null;
      }
    | null
    | undefined =
    typeof shipping_cost_raw === "object" && shipping_cost_raw != null
      ? (shipping_cost_raw as NonNullable<typeof shipping_cost>)
      : typeof shipping_cost_raw === "number"
      ? { amount_total: shipping_cost_raw }
      : undefined;

  // 'shipping_details' shape differs across Stripe SDK releases and may not
  // be declared directly on the Checkout.Session type, so read it as a raw
  // optional property with fallbacks.
  const shipping_details:
    | {
        name?: string | null;
        phone?: string | null;
        address?: Stripe.Address | null;
      }
    | undefined =
    rawSession && typeof rawSession.shipping_details === "object" && rawSession.shipping_details != null
      ? (rawSession.shipping_details as NonNullable<typeof shipping_details>)
      : undefined;

  const paymentIntentId =
    typeof payment_intent === "string" ? payment_intent : payment_intent?.id;
  const customerId = typeof customer === "string" ? customer : customer?.id;
  const email = customer_details?.email ?? null;
  const customerName =
    shipping_details?.name ??
    customer_details?.name ??
    metadata?.customerName ??
    "";
  const customerPhone =
    customer_details?.phone ?? metadata?.customerPhone ?? "";

  logWebhook("info", "checkout.session.completed → extracted", {
    sessionId,
    paymentIntentId,
    customerId,
    email,
    amount_total,
    currency,
    payment_status,
    metadata,
  });

  // ---- Resolve line items + orderNumber ----
  const { items, orderNumber } = await getCheckoutLineItems(stripe, session);

  // ---- Derive addresses ----
  const stripeShipAddr = shipping_details?.address ?? null;
  const stripeBillAddr = customer_details?.address ?? null;

  let shippingAddress: Address;
  try {
    shippingAddress = metadata?.shippingAddress
      ? (JSON.parse(metadata.shippingAddress) as Address)
      : toAddress(stripeShipAddr, shipping_details?.name ?? null);
  } catch {
    shippingAddress = toAddress(stripeShipAddr, shipping_details?.name ?? null);
  }

  let billingAddress: Address;
  try {
    billingAddress = metadata?.billingAddress
      ? (JSON.parse(metadata.billingAddress) as Address)
      : toAddress(stripeBillAddr, null);
  } catch {
    billingAddress = toAddress(stripeBillAddr, null);
  }

  // ---- Normalize to project-enum strings (see types/order.ts) ----
  const paymentStatus: PaymentStatus =
    payment_status === "paid"
      ? "Paid"
      : payment_status === "unpaid"
      ? "Failed"
      : "Pending";

  const paymentMethod: PaymentMethod = "Stripe";

  const orderStatus: OrderStatus = paymentStatus === "Paid" ? "Processing" : "Pending";

  // Money math: Stripe amounts are always in the SMALLEST unit (cents,
  // yen, fils, etc.). The divisor depends on the currency.
  const divisor = smallestUnitDivisor(currency);
  const subtotal = Number(((amount_subtotal ?? 0) / divisor).toFixed(2));
  const discount = Number(((amount_discount ?? 0) / divisor).toFixed(2));
  const tax = Number(((amount_tax ?? 0) / divisor).toFixed(2));
  const shippingFee = Number(
    (((shipping_cost?.amount_total ?? 0) as number) / divisor).toFixed(2)
  );
  const total = Number(((amount_total ?? 0) / divisor).toFixed(2));

  const createdAtISO = new Date(
    ((created ?? Math.floor(Date.now() / 1000)) * 1000)
  ).toISOString();

  // ---- Pull customer identity from metadata (guaranteed by our checkout API) ----
  const customerIdFromMeta = metadata?.customerId;
  const customerEmailFromMeta = metadata?.customerEmail;
  const customerNameFromMeta = metadata?.customerName;
  const customerPhoneFromMeta = metadata?.customerPhone;

  const resolvedCustomerId =
    customerIdFromMeta && typeof customerIdFromMeta === "string"
      ? customerIdFromMeta
      : typeof customer === "string"
      ? customer
      : customer?.id;

  if (!resolvedCustomerId) {
    logWebhook(
      "warn",
      "checkout.session.completed has no customerId; cannot link order to an account.",
      { sessionId }
    );
  }

  // ---- Build order payload (matches CustomerOrder shape) ----
  const finalProducts: OrderItem[] = items.map((it) => ({
    id: it.id,
    productId: it.productId || it.id,
    name: it.name,
    image: it.image || "",
    size: it.size,
    color: it.color,
    quantity: it.quantity,
    price: Number(Number(it.price || 0).toFixed(2)),
  }));

  const customerDisplayName =
    (customerNameFromMeta && typeof customerNameFromMeta === "string"
      ? customerNameFromMeta
      : customerName) ||
    (customerEmailFromMeta || email || "LAMAH Customer");

  const customerEmailResolved =
    (customerEmailFromMeta && typeof customerEmailFromMeta === "string"
      ? customerEmailFromMeta
      : email) || "";

  const customerPhoneResolved =
    (customerPhoneFromMeta && typeof customerPhoneFromMeta === "string"
      ? customerPhoneFromMeta
      : customerPhone) || "";

  const timeline: TimelineEvent[] = [
    {
      id: `tl-${sessionId}-created`,
      event: "Order Created",
      description:
        paymentStatus === "Paid"
          ? "Payment confirmed via Stripe. Order received and being processed."
          : "Checkout session completed via Stripe. Waiting for payment confirmation.",
      timestamp: createdAtISO,
      completed: true,
    },
  ];

  if (paymentStatus === "Paid") {
    timeline.push({
      id: `tl-${sessionId}-paid`,
      event: "Payment Received",
      description: `Transaction ID: ${paymentIntentId ?? sessionId}`,
      timestamp: createdAtISO,
      completed: true,
    });
  }

  const orderId = sessionId;

  const order: CustomerOrder = {
    id: orderId,
    orderNumber,
    customerId: resolvedCustomerId || "",
    customerName: customerDisplayName,
    customerEmail: customerEmailResolved,
    customerPhone: customerPhoneResolved,
    customerAvatar: "",
    products: finalProducts,
    subtotal,
    shippingFee,
    discount,
    tax,
    total,
    paymentMethod,
    paymentStatus,
    transactionId: paymentIntentId,
    deliveryStatus: orderStatus,
    shippingAddress,
    billingAddress,
    status: orderStatus,
    adminNotes: [],
    timeline,
    createdAt: createdAtISO,
    updatedAt: createdAtISO,
  };

  // ---- Persist to Firestore (idempotent: retried webhooks overwrite safely) ----
  try {
    const ordersRef = adminDb.collection("orders").doc(orderId);
    await ordersRef.set(order, { merge: true });

    // ---- Also write a lightweight customer→orders lookup document so the
    // dashboard can query orders by customerId via index. The standard
    // `where("customerId", "==", uid)` on the `orders` collection already
    // works; this is just a convenience index entry. ----
    if (resolvedCustomerId) {
      const customerOrdersRef = adminDb
        .collection("customers")
        .doc(resolvedCustomerId)
        .collection("orders")
        .doc(orderId);
      await customerOrdersRef.set(
        {
          orderId,
          orderNumber,
          total,
          status: orderStatus,
          paymentStatus,
          createdAt: createdAtISO,
        },
        { merge: true }
      );

      // Ensure the /customers/{uid} doc exists for dashboards/CRM tools
      // that iterate the customers collection.
      try {
        const customerSummaryRef = adminDb
          .collection("customers")
          .doc(resolvedCustomerId);
        const customerSnap = await customerSummaryRef.get();
        if (!customerSnap.exists) {
          await customerSummaryRef.set(
            {
              id: resolvedCustomerId,
              name: customerDisplayName,
              email: customerEmailResolved,
              phone: customerPhoneResolved,
              totalOrders: 1,
              totalSpent: total,
              createdAt: createdAtISO,
              updatedAt: createdAtISO,
            },
            { merge: true }
          );
        } else {
          await customerSummaryRef.set(
            {
              name: customerDisplayName,
              email: customerEmailResolved,
              phone: customerPhoneResolved,
              updatedAt: createdAtISO,
            },
            { merge: true }
          );
        }
      } catch (summaryErr) {
        logWebhook("warn", "Failed to update customers summary doc", {
          customerId: resolvedCustomerId,
          err:
            summaryErr instanceof Error
              ? summaryErr.message
              : String(summaryErr),
        });
      }
    }

    // ---- Clear customer's cart on successful payment ----
    try {
      if (resolvedCustomerId) {
        const cartsRef = adminDb.collection("carts").doc(resolvedCustomerId);
        const cartsSnap = await cartsRef.get();
        if (cartsSnap.exists) {
          await cartsRef.set(
            { items: [], updatedAt: new Date(), checkoutSessionId: sessionId },
            { merge: true }
          );
        }
      }
    } catch (cartErr) {
      logWebhook("warn", "Failed to clear customer cart after payment", {
        customerId: resolvedCustomerId,
        err:
          cartErr instanceof Error ? cartErr.message : String(cartErr),
      });
    }

    logWebhook("info", "checkout.session.completed → persisted order", {
      orderNumber,
      orderId,
      customerId: resolvedCustomerId,
      itemsCount: finalProducts.length,
      total,
      paymentStatus,
    });
  } catch (persistErr) {
    logWebhook("error", "checkout.session.completed → persist FAILED", {
      sessionId,
      orderNumber,
      customerId: resolvedCustomerId,
      err:
        persistErr instanceof Error
          ? { message: persistErr.message, stack: persistErr.stack }
          : String(persistErr),
    });
    // Re-throw so the outer try/catch logs and still returns 200
    throw persistErr;
  }
}

/**
 * `payment_intent.succeeded` fires when the underlying money movement
 * settles. For one-time card Checkout Sessions it normally fires BEFORE
 * `checkout.session.completed`.
 *
 * You typically use it to:
 *   - upsell flows
 *   - update "Paid" timestamps independently of the checkout object
 *   - retry safety net if checkout.session.completed was missed
 */
async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  logWebhook("info", "Payment succeeded.", {
    paymentIntentId: pi.id,
    amount: pi.amount,
    currency: pi.currency,
    metadata: pi.metadata,
  });

  // =====================================================================
  // TODO: FUTURE BUSINESS LOGIC (examples)
  //   1. Set `paidAt` timestamp on the Order row:
  //        await updateOrder({ transactionId: pi.id }, { paidAt: new Date() });
  //   2. Award loyalty points / credits for the customer.
  //   3. Trigger analytics event (Segment, PostHog, GA4).
  //   4. Release held inventory (if you reserved stock during checkout).
  // =====================================================================
  void pi;
}

/**
 * `payment_intent.payment_failed` fires when a PaymentIntent could not be
 * confirmed/charged. Checkout normally retries automatically, but this is
 * where you surface the failure to the user.
 */
async function handlePaymentIntentFailed(pi: Stripe.PaymentIntent) {
  const lastError = pi.last_payment_error;
  logWebhook("warn", "Payment failed.", {
    paymentIntentId: pi.id,
    amount: pi.amount,
    currency: pi.currency,
    declineCode: lastError?.decline_code ?? null,
    failureMessage: lastError?.message ?? null,
    metadata: pi.metadata,
  });

  // =====================================================================
  // TODO: UPDATE ORDER STATUS
  //   - Order.status       → "Cancelled" (after N retries).
  //   - Order.paymentStatus→ "Failed".
  //   - Add an OrderNote + Timeline entry with the decline reason.
  //   Example:
  //     await updateOrder(
  //       { transactionId: pi.id },
  //       {
  //         paymentStatus: "Failed",
  //         status: "Cancelled",
  //         $push: {
  //           timeline: { event: "Payment Failed", description: lastError?.message },
  //         },
  //       }
  //     );
  //
  // TODO: RESTORE INVENTORY
  //   Release any stock reserved during the checkout attempt if your DB
  //   decremented it before payment succeeded.
  //
  // TODO: CUSTOMER COMMUNICATION
  //   Email/SMS the customer:
  //     "Your payment was declined — please retry with a different card."
  //   Link back to /cart or /checkout with a friendly error message.
  // =====================================================================
  void pi;
  void lastError;
}

/**
 * Route handler: POST /api/webhooks/stripe
 *
 * Lifecycle:
 *   1. Read raw body text (do NOT parse JSON yet — signature needs raw bytes).
 *   2. Pull the `stripe-signature` header.
 *   3. stripe.webhooks.constructEvent(rawBody, sigHeader, secret) verifies
 *      the HMAC SHA-256 signature + a rolling 5-minute timestamp replay
 *      guard built into the header.
 *   4. Switch on event.type → dispatch to typed handler.
 *   5. Return HTTP 200. Stripe retries non-2xx responses with exponential
 *      backoff for up to ~24 hours — so 200 as early as possible is ideal.
 */
export async function POST(req: Request) {
  // ---- 1. Validate required env vars ----
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret) {
    logWebhook("error", "STRIPE_SECRET_KEY is not set");
    return NextResponse.json(
      { error: "Server configuration incomplete" },
      { status: 500 }
    );
  }
  if (!webhookSecret) {
    logWebhook("error", "STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Server configuration incomplete" },
      { status: 500 }
    );
  }

  let stripe: Stripe;
  try {
    stripe = getStripe(stripeSecret);
  } catch (err) {
    logWebhook("error", "Failed to initialize Stripe client", {
      err: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // ---- 2. Read RAW BODY before any JSON parsing ----
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    logWebhook("error", "Failed to read request body", {
      err: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const signatureHeader = req.headers.get("stripe-signature");
  if (!signatureHeader) {
    logWebhook("warn", "Missing stripe-signature header", {
      rawBodyLength: rawBody.length,
    });
    return NextResponse.json(
      { error: "Missing webhook signature" },
      { status: 400 }
    );
  }

  // ---- 3. Verify signature ----
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
  } catch (err) {
    logWebhook("error", "Stripe signature verification failed", {
      err: err instanceof Error ? err.message : String(err),
      signatureHeader,
      rawBodyLength: rawBody.length,
    });
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  // ---- 4. Dispatch event ----
  logWebhook("info", "Received Stripe webhook", {
    id: event.id,
    type: event.type,
    apiVersion: event.api_version,
    created: event.created,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(stripe, session);
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(pi);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(pi);
        break;
      }

      default:
        // Stripe may send other events in future; just acknowledge so
        // we don't get retry storms for harmless unknown types.
        logWebhook("info", "Unhandled Stripe event type (acknowledged)", {
          type: event.type,
        });
        break;
    }
  } catch (err) {
    // Swallow handler errors from our side and still return 200.
    // We've already verified the event is from Stripe; returning a non-2xx
    // would cause Stripe to redeliver and hit the same error again.
    // Instead, log the error, page your on-call team via your observability
    // tool, and handle fulfillment asynchronously (idempotent upsert).
    logWebhook("error", "Webhook handler threw (acknowledged with 200)", {
      type: event.type,
      id: event.id,
      err: err instanceof Error ? { message: err.message, stack: err.stack } : String(err),
    });
  }

  // ---- 5. Success — always HTTP 200 ----
  return NextResponse.json({ received: true, event: event.type }, { status: 200 });
}
