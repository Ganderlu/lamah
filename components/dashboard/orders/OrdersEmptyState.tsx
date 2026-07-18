"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function OrdersEmptyState() {
  return (
    <Box
      sx={{
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(57,255,20,0.08)",
          border: "1px solid rgba(57,255,20,0.15)",
          boxShadow: "0 0 32px rgba(57,255,20,0.08)",
          mb: 3,
        }}
      >
        <ShoppingBag size={36} color="#39FF14" />
      </Box>
      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontFamily: "Bebas Neue, cursive",
          letterSpacing: "0.06em",
          mb: 1,
        }}
      >
        No Orders Yet
      </Typography>
      <Typography
        sx={{
          maxWidth: 420,
          color: "#A0A0A0",
          fontFamily: "Poppins, sans-serif",
          mb: 3,
        }}
      >
        Looks like you haven&apos;t placed any orders.
      </Typography>
      <Button
        component={Link}
        href="/shop"
        variant="contained"
        sx={{
          bgcolor: "#39FF14",
          color: "#050505",
          borderRadius: "14px",
          px: 3,
          py: 1.2,
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": {
            bgcolor: "#31df12",
            boxShadow: "0 0 28px rgba(57,255,20,0.22)",
          },
        }}
      >
        Start Shopping
      </Button>
    </Box>
  );
}
