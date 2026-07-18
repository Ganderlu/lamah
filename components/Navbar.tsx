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
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{ width: 280, bgcolor: "#050505", height: "100%" }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
          <X />
        </IconButton>
      </Box>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.name} disablePadding>
            <ListItemButton
              component={Link}
              href={link.href}
              sx={{ color: "#fff", py: 2 }}
            >
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#050505",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          transition: "all 0.3s ease",
          border: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/" passHref>
              <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", borderRadius: "50%", overflow: "hidden" }}>
                <Image
                  src="/images/lamahhlogo.png"
                  alt="Lamah Clothing Co."
                  width={80}
                  height={80}
                  style={{
                    objectFit: "cover",
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
            <IconButton sx={{ color: "#fff" }} aria-label="account">
              <User size={20} />
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
