import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Admin, AdminRole } from "@/types/admin";

const toISOString = (value: unknown): string => {
  if (!value) return new Date().toISOString();
  if (typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

const toAdminRole = (value: unknown): AdminRole => {
  const allowed: readonly AdminRole[] = [
    "super_admin",
    "manager",
    "director",
    "inventory_manager",
    "marketing_manager",
    "customer_support",
  ];
  if (typeof value === "string" && allowed.includes(value as AdminRole)) {
    return value as AdminRole;
  }
  return "customer_support";
};

const toStatus = (
  value: unknown
): "active" | "inactive" | "suspended" => {
  if (value === "active" || value === "inactive" || value === "suspended") {
    return value;
  }
  return "active";
};

export const fetchAdminProfile = async (
  uid: string | null | undefined
): Promise<Admin | null> => {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    if (!snap.exists()) return null;

    const data = (snap.data() ?? {}) as Record<string, unknown>;
    const firstName = typeof data.firstName === "string" ? data.firstName : "";
    const lastName = typeof data.lastName === "string" ? data.lastName : "";
    const nameFromParts = `${firstName} ${lastName}`.trim();
    const rawName = typeof data.name === "string" ? data.name : "";
    const name = rawName || nameFromParts || "Admin";
    const role = toAdminRole(data.role);
    const status = toStatus(data.status);
    const createdAt = toISOString(data.createdAt);
    const updatedAt = toISOString(data.updatedAt ?? data.createdAt ?? new Date());

    return {
      id: snap.id,
      uid: snap.id,
      firstName,
      lastName,
      name,
      email: typeof data.email === "string" ? data.email : "",
      phone: typeof data.phone === "string" ? data.phone : "",
      role,
      status,
      profileImage:
        typeof data.profileImage === "string" ? data.profileImage : "",
      avatar:
        typeof data.avatar === "string"
          ? data.avatar
          : typeof data.profileImage === "string"
          ? data.profileImage
          : undefined,
      createdAt,
      updatedAt,
    };
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return null;
  }
};
