"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OrderCard from "@/components/dashboard/orders/OrderCard";
import OrdersEmptyState from "@/components/dashboard/orders/OrdersEmptyState";
import OrdersLoadingSkeleton from "@/components/dashboard/orders/OrdersLoadingSkeleton";
import OrdersPagination from "@/components/dashboard/orders/OrdersPagination";
import OrdersTable from "@/components/dashboard/orders/OrdersTable";
import { auth, db } from "@/firebase/client";
import type { CustomerOrder, OrderStatus, PaymentStatus, PaymentMethod } from "@/types/order";

const PAGE_SIZE = 5;

// Helper to safely convert timestamps
const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
};

export default function OrdersPage() {
  const theme = useTheme();
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("customerId", "==", user.uid)
        );
        const snapshot = await getDocs(ordersQuery);

        const nextOrders: CustomerOrder[] = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          
          // Handle both `products` and `items` field names for backward compatibility
          const productsOrItems = Array.isArray(data.products) 
            ? data.products 
            : (Array.isArray(data.items) ? data.items : []);
          
          const products = productsOrItems.map((item: any) => ({
            id: String(item.id || item.productId || `${docSnapshot.id}-${Math.random()}`),
            productId: String(item.productId || item.id || ""),
            name: String(item.name || "Lamah Product"),
            image: String(item.image || "/images/lamahhlogo.png"),
            size: item.size || "",
            color: item.color || "",
            quantity: Number(item.quantity || 1),
            price: Number(item.price || 0),
          }));

          return {
            id: docSnapshot.id,
            orderNumber: data.orderNumber || data.orderId || `#LMH-${Date.now()}`,
            customerId: data.customerId || data.userId || user.uid,
            customerName: data.customerName || user.displayName || "Customer",
            customerEmail: data.customerEmail || user.email || "",
            customerPhone: data.customerPhone || "",
            customerAvatar: data.customerAvatar || user.photoURL || "",
            products: products,
            subtotal: data.subtotal || 0,
            shippingFee: data.shippingFee || 0,
            discount: data.discount || 0,
            tax: data.tax || 0,
            total: data.total || 0,
            paymentMethod: (data.paymentMethod as PaymentMethod) || "card",
            paymentStatus: (data.paymentStatus as PaymentStatus) || "Pending",
            transactionId: data.transactionId || "",
            deliveryStatus: (data.deliveryStatus || data.shippingStatus || data.status || "Pending") as OrderStatus,
            trackingNumber: data.trackingNumber || "",
            courier: data.courier || "",
            estimatedDelivery: data.estimatedDelivery ? toISOString(data.estimatedDelivery) : "",
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
            status: (data.status || data.deliveryStatus || data.shippingStatus || "Pending") as OrderStatus,
            adminNotes: data.adminNotes || [],
            timeline: data.timeline || [],
            createdAt: toISOString(data.createdAt),
            updatedAt: toISOString(data.updatedAt),
          };
        });

        nextOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(nextOrders);
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.message || "Failed to load your orders.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
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
        autoHideDuration={5000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
