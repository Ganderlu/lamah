"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { adminAuth, db } from "@/firebase/client";
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

interface AdminRecord {
  role?: unknown;
  status?: unknown;
}

const isAdminRole = (role: unknown): boolean =>
  typeof role === "string" && ADMIN_ROLES.has(role);

const isStatusActive = (status: unknown): boolean =>
  status === undefined ||
  status === "active" ||
  (typeof status === "string" && status.toLowerCase() === "active");

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<"loading" | "denied" | "authorized">(
    "loading"
  );
  const [denyReason, setDenyReason] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async (user: User | null) => {
      if (!user) {
        if (cancelled) return;
        setDenyReason("Please sign in to access the Admin Portal.");
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

        const hasAdminRecord = adminSnap.exists();

        const adminRole =
          (adminSnap.exists()
            ? (adminSnap.data() as AdminRecord).role
            : undefined) ??
          (userSnap.exists()
            ? (userSnap.data() as AdminRecord).role
            : undefined);

        const adminStatus =
          (adminSnap.exists()
            ? (adminSnap.data() as AdminRecord).status
            : undefined) ??
          (userSnap.exists()
            ? (userSnap.data() as AdminRecord).status
            : undefined);

        const roleOk = isAdminRole(adminRole);
        const statusOk = isStatusActive(adminStatus);

        if (!hasAdminRecord || !roleOk || !statusOk) {
          if (cancelled) return;
          try {
            await adminAuth.signOut();
          } catch (_) {
            /* swallow sign-out errors */
          }
          setDenyReason(
            hasAdminRecord && !statusOk
              ? "This admin account is currently inactive. Please contact a Super Admin for access."
              : "Customer accounts are restricted from the Admin Portal. Please sign in with an admin account that was registered through /admin/register, or use the Manager / Director code to create one."
          );
          setState("denied");
          return;
        }

        if (!cancelled) {
          setState("authorized");
        }
      } catch (err) {
        console.error("Admin auth check failed:", err);
        if (cancelled) return;
        try {
          await adminAuth.signOut();
        } catch (_) {
          /* swallow */
        }
        setDenyReason(
          "Failed to verify your admin account. Please sign in and try again."
        );
        setState("denied");
      }
    };

    const unsub = onAuthStateChanged(adminAuth, verifyAdmin);

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  useEffect(() => {
    if (state !== "denied") return;
    const dest =
      pathname && pathname !== "/admin"
        ? `/admin/login?redirect=${encodeURIComponent(pathname)}`
        : "/admin/login";
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
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 560 }}>
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
            ADMIN ACCESS DENIED
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#A0A0A0",
              textAlign: "center",
              lineHeight: 1.75,
              fontSize: "0.95rem",
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
            Redirecting to the admin sign-in page...
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
          Verifying admin access...
        </Typography>
      </Stack>
    </Box>
  );
}
