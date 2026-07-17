
"use client";

import { Box, Typography, Chip } from "@mui/material";

const systemStatuses = [
  { label: "System", status: "Operational", color: "#39FF14" },
  { label: "Database", status: "Connected", color: "#39FF14" },
  { label: "Cloudinary", status: "Active", color: "#39FF14" },
  { label: "Firebase", status: "Healthy", color: "#39FF14" },
];

export default function AdminFooter() {
  return (
    <Box
      sx={{
        mt: 6,
        py: 4,
        px: { xs: 2, lg: 4 },
        borderTop: "1px solid rgba(57,255,20,0.1)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 3,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "#9E9E9E",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        © 2024 Lamah Clothing Co. Dashboard v1.0.0
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {systemStatuses.map((item) => (
          <Chip
            key={item.label}
            label={`${item.label}: ${item.status}`}
            size="small"
            sx={{
              bgcolor: "rgba(57,255,20,0.1)",
              color: item.color,
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
