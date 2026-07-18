"use client";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { CustomerOrder } from "@/types/order";
import StatusBadge from "./StatusBadge";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function OrdersTable({ orders }: { orders: CustomerOrder[] }) {
  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                borderBottom: "1px solid rgba(57,255,20,0.08)",
                color: "#A0A0A0",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "0.78rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              },
            }}
          >
            <TableCell>Product</TableCell>
            <TableCell>Order Number</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => {
            const firstItem = order.items[0];
            const safeStatus = order.status === "All Orders" ? "Processing" : order.status;

            return (
              <TableRow
                key={order.id}
                component={motion.tr}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.05 }}
                sx={{
                  "& td": {
                    borderBottom: "1px solid rgba(57,255,20,0.06)",
                    py: 2.25,
                  },
                  "&:hover": {
                    bgcolor: "rgba(57,255,20,0.02)",
                  },
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        position: "relative",
                        width: 60,
                        height: 60,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid rgba(57,255,20,0.08)",
                      }}
                    >
                      <Image
                        src={firstItem?.image || "/images/lamahhlogo.png"}
                        alt={firstItem?.name || order.orderId}
                        fill
                        sizes="60px"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#FFFFFF",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {firstItem?.name || "Lamah Order"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    #{order.orderId}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
                  {order.items.length}
                </TableCell>
                <TableCell sx={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                  {currencyFormatter.format(order.total)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={safeStatus} />
                </TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    href={`/dashboard/track-order?orderId=${order.orderId}`}
                    variant="outlined"
                    endIcon={<ArrowRight size={16} />}
                    sx={{
                      borderRadius: 2.5,
                      color: "#FFFFFF",
                      borderColor: "rgba(57,255,20,0.2)",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                      px: 2.25,
                      "&:hover": {
                        borderColor: "#39FF14",
                        bgcolor: "rgba(57,255,20,0.06)",
                        boxShadow: "0 0 24px rgba(57,255,20,0.12)",
                      },
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
