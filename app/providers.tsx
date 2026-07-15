"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/lib/createEmotionCache";
import lamahTheme from "@/lib/theme";

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // prevent hydration mismatch
  }

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={lamahTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
