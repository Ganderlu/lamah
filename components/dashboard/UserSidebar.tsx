"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import {
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  Bell,
  Gift,
  Headphones,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Truck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { auth } from "@/firebase/client";
import { signOut } from "firebase/auth";

const menuItems = [
  { name: "My Orders", icon: ShoppingBag, href: "/dashboard/orders" },
  { name: "Track Order", icon: Truck, href: "/dashboard/track-order" },
  { name: "Wishlist", icon: Heart, href: "/wishlist" },
  { name: "My Addresses", icon: MapPin, href: "/dashboard/addresses" },
  { name: "Payment Methods", icon: CreditCard, href: "/dashboard/payment-methods" },
  { name: "Account Settings", icon: Settings, href: "/dashboard/account-settings" },
  { name: "Logout", icon: LogOut, href: "/" },
];

export default function UserSidebar({
  isSidebarOpen,
  toggleSidebar,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const pathname = usePathname();
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const clearProfile = useAuthStore((state) => state.clearProfile);
  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    auth.currentUser?.displayName ||
    "Patrick";
  const membershipLevel = profile?.membershipLevel || "Silver Member";
  const avatarUrl = profile?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearProfile();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        bgcolor: "#090909",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(57,255,20,0.1)",
      }}
    >
      {/* Logo Section */}
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(57,255,20,0.1)" }}>
        <Link href="/" passHref>
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Image
              src="/images/lamahhlogo.png"
              alt="Lamah Clothing Co."
              width={120}
              height={48}
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
        </Link>
      </Box>

      {/* User Profile */}
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(57,255,20,0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={avatarUrl}
            sx={{
              width: 48,
              height: 48,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {displayName}
              </Typography>
              <CheckCircle2 size={14} color="#39FF14" />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: "#9E9E9E",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {membershipLevel}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 2, px: 2, overflowY: "auto" }}>
        {menuItems.map((item, index) => {
          const isActive =
            item.href === "/"
              ? false
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isLogout = item.name === "Logout";

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={isLogout ? undefined : Link}
                  href={isLogout ? undefined : item.href}
                  onClick={() => {
                    if (isLogout) {
                      handleLogout();
                    } else if (isMobile) {
                      toggleSidebar();
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    ...(isActive && {
                      bgcolor: "#39FF14",
                      boxShadow: "0 0 30px rgba(57,255,20,0.3)",
                      "&:hover": {
                        bgcolor: "#2dd610",
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#000" : "#fff",
                      minWidth: 40,
                    }}
                  >
                    <item.icon size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: isActive ? "#000" : "#fff",
                        fontWeight: isActive ? 700 : 500,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      {/* Footer for Sidebar */}
      <Box sx={{ p: 3, borderTop: "1px solid rgba(57,255,20,0.1)" }}>
        <Box
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(57,255,20,0.12)",
            bgcolor: "#111111",
            p: 2.5,
            boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              mb: 0.75,
            }}
          >
            Need Help?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Our support team is here to help you anytime.
          </Typography>
          <Button
            component={Link}
            href="/contact"
            fullWidth
            endIcon={<ArrowRight size={16} />}
            sx={{
              borderRadius: 2.5,
              border: "1px solid rgba(57,255,20,0.3)",
              color: "#39FF14",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              py: 1.2,
              textTransform: "none",
              bgcolor: "rgba(57,255,20,0.04)",
              "&:hover": {
                borderColor: "#39FF14",
                bgcolor: "rgba(57,255,20,0.1)",
                boxShadow: "0 0 24px rgba(57,255,20,0.16)",
              },
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 9999,
            bgcolor: "#090909",
            color: "#fff",
            border: "1px solid rgba(57,255,20,0.1)",
            "&:hover": {
              bgcolor: "#111111",
            },
          }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </IconButton>
      )}

      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: 280,
          flexShrink: 0,
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
