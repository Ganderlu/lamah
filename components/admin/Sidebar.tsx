
"use client";

import { useState } from "react";
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
} from "@mui/material";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Boxes,
  Users,
  TicketPercent,
  Star,
  BarChart3,
  Megaphone,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Categories", icon: Layers, href: "/admin/categories" },
  { name: "Inventory", icon: Boxes, href: "/admin/inventory" },
  { name: "Collections", icon: Star, href: "/admin/collections" },
  { name: "Customers", icon: Users, href: "/admin/customers" },
  { name: "Coupons", icon: TicketPercent, href: "/admin/coupons" },
  { name: "Reviews", icon: Star, href: "/admin/reviews" },
  { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { name: "Marketing", icon: Megaphone, href: "/admin/marketing" },
  { name: "Staff Management", icon: Shield, href: "/admin/staff" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
  { name: "Logout", icon: LogOut, href: "/" },
];

export default function AdminSidebar({
  isSidebarOpen,
  toggleSidebar,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const pathname = usePathname();

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
        <Typography
          variant="caption"
          sx={{
            fontFamily: "Bebas Neue, cursive",
            color: "#39FF14",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            ml: 1,
          }}
        >
          Clothing Co.
        </Typography>
      </Box>

      {/* Admin Profile */}
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(57,255,20,0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#39FF14",
              color: "#000",
              fontWeight: 700,
              fontSize: "1.25rem",
            }}
          >
            A
          </Avatar>
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
                Admin
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
              Super Admin
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 2, px: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => isMobile && toggleSidebar()}
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
        <Link href="/" passHref>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              py: 2,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(57,255,20,0.05)",
              },
            }}
          >
            <Image
              src="/images/lamahwhiteb.png"
              alt="The Lamah Movement"
              width={180}
              height={180}
              style={{
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#9E9E9E",
                fontFamily: "Poppins, sans-serif",
                textAlign: "center",
              }}
            >
              Designed to inspire.
            </Typography>
          </Box>
        </Link>
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
