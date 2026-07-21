"use client";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Badge,
  Chip,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Heart,
  ShoppingCart,
  User,
  Settings,
  LogOut,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { auth } from "@/firebase/client";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function UserTopNavbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const clearProfile = useAuthStore((state) => state.clearProfile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    auth.currentUser?.displayName ||
    "Patrick";
  const membershipLevel = profile?.membershipLevel || "Silver Member";

  // Calculate badge counts
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearProfile();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "rgba(5,5,5,0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(57,255,20,0.1)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1, px: { xs: 2, lg: 4 } }}>
        {/* Left Side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            gap: 1.5,
          }}
        ></Box>

        {/* Right Side - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
          <IconButton 
            sx={{ color: "#fff" }} 
            onClick={() => router.push("/shop")}
          >
            <Search size={20} />
          </IconButton>

          <IconButton 
            sx={{ color: "#fff" }}
            onClick={() => router.push("/wishlist")}
          >
            <Badge badgeContent={wishlistCount > 0 ? wishlistCount : null} color="success">
              <Heart size={20} />
            </Badge>
          </IconButton>

          <IconButton 
            sx={{ color: "#fff" }}
            onClick={() => router.push("/cart")}
          >
            <Badge badgeContent={cartCount > 0 ? cartCount : null} color="primary">
              <ShoppingCart size={20} />
            </Badge>
          </IconButton>

          <Box
            role="button"
            aria-label="Open profile menu"
            onClick={handleMenu}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              cursor: "pointer",
              ml: 0.5,
            }}
          >
            <Avatar
              src={profile?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"}
              sx={{
                width: 42,
                height: 42,
                border: "2px solid #39FF14",
                boxShadow: "0 0 18px rgba(57,255,20,0.18)",
              }}
            />
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      lineHeight: 1.1,
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Chip
                    label={membershipLevel}
                    size="small"
                    sx={{
                      mt: 0.5,
                      bgcolor: "rgba(57,255,20,0.1)",
                      color: "#39FF14",
                      border: "1px solid rgba(57,255,20,0.18)",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      height: 22,
                    }}
                  />
                </Box>
                <ChevronDown size={16} color="#A0A0A0" />
              </Box>
            )}
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              "& .MuiPaper-root": {
                bgcolor: "#111111",
                border: "1px solid rgba(57,255,20,0.1)",
                borderRadius: 2,
              },
            }}
          >
            <MenuItem component={Link} href="/dashboard/orders" onClick={handleClose}>
              <User size={18} style={{ marginRight: 8 }} />
              My Orders
            </MenuItem>
            <MenuItem component={Link} href="/dashboard/settings" onClick={handleClose}>
              <Settings size={18} style={{ marginRight: 8 }} />
              Settings
            </MenuItem>
            <MenuItem 
              onClick={() => {
                handleClose();
                handleLogout();
              }} 
              sx={{ color: "#FF4D4F" }}
            >
              <LogOut size={18} style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
