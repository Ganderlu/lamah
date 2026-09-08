import { NextResponse } from "next/server";
import type { OrderItem } from "@/types/order";
import { verifyBearerToken } from "@/lib/checkoutAuth";
import {
  createPaypalOrder,
  buildOrderNumber,
  truncateForMeta,
} from "@/lib/paypal";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      console.error("[paypal-create-order] NEXT_PUBLIC_BASE_URL is not set");
      return NextResponse.json(
        { error: "Base URL configuration missing." },
        { status: 500 }
      );
    }

    // 1. Verify Firebase ID token
    let customer: { uid: string; email: string; name: string };
    try {
      customer = await verifyBearerToken(request);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      const isUnauth = msg === "UNAUTHORIZED";
      const status = isUnauth ? 401 : 503;
      const bodyMsg = isUnauth
        ? "Please sign in before completing your purchase."
        : msg ||
          "We couldn't verify your account right now. Please refresh the page and try again.";
      return NextResponse.json({ error: bodyMsg }, { status });
    }

    // 2. Parse body + validate cart
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

    const customerNameFromBody: string =
      typeof rawBody?.customerName === "string" && rawBody.customerName.trim()
        ? rawBody.customerName.trim()
        : customer.name;
    const customerEmailFromBody: string =
      typeof rawBody?.customerEmail === "string" && rawBody.customerEmail.trim()
        ? rawBody.customerEmail.trim()
        : customer.email;
    const customerPhoneFromBody: string =
      typeof rawBody?.customerPhone === "string" ? rawBody.customerPhone : "";

    const orderNumber = buildOrderNumber();

    // 3. Normalize items + build compact metadata strings (each < 500 chars)
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
        color:
          item.color && typeof item.color === "string" ? item.color : undefined,
        quantity: Math.max(1, Number.isFinite(qty) ? qty : 1),
        price: Number(safePrice.toFixed(2)),
      };
    });

    const itemIds = normalizedItems
      .map((i) => i.productId || i.id)
      .join(",");
    const itemQtys = normalizedItems
      .map((i) => String(i.quantity))
      .join(",");
    const itemPrices = normalizedItems
      .map((i) => i.price.toFixed(2))
      .join(",");
    const itemSizes = normalizedItems
      .map((i) => {
        const parts: string[] = [];
        if (i.size) parts.push(`S:${i.size.replace(/,/g, "_")}`);
        if (i.color) parts.push(`C:${i.color.replace(/,/g, "_")}`);
        return parts.join("|") || "-";
      })
      .join(",");
    const itemNames = normalizedItems
      .map((i) => i.name.replace(/[,\n]/g, " ").slice(0, 80))
      .join("|");

    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4. Create PayPal order
    const order = await createPaypalOrder({
      orderNumber,
      items: normalizedItems,
      total: Number(totalAmount.toFixed(2)),
      currency: "USD",
      customerId: customer.uid,
      customerEmail: customerEmailFromBody,
      customerName: truncateForMeta(customerNameFromBody, 200),
      customerPhone: truncateForMeta(customerPhoneFromBody, 60),
      itemIds: truncateForMeta(itemIds, 500),
      itemQtys: truncateForMeta(itemQtys, 500),
      itemPrices: truncateForMeta(itemPrices, 500),
      itemSizes: truncateForMeta(itemSizes, 500),
      itemNames: truncateForMeta(itemNames, 500),
      itemCount: String(normalizedItems.length),
    });

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      orderNumber,
    });
  } catch (error: unknown) {
    console.error("[paypal-create-order] Error creating PayPal order:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) {
      message = error.message;
    }
    const status = message === "UNAUTHORIZED" ? 401 : 500;
    const userMessage =
      status === 401
        ? "Please sign in before completing your purchase."
        : message;
    return NextResponse.json({ error: userMessage }, { status });
  }
}
