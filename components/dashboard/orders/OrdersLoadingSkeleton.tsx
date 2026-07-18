"use client";

import { Box, Skeleton, Stack } from "@mui/material";

export default function OrdersLoadingSkeleton() {
  return (
    <Stack spacing={2}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 0.7fr 1fr 1fr 1fr" },
            gap: 2,
            alignItems: "center",
            p: 2,
            borderRadius: 3,
            border: "1px solid rgba(57,255,20,0.08)",
            bgcolor: "rgba(255,255,255,0.01)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton
              variant="rounded"
              width={64}
              height={64}
              sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
              <Skeleton width="40%" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
            </Box>
          </Box>
          <Skeleton width="70%" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
          <Skeleton width="40%" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
          <Skeleton width="50%" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
          <Skeleton
            variant="rounded"
            width={100}
            height={30}
            sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: 99 }}
          />
          <Skeleton
            variant="rounded"
            width={118}
            height={40}
            sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2 }}
          />
        </Box>
      ))}
    </Stack>
  );
}
