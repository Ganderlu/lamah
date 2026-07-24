import Stripe from "stripe";
import { NextResponse } from "next/server";
import type { Address, OrderItem, PaymentMethod, PaymentStatus, OrderStatus } from "@/types/order";

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
      // Must match the apiVersion used in app/api/checkout/route.ts and the
      // TypeScript types shipped by stripe@^22.
      apiVersion: "2026-06-24.dahlia",
      // Vercel runs in us-east-1 (and other POPs); Stripe SDK auto-retries.
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
async function getCheckoutLineItems(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<{ items: OrderItem[]; orderNumber: string }> {
  // 1. Try compact metadata first (no extra round-trip to Stripe).
  const metaItemsRaw = session.metadata?.items;
  const metaOrderNumber = session.metadata?.orderNumber;
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

  // 2. Fallback: fetch + expand from Stripe API.
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
      const unitAmount = li.amount_total != null && li.quantity ? li.amount_total / li.quantity / 100 : 0;
      const image =
        isLiveProduct && Array.isArray(productObj.images) && productObj.images[0]
          ? productObj.images[0]
          : "";
      return {
        id: li.id,
        productId:
          (typeof price?.product === "string"
            ? price.product
            : isLiveProduct
            ? productObj.id
            : null) ?? li.id,
        name,
        image,
        quantity: li.quantity ?? 1,
        price: Number(unitAmount.toFixed(2)),
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
  logWebhook("info", "checkout.session.completed → starting", {
    sessionId: session.id,
  });

  // ---- Extract every field the event gives us (audit-log everything) ----
  const {
    id: sessionId,
    payment_intent,
    customer,
    amount_total,
    currency,
    payment_status,
    metadata,
    customer_details,
    shipping_cost,
    amount_subtotal,
    amount_discount,
    amount_tax,
    created,
  } = session;

  // 'shipping_details' shape differs across Stripe SDK releases and may not
  // be declared directly on the Checkout.Session type, so read it as a raw
  // optional property with fallbacks.
  const rawSession = session as Record<string, unknown>;
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

  // Money math: Stripe amounts are always in the SMALLEST unit (cents).
  // For `currency: usd` divide by 100; for zero-decimal currencies (JPY)
  // the divisor is 1. We normalise by checking Stripe's currency metadata.
  const currencySmallest =
    Stripe.CURRENCIES_WITHOUT_DECIMALS?.includes(
      (currency ?? "usd").toLowerCase() as Stripe.ZeroDecimalCurrency
    ) ?? false
      ? 1
      : 100;
  const subtotal = Number(((amount_subtotal ?? 0) / currencySmallest).toFixed(2));
  const discount = Number(((amount_discount ?? 0) / currencySmallest).toFixed(2));
  const tax = Number(((amount_tax ?? 0) / currencySmallest).toFixed(2));
  const shippingFee = Number(
    (((shipping_cost?.amount_total ?? 0) as number) / currencySmallest).toFixed(2)
  );
  const total = Number(((amount_total ?? 0) / currencySmallest).toFixed(2));

  const createdAtISO = new Date(created * 1000).toISOString();

  // =====================================================================
  // TODO: PERSIST THE ORDER (Firebase / Postgres / Supabase / etc.)
  //
  // Use the fields from `CustomerOrder` in types/order.ts:
  //
  // const orderPayload: Partial<CustomerOrder> = {
  //   id: sessionId,                      // or your own UUID
  //   orderNumber,                        // LAMAH-XXXXXX
  //   customerId: customerId ?? undefined,
  //   customerName,
  //   customerEmail: email ?? "",
  //   customerPhone,
  //   products: items,                    // MUST BE `products` (not `items`)
  //   subtotal,
  //   shippingFee,
  //   discount,
  //   tax,
  //   total,
  //   paymentMethod,
  //   paymentStatus,                      // Paid / Pending / Failed
  //   transactionId: paymentIntentId ?? undefined,
  //   deliveryStatus: orderStatus,
  //   shippingAddress,
  //   billingAddress,
  //   status: orderStatus,                // Processing if payment is "Paid"
  //   adminNotes: [],
  //   timeline: [
  //     {
  //       id: crypto.randomUUID(),
  //       event: "Order Created",
  //       description: "Checkout session completed via Stripe webhook.",
  //       timestamp: createdAtISO,
  //       completed: true,
  //     },
  //   ],
  //   createdAt: createdAtISO,
  //   updatedAt: createdAtISO,
  // };
  //
  // Example for Firebase:
  //   await setDoc(doc(db, "orders", sessionId), orderPayload);
  //
  // Example for SQL (Prisma):
  //   await prisma.order.upsert({
  //     where: { id: sessionId },
  //     create: orderPayload,
  //     update: orderPayload,
  //   });
  // ---------------------------------------------------------------------
  // TODO: REDUCE INVENTORY
  //   for each item in `items`:
  //     decrement stock by `item.quantity` for productId + size + color
  //   Handle race conditions with a DB transaction / atomic increment.
  // ---------------------------------------------------------------------
  // TODO: UPDATE PAYMENT STATUS
  //   If order already existed (retry of webhook), mark paymentStatus = Paid
  //   only if current status is Pending (never overwrite Refunded / Failed).
  // ---------------------------------------------------------------------
  // TODO: SEND CONFIRMATION EMAIL / SMS
  //   - Resend / Postmark / AWS SES with order summary.
  //   - include `orderNumber`, items, shipping address, tracking link
  //     placeholder, and a link to "/order/{orderNumber}".
  //   - Optionally push a notification to the admin dashboard.
  // =====================================================================
  void stripe;

  logWebhook("info", "checkout.session.completed → ready to persist", {
    orderNumber,
    itemsCount: items.length,
    total,
    paymentStatus,
  });
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
