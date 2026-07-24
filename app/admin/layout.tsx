"use client";

import { ThemeProvider } from "@mui/material/styles";
import lamahTheme from "@/lib/theme";
import { CssBaseline } from "@mui/material";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={lamahTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
