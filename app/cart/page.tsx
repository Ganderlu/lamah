
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
  Chip,
} from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { Minus, Plus, Trash2, Loader2, Lock, AlertTriangle, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import type { AuthUserProfile } from "@/lib/store/auth";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } =
    useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [error, setError] = useState<string>("");

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

  const handleCheckout = async () => {
    setError("");
    if (!user) {
      setError("Please sign in before checking out.");
      router.push(`/login?next=${encodeURIComponent("/cart")}`);
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("Your session has expired. Please sign in again.");
        setIsLoading(false);
        router.push(`/login?next=${encodeURIComponent("/cart")}`);
        return;
      }

      let idToken: string | undefined;
      try {
        idToken = await currentUser.getIdToken(true);
      } catch (tokenErr) {
        console.error("[checkout] Failed to refresh ID token", tokenErr);
      }
      if (!idToken) {
        setError("Your session has expired. Please sign in again.");
        setIsLoading(false);
        router.push(`/login?next=${encodeURIComponent("/cart")}`);
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          cartItems: items,
          customerName: profile ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || user.email : user.email,
          customerEmail: profile?.email || user.email || "",
          customerPhone: profile?.phone || "",
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let parsedError = "Could not start checkout. Please try again.";
        try {
          const parsed = JSON.parse(errText);
          parsedError = parsed.error || parsedError;
        } catch {
          /* ignore */
        }

        if (response.status === 401) {
          const stillLoggedIn = !!auth.currentUser;
          if (stillLoggedIn) {
            setError(
              parsedError +
                " If this continues, please sign out then sign in again."
            );
          } else {
            router.push(`/login?next=${encodeURIComponent("/cart")}`);
          }
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

      // Schedule cart clear AS SOON AS the page begins unloading (navigation to
      // Stripe has started). If the user clicks Back before the page actually
      // unloads (or cancels via Stripe's UI and the tab survives), the cart
      // stays populated for a retry.
      const clearOnLeave = () => {
        try {
          void clearCart();
        } catch (clearErr) {
          console.warn("[checkout] beforeunload clearCart failed", clearErr);
        }
      };
      window.addEventListener("beforeunload", clearOnLeave, { once: true, passive: true });

      // Synchronous navigate first via location.assign (preferred) then href.
      // We also schedule a fallback clear after a short delay, in case the
      // browser suppresses beforeunload for cross-site navigations.
      const fallbackClearTimer = window.setTimeout(() => {
        clearOnLeave();
      }, 1200);

      try {
        window.location.assign(url);
      } catch (navErr) {
        window.clearTimeout(fallbackClearTimer);
        window.removeEventListener("beforeunload", clearOnLeave);
        console.warn("[checkout] window.location.assign failed; falling back to href", navErr);
        try {
          window.location.href = url;
        } catch (hrefErr) {
          console.error("[checkout] href navigation failed too", hrefErr);
          window.clearTimeout(fallbackClearTimer);
          window.removeEventListener("beforeunload", clearOnLeave);
          throw new Error("Could not navigate to Stripe checkout. Please try again.");
        }
      }
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(err?.message || "Failed to start checkout. Please try again.");
      setIsLoading(false);
    }
  };

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
                        disabled={isLoading || !authLoaded || !user}
                        onClick={handleCheckout}
                        startIcon={
                          !isLoading ? <Lock size={16} /> : null
                        }
                        sx={{
                          bgcolor: "#39FF14",
                          color: "#000",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          py: 2,
                          fontSize: "1rem",
                          textTransform: "uppercase",
                          "&:hover": { bgcolor: "#2dd610" },
                          "&:disabled": {
                            bgcolor: "rgba(57,255,20,0.25)",
                            color: "#050505",
                            opacity: 0.8,
                          },
                        }}
                      >
                        {isLoading ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                            <span>Processing...</span>
                          </Box>
                        ) : !authLoaded ? (
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
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
