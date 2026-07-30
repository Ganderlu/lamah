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
  uid: string;
  role?: string;
  status?: string;
}

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<
    "loading" | "denied" | "authorized"
  >("loading");
  const [denyReason, setDenyReason] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async (user: User | null) => {
      if (!user) {
        if (cancelled) return;
        setDenyReason("Please sign in to access the admin dashboard.");
        setState("denied");
        return;
      }

      try {
        const adminRef = doc(db, "admins", user.uid);
        const snap = await getDoc(adminRef);

        if (!snap.exists()) {
          if (cancelled) return;
          setDenyReason(
            "This account is not registered as an admin. Please use an admin account."
          );
          setState("denied");
          return;
        }

        const data = snap.data() as AdminRecord;
        const roleOk = typeof data.role === "string" && ADMIN_ROLES.has(data.role);
        const statusOk =
          data.status === undefined ||
          data.status === "active" ||
          String(data.status).toLowerCase() === "active";

        if (!roleOk || !statusOk) {
          if (cancelled) return;
          setDenyReason(
            "Your admin account is not authorized or is currently inactive."
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
        setDenyReason(
          "Failed to verify admin access. Please sign in and try again."
        );
        setState("denied");
      }
    };

    const unsub = onAuthStateChanged(adminAuth, checkAdmin);

    return () => {
      cancelled = true;
      unsub();
    };
  }, [router]);

  useEffect(() => {
    if (state !== "denied") return;
    const dest = `/admin/login${
      pathname && pathname !== "/admin"
        ? `?redirect=${encodeURIComponent(pathname)}`
        : ""
    }`;
    const t = setTimeout(() => router.replace(dest), 1200);
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
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 460 }}>
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
              fontSize: "2rem",
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
              lineHeight: 1.7,
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
            Redirecting to admin sign in...
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
          Verifying admin credentials...
        </Typography>
      </Stack>
    </Box>
  );
}
