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
import OrderFilterTabs from "@/components/dashboard/orders/OrderFilterTabs";
import OrdersEmptyState from "@/components/dashboard/orders/OrdersEmptyState";
import OrdersLoadingSkeleton from "@/components/dashboard/orders/OrdersLoadingSkeleton";
import OrdersPagination from "@/components/dashboard/orders/OrdersPagination";
import OrdersTable from "@/components/dashboard/orders/OrdersTable";
import { auth, db } from "@/firebase/client";
import type { CustomerOrder, OrderStatus } from "@/types/order";

const tabs: OrderStatus[] = [
  "All Orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

const PAGE_SIZE = 5;

const toIsoString = (value: unknown) => {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

const normalizeStatus = (value: unknown): Exclude<OrderStatus, "All Orders"> => {
  const rawStatus = String(value ?? "").toLowerCase();

  if (rawStatus.includes("deliver")) return "Delivered";
  if (rawStatus.includes("ship") || rawStatus.includes("transit")) return "Shipped";
  if (rawStatus.includes("cancel")) return "Cancelled";
  if (rawStatus.includes("return")) return "Returned";
  return "Processing";
};

export default function OrdersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<OrderStatus>("All Orders");
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
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(ordersQuery);

        const nextOrders: CustomerOrder[] = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          const items = Array.isArray(data.items) ? data.items : [];

          return {
            id: docSnapshot.id,
            orderId: String(data.orderId ?? docSnapshot.id).replace(/^#/, ""),
            userId: String(data.userId ?? user.uid),
            items: items.map((item: Record<string, unknown>, index: number) => ({
              id: String(item.id ?? `${docSnapshot.id}-${index}`),
              name: String(item.name ?? "Lamah Product"),
              image: String(item.image ?? "/images/lamahhlogo.png"),
              quantity: Number(item.quantity ?? 1),
              price: Number(item.price ?? 0),
            })),
            total: Number(data.total ?? 0),
            status: normalizeStatus(data.status || data.shippingStatus),
            paymentStatus: String(data.paymentStatus ?? "Paid"),
            shippingStatus: String(data.shippingStatus ?? ""),
            createdAt: toIsoString(data.createdAt),
            updatedAt: toIsoString(data.updatedAt),
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

  const filteredOrders = useMemo(() => {
    if (activeTab === "All Orders") return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [activeTab, orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

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
            <Box
              sx={{
                borderBottom: "1px solid rgba(57,255,20,0.08)",
                mb: 3,
              }}
            >
              <OrderFilterTabs
                value={activeTab}
                onChange={setActiveTab}
                tabs={tabs}
              />
            </Box>

            {loading ? (
              <OrdersLoadingSkeleton />
            ) : filteredOrders.length === 0 ? (
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

            {!loading && filteredOrders.length > 0 && (
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
