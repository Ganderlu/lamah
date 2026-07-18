"use client";

import { Box, Button } from "@mui/material";
import type { OrderStatus } from "@/types/order";

interface OrderFilterTabsProps {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  tabs: OrderStatus[];
}

export default function OrderFilterTabs({
  value,
  onChange,
  tabs,
}: OrderFilterTabsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 1, md: 2 },
        overflowX: "auto",
        pb: 0.5,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => {
        const active = tab === value;

        return (
          <Button
            key={tab}
            onClick={() => onChange(tab)}
            sx={{
              color: active ? "#39FF14" : "#A0A0A0",
              borderRadius: 0,
              px: 0.5,
              minWidth: "fit-content",
              pb: 1.5,
              borderBottom: active
                ? "2px solid #39FF14"
                : "2px solid transparent",
              fontFamily: "Poppins, sans-serif",
              fontWeight: active ? 700 : 500,
              textTransform: "none",
              "&:hover": {
                bgcolor: "transparent",
                color: "#FFFFFF",
              },
            }}
          >
            {tab}
          </Button>
        );
      })}
    </Box>
  );
}
