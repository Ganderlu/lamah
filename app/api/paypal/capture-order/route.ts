import { NextResponse } from "next/server";
import { capturePaypalOrder, getPaypalOrderDetails } from "@/lib/paypal";
import type {
  Address,
  CustomerOrder,
  OrderItem,
  PaymentStatus,
  OrderStatus,
  TimelineEvent,
} from "@/types/order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const orderId: string = rawBody?.orderId;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Missing orderId." },
        { status: 400 }
      );
    }

    // 1. Capture the PayPal payment
    const captureResult = await capturePaypalOrder(orderId);
    console.log("[paypal-capture-order] Capture result:", {
      status: captureResult.status,
      orderId,
    });

    // 2. Get full order details (includes payer, shipping, metadata)
    const orderDetails = await getPaypalOrderDetails(orderId);

    // 3. Extract custom metadata from:
    //    a) Firestore pending_orders/{orderNumber} (preferred, full metadata)
    //    b) Fallback: JSON.parse purchase_units[0].custom_id (legacy compat)
    //    c) Fallback: orderNumber from reference_id
    const orderDetailsAny = orderDetails as unknown as Record<string, unknown>;
    const purchaseUnits = Array.isArray(orderDetailsAny.purchase_units)
      ? (orderDetailsAny.purchase_units as Array<Record<string, unknown>>)
      : [];
    const purchaseUnit = purchaseUnits[0];

    let customMeta: Record<string, string> = {};
    let resolvedOrderNumber: string = "";
    let pendingFullItems: OrderItem[] | null = null;

    const rawCustomId =
      purchaseUnit && typeof purchaseUnit.custom_id === "string"
        ? purchaseUnit.custom_id
        : "";

    const referenceId =
      typeof purchaseUnit?.reference_id === "string" ? purchaseUnit.reference_id : "";

    // Try Firestore first using custom_id (orderNumber) as key
    if (rawCustomId) {
      try {
        const { getAdminFirestore } = await import("@/firebase/admin");
        const adminDb = getAdminFirestore();
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
          resolvedOrderNumber =
            (customMeta.orderNumber as string) || rawCustomId || referenceId;

          if (Array.isArray(pendingData.items)) {
            pendingFullItems = (pendingData.items as OrderItem[]).filter(Boolean);
          }
        }
      } catch (lookupErr) {
        console.warn(
          "[paypal-capture-order] Could not look up pending_orders from Firestore:",
          lookupErr
        );
      }
    }

    // Legacy fallback: try to parse custom_id as JSON (older orders)
    if (!resolvedOrderNumber && rawCustomId) {
      try {
        const parsed = JSON.parse(rawCustomId) as Record<string, string>;
        if (parsed && typeof parsed === "object") {
          customMeta = parsed;
          resolvedOrderNumber = parsed.orderNumber || referenceId;
        }
      } catch {
        // Not JSON — it's just the orderNumber string (new behavior)
        resolvedOrderNumber = rawCustomId;
      }
    }

    if (!resolvedOrderNumber) {
      resolvedOrderNumber =
        referenceId || `LAMAH-${orderId.slice(-8).toUpperCase()}`;
    }

    const orderNumber: string = resolvedOrderNumber;

    const resolvedCustomerId: string = (customMeta.customerId as string) || "";
    const payerObj =
      typeof orderDetailsAny.payer === "object" && orderDetailsAny.payer != null
        ? (orderDetailsAny.payer as Record<string, unknown>)
        : {};
    const payerEmail = typeof payerObj.email_address === "string" ? payerObj.email_address : "";
    const customerEmailResolved: string =
      (customMeta.customerEmail as string) || payerEmail || "";
    const payerName =
      typeof payerObj.name === "object" && payerObj.name != null
        ? (payerObj.name as Record<string, unknown>)
        : {};
    const givenName = typeof payerName.given_name === "string" ? payerName.given_name : "";
    const surname = typeof payerName.surname === "string" ? payerName.surname : "";
    const fullPayerName = [givenName, surname].filter(Boolean).join(" ").trim();
    const customerNameResolved: string =
      (customMeta.customerName as string) ||
      fullPayerName ||
      payerEmail.split("@")[0] ||
      "LAMAH Customer";
    const customerPhoneResolved: string = (customMeta.customerPhone as string) || "";

    // 4. Get line items — prefer full items from pending_orders (includes images)
    //    Fall back to reconstructing items from compact CSV metadata
    const items: OrderItem[] =
      pendingFullItems && pendingFullItems.length > 0
        ? pendingFullItems
        : buildItemsFromCompactMeta(customMeta) || [];

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

    // 5. Parse amounts from capture
    const captureResultAny = captureResult as unknown as Record<string, unknown>;
    const capturePurchaseUnits = Array.isArray(captureResultAny.purchase_units)
      ? (captureResultAny.purchase_units as Array<Record<string, unknown>>)
      : [];
    const firstCaptureUnit = capturePurchaseUnits[0];
    const firstCapturePayments =
      typeof firstCaptureUnit?.payments === "object" && firstCaptureUnit.payments != null
        ? (firstCaptureUnit.payments as Record<string, unknown>)
        : {};
    const firstCaptureCaptures = Array.isArray(firstCapturePayments.captures)
      ? (firstCapturePayments.captures as Array<Record<string, unknown>>)
      : [];
    const firstCapture = firstCaptureCaptures[0];
    const amount =
      typeof firstCapture?.amount === "object" && firstCapture.amount != null
        ? (firstCapture.amount as Record<string, unknown>)
        : null;
    const totalAmount = Number(
      Number(
        (amount && typeof amount.value === "string" ? amount.value : null) ||
          customMeta.total ||
          (firstCaptureUnit && typeof firstCaptureUnit.amount === "object" && firstCaptureUnit.amount != null
            ? (firstCaptureUnit.amount as Record<string, unknown>).value
            : null) ||
          0
      ).toFixed(2)
    );
    const currencyCode =
      (amount && typeof amount.currency_code === "string" ? amount.currency_code : null) || "USD";
    void currencyCode;

    // 6. Derive addresses
    const orderPurchaseUnits = Array.isArray(orderDetailsAny.purchase_units)
      ? (orderDetailsAny.purchase_units as Array<Record<string, unknown>>)
      : [];
    const orderFirstPurchaseUnit = orderPurchaseUnits[0];
    const shippingObj =
      (orderFirstPurchaseUnit &&
        typeof orderFirstPurchaseUnit.shipping === "object" &&
        orderFirstPurchaseUnit.shipping != null
        ? orderFirstPurchaseUnit.shipping
        : null) ||
      (typeof orderDetailsAny.shipping === "object" && orderDetailsAny.shipping != null
        ? orderDetailsAny.shipping
        : null);
    const shippingAddressRaw =
      typeof shippingObj === "object" && shippingObj != null
        ? ((shippingObj as Record<string, unknown>).address as Record<string, unknown> | undefined)
        : undefined;
    const shippingAddress: Address = toPaypalAddress(shippingAddressRaw ?? null);
    const billingAddressRaw =
      typeof payerObj.address === "object" && payerObj.address != null
        ? (payerObj.address as Record<string, unknown>)
        : null;
    const billingAddress: Address = toPaypalAddress(billingAddressRaw);

    // 7. Determine payment/order status
    const captureStatus =
      (typeof captureResultAny.status === "string" ? captureResultAny.status : null) ||
      (typeof firstCapture?.status === "string" ? firstCapture.status : null) ||
      "PENDING";

    const paymentStatus: PaymentStatus =
      captureStatus === "COMPLETED" || captureStatus === "CAPTURED"
        ? "Paid"
        : captureStatus === "DECLINED" || captureStatus === "FAILED"
        ? "Failed"
        : "Pending";

    const orderStatus: OrderStatus =
      paymentStatus === "Paid" ? "Processing" : "Pending";

    // 8. Get transaction ID
    const transactionId: string =
      (typeof firstCapture?.id === "string" ? firstCapture.id : null) || orderId;

    const createdAtISO = new Date().toISOString();

    // 9. Build timeline
    const timeline: TimelineEvent[] = [
      {
        id: `tl-${orderId}-created`,
        event: "Order Created",
        description:
          paymentStatus === "Paid"
            ? "Payment confirmed via PayPal. Order received and being processed."
            : "Checkout completed via PayPal. Waiting for payment confirmation.",
        timestamp: createdAtISO,
        completed: true,
      },
    ];

    if (paymentStatus === "Paid") {
      timeline.push({
        id: `tl-${orderId}-paid`,
        event: "Payment Received",
        description: `Transaction ID: ${transactionId}`,
        timestamp: createdAtISO,
        completed: true,
      });
    }

    // 10. Build order object
    const order: CustomerOrder = {
      id: orderId,
      orderNumber,
      customerId: resolvedCustomerId || "",
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
      transactionId,
      deliveryStatus: orderStatus,
      shippingAddress,
      billingAddress,
      status: orderStatus,
      adminNotes: [],
      timeline,
      createdAt: createdAtISO,
      updatedAt: createdAtISO,
    };

    // 11. Persist to Firestore
    const { getAdminFirestore } = await import("@/firebase/admin");
    const adminDb = getAdminFirestore();

    const ordersRef = adminDb.collection("orders").doc(orderId);
    await ordersRef.set(order, { merge: true });

    // 12. Customer → orders lookup
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
          total: totalAmount,
          status: orderStatus,
          paymentStatus,
          createdAt: createdAtISO,
        },
        { merge: true }
      );

      // Ensure customers/{uid} doc exists
      try {
        const customerSummaryRef = adminDb
          .collection("customers")
          .doc(resolvedCustomerId);
        const customerSnap = await customerSummaryRef.get();
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
              updatedAt: createdAtISO,
            },
            { merge: true }
          );
        } else {
          await customerSummaryRef.set(
            {
              name: customerNameResolved,
              email: customerEmailResolved,
              phone: customerPhoneResolved,
              updatedAt: createdAtISO,
            },
            { merge: true }
          );
        }
      } catch (summaryErr) {
        console.warn(
          "[paypal-capture-order] Failed to update customers summary doc",
          summaryErr
        );
      }

      // 13. Clear customer's cart
      try {
        const cartsRef = adminDb.collection("carts").doc(resolvedCustomerId);
        const cartsSnap = await cartsRef.get();
        if (cartsSnap.exists) {
          await cartsRef.set(
            { items: [], updatedAt: new Date(), paypalOrderId: orderId },
            { merge: true }
          );
        }
      } catch (cartErr) {
        console.warn(
          "[paypal-capture-order] Failed to clear customer cart",
          cartErr
        );
      }
    }

    console.log("[paypal-capture-order] Persisted order:", {
      orderNumber,
      orderId,
      customerId: resolvedCustomerId,
      total: totalAmount,
      paymentStatus,
    });

    return NextResponse.json({
      status: captureResult.status,
      orderNumber,
      orderId,
      paymentStatus,
      transactionId,
    });
  } catch (error: unknown) {
    console.error("[paypal-capture-order] Error capturing order:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
