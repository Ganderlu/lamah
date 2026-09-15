"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OrderCard from "@/components/dashboard/orders/OrderCard";
import OrdersEmptyState from "@/components/dashboard/orders/OrdersEmptyState";
import OrdersLoadingSkeleton from "@/components/dashboard/orders/OrdersLoadingSkeleton";
import OrdersPagination from "@/components/dashboard/orders/OrdersPagination";
import OrdersTable from "@/components/dashboard/orders/OrdersTable";
import { auth, db } from "@/firebase/client";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import type {
  CustomerOrder,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/types/order";

const PAGE_SIZE = 5;

const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

export default function OrdersPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle Stripe checkout success → redirects here with ?checkout_success=true&order=LAMAH-XXXXXX
  const clearCart = useCartStore((state) => state.clearCart);
  useEffect(() => {
    const checkoutSuccess = searchParams?.get("checkout_success");
    const orderParam = searchParams?.get("order");
    if (checkoutSuccess === "true") {
      const orderText = orderParam
        ? ` Order ${orderParam} has been placed successfully.`
        : "";
      setSnackbar({
        open: true,
        message: `Payment complete!${orderText} Your order is now being processed.`,
        severity: "success",
      });
      // Clear the customer's cart on confirmed successful payment landing.
      // This is the authoritative clear (handleCheckout only schedules a
      // best-effort clear when the tab actually unloads, so clicking Back
      // from Stripe or cancelling mid-flow preserves cart contents).
      try {
        void clearCart();
      } catch (err) {
        console.warn("[orders] clearCart after checkout success failed", err);
      }
    }
  }, [searchParams, clearCart]);

  // Auth required — redirect to /login if not signed in.
  // Uses onSnapshot (realtime) so orders appear as soon as the payment
  // webhook (Stripe / PayPal) writes the order document — no race condition
  // between the payment-provider success redirect and server-side fulfillment.
  useEffect(() => {
    let firestoreUnsub: (() => void) | null = null;

    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (firestoreUnsub) {
        firestoreUnsub();
        firestoreUnsub = null;
      }

      if (!user) {
        setOrders([]);
        setLoading(false);
        const next = encodeURIComponent("/dashboard/orders");
        router.replace(`/login?next=${next}`);
        return;
      }

      setLoading(true);

      const ordersQuery = query(
        collection(db, "orders"),
        where("customerId", "==", user.uid)
      );

      firestoreUnsub = onSnapshot(
        ordersQuery,
        (snapshot) => {
          const nextOrders: CustomerOrder[] = snapshot.docs.map(
            (docSnapshot) => {
              const data = docSnapshot.data();

              const productsOrItems = Array.isArray(data.products)
                ? data.products
                : Array.isArray(data.items)
                ? data.items
                : [];

              const products = productsOrItems.map((item: any) => ({
                id: String(
                  item.id ||
                    item.productId ||
                    `${docSnapshot.id}-${Math
                      .random()
                      .toString(36)
                      .slice(2, 8)}`
                ),
                productId: String(item.productId || item.id || ""),
                name: String(item.name || "Lamah Product"),
                image: String(item.image || "/images/lamahhlogo.png"),
                size: item.size ? String(item.size) : undefined,
                color: item.color ? String(item.color) : undefined,
                quantity: Number(item.quantity || 1),
                price: Number(item.price || 0),
              }));

              return {
                id: docSnapshot.id,
                orderNumber:
                  data.orderNumber || data.orderId || `#LMH-${Date.now()}`,
                customerId: data.customerId || data.userId || user.uid,
                customerName:
                  data.customerName || user.displayName || "Customer",
                customerEmail: data.customerEmail || user.email || "",
                customerPhone: data.customerPhone || "",
                customerAvatar: data.customerAvatar || user.photoURL || "",
                products,
                subtotal: Number(data.subtotal || 0),
                shippingFee: Number(data.shippingFee || 0),
                discount: Number(data.discount || 0),
                tax: Number(data.tax || 0),
                total: Number(data.total || 0),
                paymentMethod:
                  (data.paymentMethod as PaymentMethod) || "Stripe",
                paymentStatus:
                  (data.paymentStatus as PaymentStatus) || "Pending",
                transactionId: data.transactionId || "",
                deliveryStatus: (data.deliveryStatus ||
                  data.shippingStatus ||
                  data.status ||
                  "Pending") as OrderStatus,
                trackingNumber: data.trackingNumber || "",
                courier: data.courier || "",
                estimatedDelivery: data.estimatedDelivery
                  ? toISOString(data.estimatedDelivery)
                  : "",
                shippingAddress: data.shippingAddress || {
                  street: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "",
                },
                billingAddress: data.billingAddress || {
                  street: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "",
                },
                status: (data.status ||
                  data.deliveryStatus ||
                  data.shippingStatus ||
                  "Pending") as OrderStatus,
                adminNotes: data.adminNotes || [],
                timeline: data.timeline || [],
                createdAt: toISOString(data.createdAt),
                updatedAt: toISOString(data.updatedAt),
              };
            }
          );

          nextOrders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setOrders(nextOrders);
          setLoading(false);
        },
        (error: any) => {
          console.error("[orders] onSnapshot error:", error);
          setSnackbar({
            open: true,
            message: error?.message || "Failed to load your orders.",
            severity: "error",
          });
          setLoading(false);
        }
      );
    });

    return () => {
      if (firestoreUnsub) firestoreUnsub();
      authUnsub();
    };
  }, [router]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const checkoutSuccess = searchParams?.get("checkout_success");
  const orderParam = searchParams?.get("order");

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {checkoutSuccess === "true" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              sx={{
                mb: 5,
                borderRadius: 4,
                bgcolor: "rgba(57,255,20,0.05)",
                border: "1px solid rgba(57,255,20,0.35)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.25), 0 0 30px rgba(57,255,20,0.08)",
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 3, md: 4.5 },
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(57,255,20,0.12)",
                    color: "#39FF14",
                    flexShrink: 0,
                    boxShadow: "0 0 24px rgba(57,255,20,0.25)",
                  }}
                >
                  <CheckCircle2 size={28} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      color: "#fff",
                      fontSize: { xs: "1.75rem", md: "2.5rem" },
                      letterSpacing: "0.12em",
                      mb: 0.75,
                    }}
                  >
                    PAYMENT CONFIRMED
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    useFlexGap
                    alignItems={{ sm: "center" }}
                    sx={{ mb: 2 }}
                  >
                    {orderParam && (
                      <Chip
                        label={`Order ${orderParam}`}
                        sx={{
                          bgcolor: "rgba(57,255,20,0.1)",
                          color: "#39FF14",
                          border: "1px solid rgba(57,255,20,0.25)",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          borderRadius: 999,
                          alignSelf: "flex-start",
                        }}
                      />
                    )}
                    <Chip
                      label="Payment Received"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.05)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        borderRadius: 999,
                        alignSelf: "flex-start",
                      }}
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "#A0A0A0",
                      lineHeight: 1.7,
                    }}
                  >
                    Thanks for your order! We received your payment successfully.
                    You can track the full status, timeline, and delivery details
                    for this order and every order below. A confirmation has also
                    been saved to your account.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#FFFFFF",
              fontFamily: "Bebas Neue, cursive",
              letterSpacing: "0.04em",
              mb: 1,
            }}
          >
            My Orders
          </Typography>
          <Typography
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            View and manage all your orders in one place.
          </Typography>
        </Box>

        <Card
          sx={{
            bgcolor: "#111111",
            borderRadius: 4,
            border: "1px solid rgba(57,255,20,0.12)",
            boxShadow: "0 22px 48px rgba(0,0,0,0.24)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3.5 } }}>
            {loading ? (
              <OrdersLoadingSkeleton />
            ) : orders.length === 0 ? (
              <OrdersEmptyState />
            ) : isMobile ? (
              <Box sx={{ display: "grid", gap: 2 }}>
                {paginatedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </Box>
            ) : (
              <OrdersTable orders={paginatedOrders} />
            )}

            {!loading && orders.length > 0 && (
              <OrdersPagination
                page={page}
                count={totalPages}
                onChange={(_, value) => setPage(value)}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{
            width: "100%",
            borderRadius: "14px",
            fontFamily: "Poppins, sans-serif",
          }}
          iconMapping={{
            success: (
              <CheckCircle2 size={20} style={{ color: "#39FF14" }} />
            ),
            error: null,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
