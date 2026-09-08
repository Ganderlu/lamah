
"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
  Alert,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Modal,
} from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import {
  Minus,
  Plus,
  Trash2,
  Loader2,
  Lock,
  AlertTriangle,
  LogIn,
  CreditCard,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import type { AuthUserProfile } from "@/lib/store/auth";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

function PaymentSelectionModal({
  open,
  onClose,
  selectedMethod,
  onSelectMethod,
  onConfirm,
  isStripeLoading,
  error,
  paypalClientId,
  createPayPalOrder,
  onApprovePayPal,
  onErrorPayPal,
  onCancelPayPal,
  paypalForceReRender,
}: {
  open: boolean;
  onClose: () => void;
  selectedMethod: "stripe" | "paypal";
  onSelectMethod: (m: "stripe" | "paypal") => void;
  onConfirm: () => void;
  isStripeLoading: boolean;
  error: string;
  paypalClientId: string;
  createPayPalOrder: () => Promise<string>;
  onApprovePayPal: (data: { orderID: string }) => Promise<void>;
  onErrorPayPal: (err: any) => void;
  onCancelPayPal: () => void;
  paypalForceReRender: any[];
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1600,
      }}
      BackdropProps={{
        sx: { bgcolor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ width: "100%", maxWidth: 560, outline: "none" }}
      >
        <Paper
          sx={{
            bgcolor: "#0D0D0D",
            border: "1.5px solid rgba(57,255,20,0.25)",
            borderRadius: "20px",
            boxShadow: "0 25px 80px rgba(57,255,20,0.15)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 4,
              py: 3,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              bgcolor: "rgba(57,255,20,0.03)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(57,255,20,0.12)",
                  color: "#39FF14",
                }}
              >
                <Lock size={20} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: "1.75rem",
                    letterSpacing: "0.12em",
                    color: "#fff",
                  }}
                >
                  SELECT PAYMENT METHOD
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.8rem",
                    color: "#888",
                  }}
                >
                  Choose how you&apos;d like to pay
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: "#A0A0A0",
                "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
                borderRadius: "10px",
                p: 1,
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          <Box sx={{ p: 4 }}>
            <FormControl sx={{ width: "100%" }}>
              <RadioGroup
                value={selectedMethod}
                onChange={(e) => onSelectMethod(e.target.value as "stripe" | "paypal")}
              >
                <Stack spacing={2.5}>
                  <FormControlLabel
                    value="stripe"
                    control={
                      <Radio
                        sx={{
                          color: "rgba(57,255,20,0.4)",
                          "&.Mui-checked": { color: "#39FF14" },
                        }}
                      />
                    }
                    sx={{
                      m: 0,
                      p: 3,
                      border:
                        selectedMethod === "stripe"
                          ? "1.5px solid #39FF14"
                          : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      bgcolor:
                        selectedMethod === "stripe"
                          ? "rgba(57,255,20,0.05)"
                          : "rgba(255,255,255,0.015)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor:
                          selectedMethod === "stripe"
                            ? "#39FF14"
                            : "rgba(57,255,20,0.3)",
                        bgcolor: "rgba(57,255,20,0.03)",
                      },
                    }}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3, flex: 1 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(105, 121, 255, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <CreditCard
                            size={22}
                            style={{ color: "#635BFF" }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: "#fff",
                              mb: 0.25,
                            }}
                          >
                            Credit / Debit Card
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.8rem",
                              color: "#888",
                            }}
                          >
                            Powered by Stripe. Visa, Mastercard, Amex & more.
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Box
                            sx={{
                              width: 30,
                              height: 20,
                              borderRadius: 4,
                              bgcolor: "#1A1F71",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontFamily: "Bebas Neue, cursive",
                              fontSize: "0.65rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            VISA
                          </Box>
                          <Box
                            sx={{
                              width: 30,
                              height: 20,
                              borderRadius: 4,
                              bgcolor:
                                "linear-gradient(135deg, #EB001B 0%, #F79E1B 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontFamily: "Bebas Neue, cursive",
                              fontSize: "0.6rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            MC
                          </Box>
                          <Box
                            sx={{
                              width: 30,
                              height: 20,
                              borderRadius: 4,
                              bgcolor: "#006FCF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontFamily: "Bebas Neue, cursive",
                              fontSize: "0.6rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            AMEX
                          </Box>
                        </Box>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    value="paypal"
                    control={
                      <Radio
                        sx={{
                          color: "rgba(57,255,20,0.4)",
                          "&.Mui-checked": { color: "#39FF14" },
                        }}
                      />
                    }
                    sx={{
                      m: 0,
                      p: 3,
                      border:
                        selectedMethod === "paypal"
                          ? "1.5px solid #39FF14"
                          : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      bgcolor:
                        selectedMethod === "paypal"
                          ? "rgba(57,255,20,0.05)"
                          : "rgba(255,255,255,0.015)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor:
                          selectedMethod === "paypal"
                            ? "#39FF14"
                            : "rgba(57,255,20,0.3)",
                        bgcolor: "rgba(57,255,20,0.03)",
                      },
                    }}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3, flex: 1 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0, 112, 240, 0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontFamily: "Arial, sans-serif",
                              fontWeight: 900,
                              fontSize: "0.95rem",
                              background:
                                "linear-gradient(180deg, #009cde 0%, #003087 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              letterSpacing: "-0.03em",
                            }}
                          >
                            P
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: "#fff",
                              mb: 0.25,
                            }}
                          >
                            PayPal
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.8rem",
                              color: "#888",
                            }}
                          >
                            Pay with your PayPal balance, linked card, or bank.
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 900,
                            fontSize: "1rem",
                            background:
                              "linear-gradient(180deg, #009cde 0%, #003087 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          PayPal
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
              </RadioGroup>
            </FormControl>

            {error && (
              <Alert
                severity="error"
                icon={<AlertTriangle size={18} />}
                sx={{
                  mt: 3,
                  borderRadius: "14px",
                  fontFamily: "Poppins, sans-serif",
                  bgcolor: "rgba(255,71,87,0.06)",
                  color: "#fff",
                  border: "1px solid rgba(255,71,87,0.3)",
                  "& .MuiAlert-icon": { color: "#ff4757" },
                }}
              >
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 4 }}>
              {selectedMethod === "stripe" ? (
                <Button
                  fullWidth
                  variant="contained"
                  disabled={isStripeLoading}
                  onClick={onConfirm}
                  startIcon={!isStripeLoading ? <Lock size={16} /> : null}
                  sx={{
                    bgcolor: "#39FF14",
                    color: "#000",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    py: 2,
                    fontSize: "1rem",
                    borderRadius: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    boxShadow: "0 0 24px rgba(57,255,20,0.25)",
                    "&:hover": {
                      bgcolor: "#32e012",
                      boxShadow: "0 0 34px rgba(57,255,20,0.4)",
                    },
                    "&:disabled": {
                      bgcolor: "rgba(57,255,20,0.25)",
                      color: "#050505",
                    },
                  }}
                >
                  {isStripeLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                      }}
                    >
                      <Loader2
                        size={18}
                        style={{
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <span>Redirecting to Stripe...</span>
                    </Box>
                  ) : (
                    "Pay Securely with Card"
                  )}
                </Button>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: "capture",
                    "enable-funding": "paylater,venmo,card",
                    "disable-funding": "",
                  }}
                >
                  <Box
                    sx={{
                      border: "1px solid rgba(0,112,240,0.25)",
                      borderRadius: "14px",
                      p: 1.5,
                      bgcolor: "rgba(0,112,240,0.03)",
                    }}
                  >
                    <PayPalButtons
                      style={{
                        shape: "rect",
                        color: "gold",
                        layout: "vertical",
                        label: "pay",
                        tagline: false,
                        height: 48,
                      }}
                      createOrder={createPayPalOrder}
                      onApprove={onApprovePayPal}
                      onError={onErrorPayPal}
                      onCancel={onCancelPayPal}
                      forceReRender={paypalForceReRender}
                    />
                  </Box>
                </PayPalScriptProvider>
              )}
            </Box>

            <Box
              sx={{
                mt: 3,
                pt: 2.5,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Lock size={14} style={{ color: "#39FF14" }} />
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  color: "#888",
                }}
              >
                Your payment is secured with 256-bit SSL encryption. We never store your card details.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Modal>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } =
    useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [error, setError] = useState<string>("");

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"stripe" | "paypal">("stripe");
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid, email: currentUser.email ?? null });
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists()) {
            const data = snap.data() as Record<string, unknown>;
            setProfile({
              uid: currentUser.uid,
              firstName: String(data.firstName ?? ""),
              lastName: String(data.lastName ?? ""),
              username: String(data.username ?? ""),
              email: String(data.email ?? currentUser.email ?? ""),
              phone: String(data.phone ?? ""),
              country: String(data.country ?? ""),
              gender: String(data.gender ?? ""),
              photoURL: String(data.photoURL ?? currentUser.photoURL ?? ""),
              role: String(data.role ?? "customer"),
              status: String(data.status ?? "active"),
              rewardPoints: Number(data.rewardPoints ?? 0),
              membershipLevel: String(data.membershipLevel ?? "Silver Member"),
            });
          } else {
            setProfile({
              uid: currentUser.uid,
              firstName: String(currentUser.displayName?.split(" ")[0] ?? ""),
              lastName: String(currentUser.displayName?.split(" ").slice(1).join(" ") ?? ""),
              username: "",
              email: currentUser.email ?? "",
              phone: "",
              country: "",
              gender: "",
              photoURL: currentUser.photoURL ?? "",
              role: "customer",
              status: "active",
              rewardPoints: 0,
              membershipLevel: "Silver Member",
            });
          }
        } catch (err) {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setAuthLoaded(true);
    });
    return () => unsub();
  }, []);

  const openPaymentModal = () => {
    setError("");
    setPaymentError("");
    if (!user) {
      setError("Please sign in before checking out.");
      router.push(`/login?next=${encodeURIComponent("/cart")}`);
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentError("");
    setStripeLoading(false);
  };

  const handleStripeCheckout = async () => {
    setPaymentError("");
    try {
      setStripeLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setPaymentError("Your session has expired. Please sign in again.");
        setStripeLoading(false);
        closePaymentModal();
        router.push(`/login?next=${encodeURIComponent("/cart")}`);
        return;
      }

      let idToken: string | undefined;
      try {
        idToken = await currentUser.getIdToken(true);
      } catch (tokenErr) {
        console.error("[checkout-stripe] Failed to refresh ID token", tokenErr);
      }
      if (!idToken) {
        setPaymentError("Your session has expired. Please sign in again.");
        setStripeLoading(false);
        closePaymentModal();
        router.push(`/login?next=${encodeURIComponent("/cart")}`);
        return;
      }

      const fallbackEmail = currentUser.email || user?.email || "";
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          cartItems: items,
          customerName: profile
            ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
              fallbackEmail
            : fallbackEmail,
          customerEmail: profile?.email || fallbackEmail,
          customerPhone: profile?.phone || "",
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let parsedError = "Could not start Stripe checkout. Please try again.";
        try {
          const parsed = JSON.parse(errText);
          parsedError = parsed.error || parsedError;
        } catch {
          /* ignore */
        }

        if (response.status === 401) {
          const stillLoggedIn = !!auth.currentUser;
          if (stillLoggedIn) {
            setPaymentError(
              parsedError +
                " If this continues, please sign out then sign in again."
            );
          } else {
            closePaymentModal();
            router.push(`/login?next=${encodeURIComponent("/cart")}`);
          }
          setStripeLoading(false);
          return;
        }
        throw new Error(parsedError);
      }

      const { url } = await response.json();
      if (!url || typeof url !== "string") {
        throw new Error("No checkout session URL returned. Please try again.");
      }

      if (typeof window === "undefined") {
        throw new Error("Window not available for navigation.");
      }

      const clearOnLeave = () => {
        try {
          void clearCart();
        } catch (clearErr) {
          console.warn("[checkout-stripe] beforeunload clearCart failed", clearErr);
        }
      };
      window.addEventListener("beforeunload", clearOnLeave, {
        once: true,
        passive: true,
      });

      const fallbackClearTimer = window.setTimeout(() => {
        clearOnLeave();
      }, 1200);

      try {
        window.location.assign(url);
      } catch (navErr) {
        window.clearTimeout(fallbackClearTimer);
        window.removeEventListener("beforeunload", clearOnLeave);
        console.warn(
          "[checkout-stripe] window.location.assign failed; falling back to href",
          navErr
        );
        try {
          window.location.href = url;
        } catch (hrefErr) {
          window.clearTimeout(fallbackClearTimer);
          window.removeEventListener("beforeunload", clearOnLeave);
          console.error("[checkout-stripe] href navigation failed too", hrefErr);
          throw new Error(
            "Could not navigate to Stripe checkout. Please try again."
          );
        }
      }
    } catch (err: any) {
      console.error("Error during Stripe checkout:", err);
      setPaymentError(err?.message || "Failed to start Stripe checkout. Please try again.");
      setStripeLoading(false);
    }
  };

  const createPayPalOrder = async (): Promise<string> => {
    setPaymentError("");
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setPaymentError("Your session has expired. Please sign in again.");
      closePaymentModal();
      router.push(`/login?next=${encodeURIComponent("/cart")}`);
      throw new Error("Not authenticated");
    }

    let idToken: string | undefined;
    try {
      idToken = await currentUser.getIdToken(true);
    } catch (tokenErr) {
      console.error("[paypal-create] Failed to refresh ID token", tokenErr);
    }
    if (!idToken) {
      setPaymentError("Your session has expired. Please sign in again.");
      closePaymentModal();
      router.push(`/login?next=${encodeURIComponent("/cart")}`);
      throw new Error("No ID token");
    }

    const fallbackEmail = currentUser.email || user?.email || "";
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        cartItems: items,
        customerName: profile
          ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
            fallbackEmail
          : fallbackEmail,
        customerEmail: profile?.email || fallbackEmail,
        customerPhone: profile?.phone || "",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedError = "Could not start PayPal checkout. Please try again.";
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.error || parsedError;
      } catch {
        /* ignore */
      }

      if (response.status === 401) {
        closePaymentModal();
        router.push(`/login?next=${encodeURIComponent("/cart")}`);
      }
      setPaymentError(parsedError);
      throw new Error(parsedError);
    }

    const data = await response.json();
    if (!data.orderId) {
      setPaymentError("PayPal did not return an order ID. Please try again.");
      throw new Error("No orderId");
    }
    return data.orderId;
  };

  const onApprovePayPal = async (data: { orderID: string }): Promise<void> => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let parsedError = "Payment could not be confirmed. Please try again.";
        try {
          const parsed = JSON.parse(errText);
          parsedError = parsed.error || parsedError;
        } catch {
          /* ignore */
        }
        setPaymentError(parsedError);
        throw new Error(parsedError);
      }

      const result = await response.json();
      const orderNumber: string = result.orderNumber || "";

      try {
        void clearCart();
      } catch (clearErr) {
        console.warn("[paypal-approve] clearCart failed", clearErr);
      }

      closePaymentModal();

      if (orderNumber) {
        router.push(
          `/dashboard/orders?checkout_success=true&order=${encodeURIComponent(orderNumber)}`
        );
      } else {
        router.push("/dashboard/orders?checkout_success=true");
      }
    } catch (err: any) {
      console.error("PayPal capture error:", err);
      if (!paymentError) {
        setPaymentError(
          err?.message ||
            "There was an error confirming your PayPal payment. Please check your PayPal account for the charge status."
        );
      }
      throw err;
    }
  };

  const onErrorPayPal = useCallback(
    (err: any) => {
      console.error("PayPal buttons error:", err);
      setPaymentError(
        "Something went wrong with PayPal. Please try again or select another payment method."
      );
    },
    []
  );

  const onCancelPayPal = useCallback(() => {
    setPaymentError("");
  }, []);

  const paypalForceReRender = [items.length, getTotalPrice()];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1, py: 12 }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "3rem", md: "5rem" },
                color: "#fff",
                letterSpacing: "0.2em",
                mb: 4,
                textAlign: "center",
              }}
            >
              YOUR CART
            </Typography>

            {authLoaded && !user && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Paper
                  sx={{
                    mb: 6,
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: "20px",
                    border: "1px solid rgba(57,255,20,0.3)",
                    bgcolor: "rgba(57,255,20,0.05)",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(57,255,20,0.12)",
                        color: "#39FF14",
                        flexShrink: 0,
                      }}
                    >
                      <Lock size={22} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          mb: 0.5,
                        }}
                      >
                        Sign in to continue to checkout
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          lineHeight: 1.6,
                        }}
                      >
                        To make sure your orders are saved to your account and visible in My Orders, please sign in or create an account before completing payment.
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width={{ xs: "100%", md: "auto" }}>
                    <Button
                      component={Link}
                      href={`/login?next=${encodeURIComponent("/cart")}`}
                      variant="outlined"
                      startIcon={<LogIn size={16} />}
                      sx={{
                        borderRadius: "999px",
                        py: 1.25,
                        px: 3.5,
                        color: "#fff",
                        borderColor: "rgba(57,255,20,0.4)",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        textTransform: "none",
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": {
                          borderColor: "#39FF14",
                          bgcolor: "rgba(57,255,20,0.06)",
                        },
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={Link}
                      href={`/register?next=${encodeURIComponent("/cart")}`}
                      variant="contained"
                      sx={{
                        borderRadius: "999px",
                        py: 1.25,
                        px: 3.5,
                        bgcolor: "#39FF14",
                        color: "#000",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        textTransform: "none",
                        width: { xs: "100%", sm: "auto" },
                        boxShadow: "0 0 24px rgba(57,255,20,0.3)",
                        "&:hover": {
                          bgcolor: "#32e012",
                          boxShadow: "0 0 34px rgba(57,255,20,0.45)",
                        },
                      }}
                    >
                      Create Account
                    </Button>
                  </Stack>
                </Paper>
              </motion.div>
            )}

            {error && (
              <Alert
                severity="error"
                icon={<AlertTriangle size={18} />}
                sx={{
                  mb: 4,
                  borderRadius: "16px",
                  fontFamily: "Poppins, sans-serif",
                  bgcolor: "rgba(255,71,87,0.06)",
                  color: "#fff",
                  border: "1px solid rgba(255,71,87,0.3)",
                  "& .MuiAlert-icon": { color: "#ff4757" },
                }}
              >
                {error}
              </Alert>
            )}

            {items.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 16,
                  border: "2px solid rgba(57,255,20,0.3)",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(57,255,20,0.05) 0%, rgba(5,5,5,0.95) 100%)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    color: "#39FF14",
                    mb: 4,
                  }}
                >
                  YOUR CART IS EMPTY
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Poppins, sans-serif", color: "#A0A0A0", mb: 6 }}
                >
                  Add some premium streetwear to your collection
                </Typography>
                <Link href="/shop" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#39FF14",
                      color: "#000",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#2dd610" },
                      px: 6,
                      py: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    Shop Now
                  </Button>
                </Link>
              </Box>
            ) : (
              <Grid container spacing={6}>
                <Grid item xs={12} lg={8}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          bgcolor: "#111",
                          p: 3,
                          mb: 3,
                          borderRadius: "16px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          gap: 3,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            position: "relative",
                            borderRadius: "8px",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <Link
                            href={`/product/${item.id}`}
                            style={{ position: "absolute", inset: 0, display: "block" }}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </Link>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Link
                            href={`/product/${item.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Typography
                              variant="h5"
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                color: "#fff",
                                fontWeight: 600,
                                mb: 1,
                                transition: "color 0.2s ease",
                                "&:hover": { color: "#39FF14" },
                              }}
                            >
                              {item.name}
                            </Typography>
                          </Link>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#39FF14",
                              fontWeight: 700,
                              mb: 2,
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              sx={{ color: "#fff" }}
                            >
                              <Minus size={16} />
                            </IconButton>
                            <Typography
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                color: "#fff",
                                minWidth: 24,
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              sx={{ color: "#fff" }}
                            >
                              <Plus size={16} />
                            </IconButton>
                            <IconButton
                              onClick={() => removeItem(item.id)}
                              sx={{ color: "#ff4757", ml: 2 }}
                            >
                              <Trash2 size={20} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                            }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))}
                </Grid>

                <Grid item xs={12} lg={4}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Paper
                      sx={{
                        bgcolor: "#111",
                        p: 4,
                        borderRadius: "16px",
                        border: "2px solid rgba(57,255,20,0.3)",
                        position: "sticky",
                        top: "120px",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          color: "#fff",
                          letterSpacing: "0.1em",
                          mb: 4,
                        }}
                      >
                        ORDER SUMMARY
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography
                            sx={{ fontFamily: "Poppins, sans-serif", color: "#A0A0A0" }}
                          >
                            Subtotal ({getTotalItems()} items)
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            ${getTotalPrice().toFixed(2)}
                          </Typography>
                        </Box>
                        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                      </Box>
                      <Box sx={{ mb: 4 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                            }}
                          >
                            Total
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#39FF14",
                              fontWeight: 700,
                            }}
                          >
                            ${getTotalPrice().toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={!authLoaded || !user}
                        onClick={openPaymentModal}
                        startIcon={<Lock size={16} />}
                        sx={{
                          bgcolor: "#39FF14",
                          color: "#000",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          py: 2,
                          fontSize: "1rem",
                          textTransform: "uppercase",
                          boxShadow: "0 0 28px rgba(57,255,20,0.3)",
                          "&:hover": {
                            bgcolor: "#2dd610",
                            boxShadow: "0 0 42px rgba(57,255,20,0.5)",
                          },
                          "&:disabled": {
                            bgcolor: "rgba(57,255,20,0.25)",
                            color: "#050505",
                            opacity: 0.8,
                            boxShadow: "none",
                          },
                        }}
                      >
                        {!authLoaded ? (
                          "Verifying..."
                        ) : !user ? (
                          "Sign In To Checkout"
                        ) : (
                          "Proceed to Checkout"
                        )}
                      </Button>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            )}

            <PaymentSelectionModal
              open={paymentModalOpen}
              onClose={closePaymentModal}
              selectedMethod={selectedPayment}
              onSelectMethod={setSelectedPayment}
              onConfirm={handleStripeCheckout}
              isStripeLoading={stripeLoading}
              error={paymentError}
              paypalClientId={PAYPAL_CLIENT_ID}
              createPayPalOrder={createPayPalOrder}
              onApprovePayPal={onApprovePayPal}
              onErrorPayPal={onErrorPayPal}
              onCancelPayPal={onCancelPayPal}
              paypalForceReRender={paypalForceReRender}
            />
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
