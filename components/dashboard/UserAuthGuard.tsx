"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import { useAuthStore } from "@/lib/store/auth";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { ShieldAlert } from "lucide-react";

const ADMIN_ROLES = new Set([
  "super_admin",
  "manager",
  "director",
  "inventory_manager",
  "marketing_manager",
  "customer_support",
]);

interface UserRecord {
  uid?: string;
  role?: string;
  status?: string;
}

interface AdminRecord {
  uid?: string;
  role?: string;
  status?: string;
}

const isAdminRole = (role: unknown): boolean =>
  typeof role === "string" && ADMIN_ROLES.has(role);

const isUserRole = (role: unknown): boolean => {
  if (typeof role !== "string") return false;
  const normal = role.trim().toLowerCase();
  return (
    normal === "customer" ||
    normal === "user" ||
    normal === "member" ||
    normal === "subscriber"
  );
};

const mapCustomerProfile = (
  uid: string,
  data: Record<string, unknown> | undefined,
  fallback: Partial<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    gender: string;
    photoURL: string;
    role: string;
  }> = {}
) => {
  const d = data ?? {};
  return {
    uid,
    firstName: String(d.firstName ?? fallback.firstName ?? ""),
    lastName: String(d.lastName ?? fallback.lastName ?? ""),
    username: String(d.username ?? fallback.username ?? ""),
    email: String(d.email ?? fallback.email ?? ""),
    phone: String(d.phone ?? fallback.phone ?? ""),
    country: String(d.country ?? fallback.country ?? ""),
    gender: String(d.gender ?? fallback.gender ?? ""),
    photoURL: String(d.photoURL ?? fallback.photoURL ?? ""),
    role: String(d.role ?? fallback.role ?? "customer"),
    status: String(d.status ?? "active"),
    rewardPoints: Number(d.rewardPoints ?? 0),
    membershipLevel: String(d.membershipLevel ?? "Silver Member"),
  };
};

export default function UserAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const setProfile = useAuthStore((state) => state.setProfile);
  const clearProfile = useAuthStore((state) => state.clearProfile);

  const [state, setState] = useState<"loading" | "denied" | "authorized">(
    "loading"
  );
  const [denyReason, setDenyReason] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const verifyAndSync = async (user: User | null) => {
      if (!user) {
        if (cancelled) return;
        clearProfile();
        setDenyReason("Please sign in to access your account.");
        setState("denied");
        return;
      }

      try {
        const adminRef = doc(db, "admins", user.uid);
        const userRef = doc(db, "users", user.uid);
        const [adminSnap, userSnap] = await Promise.all([
          getDoc(adminRef),
          getDoc(userRef),
        ]);

        const adminRec = adminSnap.exists()
          ? (adminSnap.data() as AdminRecord)
          : undefined;
        const userRec = userSnap.exists()
          ? (userSnap.data() as UserRecord)
          : undefined;

        const hasAdminRecord = Boolean(adminRec);
        const hasAdminRole = isAdminRole(adminRec?.role) || isAdminRole(userRec?.role);

        if (hasAdminRecord || hasAdminRole) {
          if (cancelled) return;
          clearProfile();
          try {
            await auth.signOut();
          } catch (_) {
            /* swallow sign-out errors */
          }
          setDenyReason(
            "This is an admin account. Admin accounts cannot access the customer dashboard. Please sign in with a customer account, or register a new customer account."
          );
          setState("denied");
          return;
        }

        let role = String(userRec?.role ?? "customer");
        if (!userRec || !isUserRole(role)) {
          role = "customer";
        }

        const fallback = {
          firstName: user.displayName?.trim().split(/\s+/)[0] ?? "",
          lastName:
            user.displayName?.trim().split(/\s+/).slice(1).join(" ") ?? "",
          username: user.email?.split("@")[0] ?? user.uid,
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
          phone: "",
          country: "",
          gender: "",
        };

        const profile = userRec
          ? mapCustomerProfile(user.uid, userSnap.data(), fallback)
          : mapCustomerProfile(user.uid, undefined, { ...fallback, role });

        if (!userSnap.exists()) {
          try {
            const { setDoc } = await import("firebase/firestore");
            await setDoc(userRef, {
              ...profile,
              wishlist: [],
              cart: [],
              addresses: [],
              orders: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } catch (err) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(
                "[UserAuthGuard] Could not create customer profile doc:",
                err
              );
            }
          }
        }

        setProfile(profile);

        if (!cancelled) {
          setState("authorized");
        }
      } catch (err) {
        console.error("User auth check failed:", err);
        if (cancelled) return;
        clearProfile();
        try {
          await auth.signOut();
        } catch (_) {
          /* swallow */
        }
        setDenyReason(
          "Failed to verify your account. Please sign in and try again."
        );
        setState("denied");
      }
    };

    const unsub = onAuthStateChanged(auth, verifyAndSync);

    return () => {
      cancelled = true;
      unsub();
    };
  }, [clearProfile, setProfile]);

  useEffect(() => {
    if (state !== "denied") return;
    const dest =
      pathname && pathname !== "/dashboard"
        ? `/login?redirect=${encodeURIComponent(pathname)}`
        : "/login";
    const t = setTimeout(() => router.replace(dest), 1500);
    return () => clearTimeout(t);
  }, [state, pathname, router]);

  if (state === "authorized") {
    return <>{children}</>;
  }

  if (state === "denied") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "#050505",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 520 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 5,
              bgcolor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#EF4444",
            }}
          >
            <ShieldAlert size={38} />
          </Box>
          <Typography
            sx={{
              fontFamily: "Bebas Neue, cursive",
              fontSize: "2.25rem",
              letterSpacing: "0.14em",
              color: "#fff",
              textAlign: "center",
            }}
          >
            ACCESS DENIED
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#A0A0A0",
              textAlign: "center",
              lineHeight: 1.75,
            }}
          >
            {denyReason}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "Inter, sans-serif",
              color: "rgba(160,160,160,0.6)",
              letterSpacing: "0.04em",
            }}
          >
            Redirecting to the customer sign-in page...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <CircularProgress
          size={56}
          thickness={4}
          sx={{ color: "#39FF14" }}
        />
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            color: "#A0A0A0",
            letterSpacing: "0.04em",
          }}
        >
          Verifying your account...
        </Typography>
      </Stack>
    </Box>
  );
}
