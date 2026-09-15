import { NextResponse } from "next/server";
import { getPaypalAccessToken, getPaypalBaseUrl } from "@/lib/paypal";
import type {
  Address,
  CustomerOrder,
  OrderItem,
  PaymentStatus,
  OrderStatus,
  TimelineEvent,
} from "@/types/order";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

function logWebhook(
  level: "info" | "warn" | "error",
  message: string,
  extra?: Record<string, unknown>
) {
  const base = {
    level,
    ts: new Date().toISOString(),
    source: "paypal-webhook",
    message,
  };
  const printer =
    level === "error"
      ? console.error
      : level === "warn"
      ? console.warn
      : console.log;
  printer(extra ? { ...base, ...extra } : base);
}

function splitCsv(s: string | null | undefined): string[] {
  if (!s) return [];
  return s.split(",").map((p) => p.trim()).filter(Boolean);
}

function buildItemsFromCompactMeta(meta: Record<string, string>): OrderItem[] | null {
  const ids = splitCsv(meta.itemIds);
  const qtys = splitCsv(meta.itemQtys);
  const prices = splitCsv(meta.itemPrices);
  const sizes = splitCsv(meta.itemSizes);
  const names = (meta.itemNames || "").split("|").map((s) => s.trim());
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

function toPaypalAddress(paypalAddress?: Record<string, unknown> | null): Address {
  const addr = paypalAddress ?? {};
  const line1 = typeof addr.address_line_1 === "string" ? addr.address_line_1 : "";
  const line2 = typeof addr.address_line_2 === "string" ? addr.address_line_2 : "";
  return {
    street: [line1, line2].filter(Boolean).join(" "),
    city: typeof addr.admin_area_2 === "string" ? addr.admin_area_2 : "",
    state: typeof addr.admin_area_1 === "string" ? addr.admin_area_1 : "",
    postalCode: typeof addr.postal_code === "string" ? addr.postal_code : "",
    country: typeof addr.country_code === "string" ? addr.country_code : "",
  };
}

async function verifyPaypalWebhookSignature(
  rawBody: string,
  headers: Headers
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    logWebhook(
      "warn",
      "PAYPAL_WEBHOOK_ID is not set; skipping signature verification (accept all webhooks)."
    );
    return true;
  }

  try {
    const accessToken = await getPaypalAccessToken();
    const baseUrl = getPaypalBaseUrl();

    const certUrl = headers.get("paypal-cert-url");
    const transmissionId = headers.get("paypal-transmission-id");
    const transmissionTime = headers.get("paypal-transmission-time");
    const transmissionSig = headers.get("paypal-transmission-sig");
    const authAlgo = headers.get("paypal-auth-algo");

    const response = await fetch(
      `${baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transmission_id: transmissionId,
          transmission_time: transmissionTime,
          cert_url: certUrl,
          actual_signed_fields:
            "transmission_id|transmission_time|webhook_id|cert_url|auth_algo",
          auth_algo: authAlgo,
          transmission_sig: transmissionSig,
          webhook_id: webhookId,
          webhook_event: JSON.parse(rawBody),
        }),
      }
    );

    if (!response.ok) {
      logWebhook("warn", "Webhook signature verify request failed", {
        status: response.status,
      });
      return false;
    }

    const result = await response.json();
    const verificationStatus = result.verification_status;

    if (verificationStatus === "SUCCESS") {
      return true;
    }

    logWebhook("warn", "Webhook signature verification failed", {
      verificationStatus,
    });
    return false;
  } catch (err) {
    logWebhook("error", "Exception during webhook signature verification", {
      err: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

async function handlePaymentCaptureCompleted(event: any) {
  logWebhook("info", "PAYMENT.CAPTURE.COMPLETED → starting", {
    eventId: event.id,
  });

  const resource = event.resource || {};
  const paypalOrderId: string =
    resource?.supplementary_data?.related_ids?.order_id ||
    (resource?.invoice_id && typeof resource.invoice_id === "string"
      ? resource.invoice_id
      : "") ||
    "";

  const amount = resource?.amount;
  const totalAmount = Number(Number(amount?.value || 0).toFixed(2));
  const transactionId = resource?.id || event.id;
  const captureStatus = resource?.status || "COMPLETED";

  if (!paypalOrderId) {
    logWebhook(
      "warn",
      "PAYMENT.CAPTURE.COMPLETED: No order_id in supplementary_data; cannot look up order.",
      { resource }
    );
    return;
  }

  const { getAdminFirestore } = await import("@/firebase/admin");
  const adminDb = getAdminFirestore();

  const orderDocRef = adminDb.collection("orders").doc(paypalOrderId);
  const orderSnap = await orderDocRef.get();

  if (!orderSnap.exists) {
    logWebhook(
      "warn",
      `PAYMENT.CAPTURE.COMPLETED: No order document for paypalOrderId=${paypalOrderId}; skipping.`
    );
    return;
  }

  const existingOrder = orderSnap.data() as CustomerOrder;

  const paymentStatus: PaymentStatus =
    captureStatus === "COMPLETED" || captureStatus === "CAPTURED"
      ? "Paid"
      : captureStatus === "DECLINED" || captureStatus === "FAILED"
      ? "Failed"
      : "Pending";

  const orderStatus: OrderStatus =
    paymentStatus === "Paid" ? "Processing" : existingOrder.status;

  const createdAtISO = new Date().toISOString();

  const updatedTimeline = [...(existingOrder.timeline || [])];
  if (
    paymentStatus === "Paid" &&
    !updatedTimeline.some((t) => t.event === "Payment Received")
  ) {
    updatedTimeline.push({
      id: `tl-wh-${paypalOrderId}-paid`,
      event: "Payment Received",
      description: `Webhook confirmed. Transaction ID: ${transactionId}`,
      timestamp: createdAtISO,
      completed: true,
    });
  }

  await orderDocRef.set(
    {
      paymentStatus,
      status: orderStatus,
      deliveryStatus: orderStatus,
      transactionId: existingOrder.transactionId || transactionId,
      total: existingOrder.total || totalAmount,
      timeline: updatedTimeline,
      updatedAt: createdAtISO,
    },
    { merge: true }
  );

  if (existingOrder.customerId) {
    const customerOrdersRef = adminDb
      .collection("customers")
      .doc(existingOrder.customerId)
      .collection("orders")
      .doc(paypalOrderId);
    await customerOrdersRef.set(
      {
        status: orderStatus,
        paymentStatus,
        updatedAt: createdAtISO,
      },
      { merge: true }
    );
  }

  logWebhook("info", "PAYMENT.CAPTURE.COMPLETED → updated order", {
    orderNumber: existingOrder.orderNumber,
    paypalOrderId,
    paymentStatus,
  });
}

async function handleCheckoutOrderApproved(event: any) {
  logWebhook("info", "CHECKOUT.ORDER.APPROVED → starting", {
    eventId: event.id,
  });

  const resource = event.resource || {};
  const paypalOrderId: string = resource?.id || "";

  if (!paypalOrderId) {
    logWebhook(
      "warn",
      "CHECKOUT.ORDER.APPROVED: No resource.id; cannot identify order."
    );
    return;
  }

  const purchaseUnit = resource.purchase_units?.[0];
  const rawCustomId =
    purchaseUnit && typeof purchaseUnit.custom_id === "string"
      ? purchaseUnit.custom_id
      : "";
  const referenceId =
    typeof purchaseUnit?.reference_id === "string" ? purchaseUnit.reference_id : "";

  let customMeta: Record<string, string> = {};
  let resolvedOrderNumberFromMeta: string = "";
  let pendingFullItems: OrderItem[] | null = null;

  if (rawCustomId) {
    try {
      const parsed = JSON.parse(rawCustomId);
      if (parsed && typeof parsed === "object") {
        customMeta = parsed;
        resolvedOrderNumberFromMeta = parsed.orderNumber || referenceId || rawCustomId;
      }
    } catch {
      const { getAdminFirestore } = await import("@/firebase/admin");
      const adminDb = getAdminFirestore();
      try {
        const pendingSnap = await adminDb
          .collection("pending_orders")
          .doc(rawCustomId)
          .get();
        if (pendingSnap.exists) {
          const pendingData = pendingSnap.data() as Record<string, unknown>;
          customMeta = {};
          for (const [k, v] of Object.entries(pendingData)) {
            if (v == null) continue;
            if (typeof v === "string") {
              customMeta[k] = v;
            }
          }
          resolvedOrderNumberFromMeta =
            (customMeta.orderNumber as string) || rawCustomId || referenceId;
          if (Array.isArray(pendingData.items)) {
            pendingFullItems = (pendingData.items as OrderItem[]).filter(Boolean);
          }
        } else {
          resolvedOrderNumberFromMeta = rawCustomId;
        }
      } catch (lookupErr) {
        logWebhook("warn", "Could not look up pending_orders from Firestore", {
          err:
            lookupErr instanceof Error
              ? lookupErr.message
              : String(lookupErr),
        });
        resolvedOrderNumberFromMeta = rawCustomId;
      }
    }
  }

  if (!resolvedOrderNumberFromMeta) {
    resolvedOrderNumberFromMeta =
      referenceId || `LAMAH-${paypalOrderId.slice(-8).toUpperCase()}`;
  }

  const orderNumber: string = resolvedOrderNumberFromMeta;

  const resolvedCustomerId: string = customMeta.customerId || "";
  const customerEmailResolved: string =
    customMeta.customerEmail ||
    resource.payer?.email_address ||
    "";
  const customerNameResolved: string =
    customMeta.customerName ||
    [
      resource.payer?.name?.given_name,
      resource.payer?.name?.surname,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    resource.payer?.email_address?.split("@")[0] ||
    "LAMAH Customer";
  const customerPhoneResolved: string = customMeta.customerPhone || "";

  const items =
    pendingFullItems && pendingFullItems.length > 0
      ? pendingFullItems
      : buildItemsFromCompactMeta(customMeta as any) || [];

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

  const totalAmount = Number(
    Number(
      customMeta.total ||
        purchaseUnit?.amount?.value ||
        resource.amount?.value ||
        0
    ).toFixed(2)
  );

  const shippingAddress: Address = toPaypalAddress(
    purchaseUnit?.shipping?.address
  );
  const billingAddress: Address = toPaypalAddress(
    resource.payer?.address
  );

  const paymentStatus: PaymentStatus = "Pending";
  const orderStatus: OrderStatus = "Pending";
  const createdAtISO = new Date().toISOString();

  const timeline: TimelineEvent[] = [
    {
      id: `tl-wh-${paypalOrderId}-approved`,
      event: "Order Approved",
      description:
        "Customer approved the order via PayPal. Waiting for payment capture confirmation.",
      timestamp: createdAtISO,
      completed: true,
    },
  ];

  const { getAdminFirestore } = await import("@/firebase/admin");
  const adminDb = getAdminFirestore();

  const orderUpdate: Record<string, unknown> = {
    id: paypalOrderId,
    orderNumber,
    customerName: customerNameResolved,
    customerEmail: customerEmailResolved,
    customerPhone: customerPhoneResolved,
    customerAvatar: "",
    products: finalProducts,
    subtotal: totalAmount,
    shippingFee: 0,
    discount: 0,
    tax: 0,
    total: totalAmount,
    paymentMethod: "PayPal",
    paymentStatus,
    transactionId: paypalOrderId,
    deliveryStatus: orderStatus,
    shippingAddress,
    billingAddress,
    status: orderStatus,
    adminNotes: [],
    timeline,
    createdAt: createdAtISO,
    updatedAt: createdAtISO,
  };

  if (resolvedCustomerId) {
    orderUpdate.customerId = resolvedCustomerId;
  }

  const ordersRef = adminDb.collection("orders").doc(paypalOrderId);
  await ordersRef.set(orderUpdate, { merge: true });

  if (resolvedCustomerId) {
    const customerOrdersRef = adminDb
      .collection("customers")
      .doc(resolvedCustomerId)
      .collection("orders")
      .doc(paypalOrderId);
    await customerOrdersRef.set(
      {
        orderId: paypalOrderId,
        orderNumber,
        total: totalAmount,
        status: orderStatus,
        paymentStatus,
        createdAt: createdAtISO,
      },
      { merge: true }
    );

    try {
      const customerSummaryRef = adminDb
        .collection("customers")
        .doc(resolvedCustomerId);
      const customerSnap = await customerSummaryRef.get();
      const summaryUpdate: Record<string, unknown> = {
        updatedAt: createdAtISO,
      };
      if (customMeta.customerName) {
        summaryUpdate.name = customerNameResolved;
      }
      if (customMeta.customerEmail) {
        summaryUpdate.email = customerEmailResolved;
      }
      if (customMeta.customerPhone) {
        summaryUpdate.phone = customerPhoneResolved;
      }
      if (!customerSnap.exists) {
        await customerSummaryRef.set(
          {
            id: resolvedCustomerId,
            name: customerNameResolved,
            email: customerEmailResolved,
            phone: customerPhoneResolved,
            totalOrders: 1,
            totalSpent: totalAmount,
            createdAt: createdAtISO,
            ...summaryUpdate,
          },
          { merge: true }
        );
      } else {
        await customerSummaryRef.set(summaryUpdate, { merge: true });
      }
    } catch (summaryErr) {
      logWebhook(
        "warn",
        "CHECKOUT.ORDER.APPROVED: Failed to update customers summary doc",
        {
          err:
            summaryErr instanceof Error
              ? summaryErr.message
              : String(summaryErr),
        }
      );
    }

    try {
      const cartsRef = adminDb.collection("carts").doc(resolvedCustomerId);
      const cartsSnap = await cartsRef.get();
      if (cartsSnap.exists) {
        await cartsRef.set(
          {
            items: [],
            updatedAt: new Date(),
            paypalOrderId: paypalOrderId,
          },
          { merge: true }
        );
      }
    } catch (cartErr) {
      logWebhook(
        "warn",
        "CHECKOUT.ORDER.APPROVED: Failed to clear customer cart",
        {
          err:
            cartErr instanceof Error ? cartErr.message : String(cartErr),
        }
      );
    }
  }

  logWebhook("info", "CHECKOUT.ORDER.APPROVED → upserted order", {
    orderNumber,
    paypalOrderId,
    customerId: resolvedCustomerId,
  });
}

export async function POST(req: Request) {
  const webhookIdConfig = process.env.PAYPAL_WEBHOOK_ID;

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    logWebhook("error", "Failed to read request body", {
      err: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    logWebhook("error", "Webhook body is not valid JSON", {
      bodyLength: rawBody.length,
    });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  logWebhook("info", "Received PayPal webhook", {
    id: event.id,
    type: event.event_type,
    createTime: event.create_time,
  });

  if (webhookIdConfig) {
    const sigOk = await verifyPaypalWebhookSignature(rawBody, req.headers);
    if (!sigOk) {
      logWebhook(
        "warn",
        "Webhook failed signature verification; returning 403."
      );
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 403 }
      );
    }
  }

  try {
    switch (event.event_type) {
      case "CHECKOUT.ORDER.APPROVED":
        await handleCheckoutOrderApproved(event);
        break;

      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCaptureCompleted(event);
        break;

      default:
        logWebhook("info", "Unhandled PayPal event type (acknowledged)", {
          type: event.event_type,
        });
        break;
    }
  } catch (err) {
    logWebhook("error", "Webhook handler threw (acknowledged with 200)", {
      type: event.event_type,
      id: event.id,
      err:
        err instanceof Error
          ? { message: err.message, stack: err.stack }
          : String(err),
    });
  }

  return NextResponse.json(
    { received: true, event: event.event_type },
    { status: 200 }
  );
}
