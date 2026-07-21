"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search,
  User,
  Heart,
  ShoppingCart,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";
import { auth } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Men", href: "/men" },
  { name: "Women", href: "/women" },
  { name: "Collections", href: "/collections" },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        bgcolor: "#090909",
        height: "100%",
        borderLeft: "1px solid rgba(57, 255, 20, 0.15)",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" passHref>
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Image
              src="/images/lamahhlogo.png"
              alt="Lamah Clothing Co."
              width={100}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Link>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
          <X />
        </IconButton>
      </Box>

      <Box sx={{ height: 1, bgcolor: "rgba(57, 255, 20, 0.15)", mx: 3 }} />

      <List sx={{ flex: 1, py: 2, px: 2 }}>
        {navLinks.map((link) => (
          <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              href={link.href}
              sx={{
                color: "#fff",
                py: 2,
                px: 3,
                borderRadius: "18px",
                "&:hover": {
                  bgcolor: "rgba(57, 255, 20, 0.08)",
                  color: "#39FF14",
                },
                "& .MuiListItemText-primary": {
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 500,
                },
              }}
            >
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, borderTop: "1px solid rgba(57, 255, 20, 0.15)" }}>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Link href="/wishlist" passHref>
            <IconButton sx={{ color: "#fff", "&:hover": { color: "#39FF14" } }}>
              <Heart size={22} />
            </IconButton>
          </Link>
          <Link href="/cart" passHref>
            <IconButton sx={{ position: "relative" }}>
              <Badge
                badgeContent={totalItems}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#39FF14",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "11px",
                  },
                }}
              >
                <ShoppingCart size={22} color="#fff" />
              </Badge>
            </IconButton>
          </Link>
          <Link href={isLoggedIn ? "/dashboard/orders" : "/login"} passHref>
            <IconButton sx={{ color: isLoggedIn ? "#39FF14" : "#fff", "&:hover": { color: isLoggedIn ? "#39FF14" : "#39FF14" } }}>
              <User size={22} />
            </IconButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#000000",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          transition: "all 0.3s ease",
          border: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1, bgcolor: "#000000" }}>
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/" passHref>
              <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Image
                  src="/images/lamahhlogo.png"
                  alt="Lamah Clothing Co."
                  width={120}
                  height={48}
                  style={{
                    objectFit: "contain",
                  }}
                  priority
                />
              </Box>
            </Link>
          </Box>

          {/* Center: Nav Links (Desktop) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "color 0.3s",
                }}
              >
                {link.name}
              </Link>
            ))}
          </Box>

          {/* Right: Icons */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <IconButton sx={{ color: "#fff" }} aria-label="search">
              <Search size={20} />
            </IconButton>
            <Link href="/wishlist" passHref>
              <IconButton sx={{ color: "#fff" }} aria-label="wishlist">
                <Heart size={20} />
              </IconButton>
            </Link>
            <Link href="/cart" passHref>
              <IconButton sx={{ color: "#fff" }} aria-label="cart">
                <Badge
                  badgeContent={totalItems}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#39FF14",
                      color: "#000",
                      fontWeight: 700,
                    },
                  }}
                >
                  <ShoppingCart size={20} />
                </Badge>
              </IconButton>
            </Link>
            <Link href={isLoggedIn ? "/dashboard/orders" : "/login"} passHref>
              <IconButton sx={{ color: isLoggedIn ? "#39FF14" : "#fff" }} aria-label="account">
                <User size={20} />
              </IconButton>
            </Link>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon size={24} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
