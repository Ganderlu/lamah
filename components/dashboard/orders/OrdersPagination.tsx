"use client";

import { Pagination, Stack } from "@mui/material";

interface OrdersPaginationProps {
  page: number;
  count: number;
  onChange: (_event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function OrdersPagination({
  page,
  count,
  onChange,
}: OrdersPaginationProps) {
  return (
    <Stack alignItems="center" sx={{ mt: 4 }}>
      <Pagination
        page={page}
        count={count}
        onChange={onChange}
        shape="rounded"
        siblingCount={0}
        boundaryCount={1}
        showFirstButton={false}
        showLastButton={false}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#A0A0A0",
            border: "1px solid rgba(57,255,20,0.12)",
            bgcolor: "#111111",
            fontFamily: "Inter, sans-serif",
            borderRadius: 2.5,
          },
          "& .Mui-selected": {
            color: "#050505",
            bgcolor: "#39FF14 !important",
            boxShadow: "0 0 22px rgba(57,255,20,0.18)",
          },
        }}
      />
    </Stack>
  );
}
