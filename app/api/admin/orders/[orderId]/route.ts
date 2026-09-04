import { NextResponse } from "next/server";
import type { OrderStatus, PaymentStatus, TimelineEvent } from "@/types/order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_ROLES = new Set([
  "super_admin",
  "manager",
  "director",
  "inventory_manager",
  "marketing_manager",
  "customer_support",
]);

function isAdminRole(role: unknown): boolean {
  return typeof role === "string" && ADMIN_ROLES.has(role);
}

function getErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err ?? "Unknown error");
}

async function verifyAdminFromToken(token: string): Promise<{
  uid: string;
  role: string;
  displayName: string;
}> {
  const { getAdminAuth, getAdminFirestore } = await import("@/firebase/admin");
  const adminAuth = getAdminAuth();
  const adminDb = getAdminFirestore();

  let decoded: any;
  try {
    decoded = await adminAuth.verifyIdToken(token, false);
  } catch (adminErr) {
    const { decodeAndVerifyFirebaseIdToken } = await import("@/lib/firebaseJwt");
    const FIREBASE_PROJECT_ID =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      "lamahclothing";
    const result = await decodeAndVerifyFirebaseIdToken(token, FIREBASE_PROJECT_ID);
    decoded = result.payload;
  }

  const uid = decoded?.uid ?? decoded?.sub;
  if (!uid || typeof uid !== "string") {
    throw new Error("INVALID_ADMIN");
  }

  let role: string = "";
  let displayName: string = decoded?.name ?? "";

  try {
    const adminSnap = await adminDb.collection("admins").doc(uid).get();
    if (adminSnap.exists) {
      const adminData = adminSnap.data() ?? {};
      role = String(adminData.role ?? "");
      if (adminData.firstName || adminData.lastName) {
        displayName = [adminData.firstName, adminData.lastName].filter(Boolean).join(" ").trim();
      }
    }
  } catch (_) {
    /* swallow */
  }

  if (!role) {
    try {
      const userSnap = await adminDb.collection("users").doc(uid).get();
      if (userSnap.exists) {
        const userData = userSnap.data() ?? {};
        role = String(userData.role ?? "");
        if (!displayName) {
          displayName = [userData.firstName, userData.lastName].filter(Boolean).join(" ").trim();
        }
      }
    } catch (_) {
      /* swallow */
    }
  }

  if (!isAdminRole(role)) {
    throw new Error("INVALID_ADMIN");
  }

  if (!displayName) displayName = uid.slice(0, 8);

  return { uid, role, displayName };
}

async function verifyAdminBearer(request: Request): Promise<{
  uid: string;
  role: string;
  displayName: string;
}> {
  const authHeader =
    request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("INVALID_ADMIN");
  }
  const token = authHeader.slice("Bearer ".length);
  return verifyAdminFromToken(token);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    const admin = await verifyAdminBearer(request);

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const body = await request.json();

    const allowedUpdateFields = [
      "status",
      "deliveryStatus",
      "paymentStatus",
      "trackingNumber",
      "courier",
      "estimatedDelivery",
      "adminNotes",
      "timeline",
    ] as const;

    type AllowedKey = (typeof allowedUpdateFields)[number];
    const updateData: Partial<Record<AllowedKey, any>> = {};

    for (const key of allowedUpdateFields) {
      if (key in body && body[key] !== undefined) {
        (updateData as any)[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0 && !body.appendTimeline && !body.appendNote) {
      return NextResponse.json(
        { error: "No valid update fields provided." },
        { status: 400 }
      );
    }

    const { getAdminFirestore } = await import("@/firebase/admin");
    const adminDb = getAdminFirestore();
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const nowISO = new Date().toISOString();
    const finalUpdates: Record<string, any> = { ...updateData, updatedAt: nowISO };

    if (body.appendTimeline && typeof body.appendTimeline === "object") {
      const existing = orderSnap.data()?.timeline ?? [];
      const newEvent: TimelineEvent = {
        id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        event: String(body.appendTimeline.event ?? "Status Updated"),
        description: String(body.appendTimeline.description ?? ""),
        timestamp: nowISO,
        completed: true,
      };
      finalUpdates.timeline = [...existing, newEvent];
      finalUpdates.updatedAt = nowISO;
    }

    if (body.appendNote && typeof body.appendNote === "object") {
      const existing = orderSnap.data()?.adminNotes ?? [];
      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: String(body.appendNote.text ?? ""),
        adminId: admin.uid,
        adminName: admin.displayName,
        createdAt: nowISO,
      };
      finalUpdates.adminNotes = [...existing, newNote];
    }

    if (
      updateData.status &&
      (!orderSnap.data()?.timeline ||
        !(orderSnap.data()!.timeline as TimelineEvent[]).some(
          (t) => t.event === (updateData.status as OrderStatus)
        ))
    ) {
      const existing = (finalUpdates.timeline as TimelineEvent[]) ??
        (orderSnap.data()?.timeline as TimelineEvent[]) ??
        [];
      const statusEvent: TimelineEvent = {
        id: `tl-status-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        event: updateData.status as OrderStatus,
        description: `Status updated to ${updateData.status} by ${admin.displayName} (${admin.role})`,
        timestamp: nowISO,
        completed: true,
      };
      finalUpdates.timeline = [...existing, statusEvent];
    }

    await orderRef.set(finalUpdates, { merge: true });

    return NextResponse.json({
      ok: true,
      orderId,
      updated: Object.keys(finalUpdates),
      updatedAt: nowISO,
    });
  } catch (err) {
    const msg = getErrMessage(err);
    const isAuth = msg === "INVALID_ADMIN";
    console.error("[admin/orders] PATCH failed:", err);
    return NextResponse.json(
      { error: isAuth ? "Admin authentication required." : msg || "Update failed." },
      { status: isAuth ? 401 : 500 }
    );
  }
}
