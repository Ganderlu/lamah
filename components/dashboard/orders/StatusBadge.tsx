"use client";

import { Chip } from "@mui/material";
import type { OrderStatus } from "@/types/order";

const statusStyles: Record<
  Exclude<OrderStatus, "All Orders">,
  { color: string; background: string; border: string }
> = {
  Delivered: {
    color: "#39FF14",
    background: "rgba(57,255,20,0.1)",
    border: "rgba(57,255,20,0.22)",
  },
  Processing: {
    color: "#F5A623",
    background: "rgba(245,166,35,0.12)",
    border: "rgba(245,166,35,0.22)",
  },
  Shipped: {
    color: "#3B82F6",
    background: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.24)",
  },
  Cancelled: {
    color: "#EF4444",
    background: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.22)",
  },
  Returned: {
    color: "#9CA3AF",
    background: "rgba(156,163,175,0.12)",
    border: "rgba(156,163,175,0.2)",
  },
};

export default function StatusBadge({ status }: { status: Exclude<OrderStatus, "All Orders"> }) {
  const style = statusStyles[status];

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
        borderRadius: "999px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        letterSpacing: "0.01em",
        height: 30,
      }}
    />
  );
}
