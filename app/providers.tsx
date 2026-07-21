"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/lib/createEmotionCache";
import lamahTheme from "@/lib/theme";
import { auth, db } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore, type AuthUserProfile } from "@/lib/store/auth";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

const clientSideEmotionCache = createEmotionCache();

const mapProfile = (uid: string, data: Record<string, unknown>): AuthUserProfile => ({
  uid,
  firstName: String(data.firstName ?? ""),
  lastName: String(data.lastName ?? ""),
  username: String(data.username ?? ""),
  email: String(data.email ?? ""),
  phone: String(data.phone ?? ""),
  country: String(data.country ?? ""),
  gender: String(data.gender ?? ""),
  photoURL: String(data.photoURL ?? ""),
  role: String(data.role ?? "customer"),
  status: String(data.status ?? "active"),
  rewardPoints: Number(data.rewardPoints ?? 0),
  membershipLevel: String(data.membershipLevel ?? "Silver Member"),
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const setProfile = useAuthStore((state) => state.setProfile);
  const clearProfile = useAuthStore((state) => state.clearProfile);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const initializeWishlist = useWishlistStore((state) => state.initializeWishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const profile = mapProfile(user.uid, userDoc.data());
            setProfile(profile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        clearProfile();
      }
    });

    return () => unsubscribe();
  }, [mounted, setProfile, clearProfile]);

  // Initialize all stores on mount
  useEffect(() => {
    if (mounted) {
      initializeCart();
      initializeWishlist();
    }
  }, [mounted, initializeCart, initializeWishlist]);

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
