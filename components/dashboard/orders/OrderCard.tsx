"use client";

import { Box, Button, Card, Typography } from "@mui/material";
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

export default function OrderCard({ order }: { order: CustomerOrder }) {
  const firstItem = order.products[0];

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        sx={{
          bgcolor: "#111111",
          borderRadius: 3,
          border: "1px solid rgba(57,255,20,0.12)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Box sx={{ p: 2.25 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box
              sx={{
                position: "relative",
                width: 72,
                height: 72,
                borderRadius: 2.5,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={firstItem?.image || "/images/lamahhlogo.png"}
                alt={firstItem?.name || order.orderNumber}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {firstItem?.name || "Lamah Order"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#A0A0A0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {order.orderNumber}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                Date
              </Typography>
              <Typography sx={{ color: "#FFFFFF", fontFamily: "Poppins, sans-serif" }}>
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                Total
              </Typography>
              <Typography sx={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                {currencyFormatter.format(order.total)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                Items
              </Typography>
              <Typography sx={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
                {order.products.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <StatusBadge status={order.status === "All Orders" ? "Processing" : order.status} />
              </Box>
            </Box>
          </Box>

          <Button
            component={Link}
            href={`/dashboard/track-order?orderId=${order.orderNumber.replace(/^#/, "")}`}
            fullWidth
            endIcon={<ArrowRight size={16} />}
            variant="outlined"
            sx={{
              borderRadius: 2.5,
              color: "#FFFFFF",
              borderColor: "rgba(57,255,20,0.2)",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: "#39FF14",
                bgcolor: "rgba(57,255,20,0.06)",
                boxShadow: "0 0 24px rgba(57,255,20,0.12)",
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}
