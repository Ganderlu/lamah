"use client";

import { useState, useEffect, useCallback } from "react";
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
  Chip,
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
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";
import { auth } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import SearchModal from "@/components/SearchModal";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      unsubscribe();
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: 320,
        bgcolor: "#0A0A0A",
        background:
          "linear-gradient(180deg, #0D0D0D 0%, #060606 100%)",
        height: "100%",
        borderLeft: "1px solid rgba(57, 255, 20, 0.10)",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" passHref>
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Image
              src="/images/lamahhlogo.png"
              alt="Lamah Clothing Co."
              width={130}
              height={52}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Link>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff", p: 1.5 }}>
          <X size={22} />
        </IconButton>
      </Box>

      <Box sx={{ height: 1, bgcolor: "rgba(57, 255, 20, 0.12)", mx: 4 }} />

      <List sx={{ flex: 1, py: 4, px: 3 }}>
        {navLinks.map((link, index) => {
          const active = isActive(link.href);
          return (
            <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                style={{ width: "100%" }}
              >
                <ListItemButton
                  component={Link}
                  href={link.href}
                  sx={{
                    color: active ? "#39FF14" : "#fff",
                    py: 2.2,
                    px: 3,
                    borderRadius: "16px",
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: active ? "rgba(57, 255, 20, 0.08)" : "transparent",
                    border: active ? "1px solid rgba(57, 255, 20, 0.2)" : "1px solid transparent",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: "rgba(57, 255, 20, 0.08)",
                      color: "#39FF14",
                      borderColor: "rgba(57, 255, 20, 0.15)",
                    },
                    "& .MuiListItemText-primary": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "15px",
                      fontWeight: active ? 600 : 500,
                      letterSpacing: "0.01em",
                    },
                  }}
                >
                  <ListItemText primary={link.name} />
                  {active && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 24,
                        bgcolor: "#39FF14",
                        borderRadius: "0 4px 4px 0",
                        boxShadow: "0 0 10px rgba(57, 255, 20, 0.6)",
                      }}
                    />
                  )}
                </ListItemButton>
              </motion.div>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 4, borderTop: "1px solid rgba(57, 255, 20, 0.12)" }}>
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
          <IconButton
            onClick={() => {
              handleDrawerToggle();
              openSearch();
            }}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              p: 1.8,
              "&:hover": {
                color: "#39FF14",
                bgcolor: "rgba(57, 255, 20, 0.06)",
                borderColor: "rgba(57, 255, 20, 0.2)",
              },
              transition: "all 0.25s ease",
            }}
            aria-label="search"
          >
            <Search size={20} />
          </IconButton>
          <Link href="/wishlist" passHref>
            <IconButton
              sx={{
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                p: 1.8,
                "&:hover": {
                  color: "#39FF14",
                  bgcolor: "rgba(57, 255, 20, 0.06)",
                  borderColor: "rgba(57, 255, 20, 0.2)",
                },
                transition: "all 0.25s ease",
              }}
            >
              <Heart size={20} />
            </IconButton>
          </Link>
          <Link href="/cart" passHref>
            <IconButton
              sx={{
                position: "relative",
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                p: 1.8,
                "&:hover": {
                  bgcolor: "rgba(57, 255, 20, 0.06)",
                  borderColor: "rgba(57, 255, 20, 0.2)",
                },
                transition: "all 0.25s ease",
              }}
            >
              <Badge
                badgeContent={totalItems}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#39FF14",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "11px",
                    fontFamily: "Inter, sans-serif",
                  },
                }}
              >
                <ShoppingCart size={20} color="#fff" />
              </Badge>
            </IconButton>
          </Link>
          <Link href={isLoggedIn ? "/dashboard/orders" : "/login"} passHref>
            <IconButton
              sx={{
                color: isLoggedIn ? "#39FF14" : "#fff",
                bgcolor: isLoggedIn ? "rgba(57, 255, 20, 0.08)" : "rgba(255,255,255,0.03)",
                border: isLoggedIn ? "1px solid rgba(57, 255, 20, 0.2)" : "1px solid rgba(255,255,255,0.06)",
                p: 1.8,
                "&:hover": {
                  color: "#39FF14",
                  bgcolor: "rgba(57, 255, 20, 0.06)",
                  borderColor: "rgba(57, 255, 20, 0.2)",
                },
                transition: "all 0.25s ease",
              }}
            >
              <User size={20} />
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
        component={motion.div}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        sx={{
          bgcolor: "#0A0A0A",
          background:
            "linear-gradient(180deg, #0D0D0D 0%, #070707 100%)",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          boxShadow: scrolled
            ? "0 8px 30px rgba(0,0,0,0.75), 0 1px 0 rgba(57,255,20,0.08)"
            : "0 1px 0 rgba(57,255,20,0.08), 0 2px 12px rgba(0,0,0,0.45)",
          transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          border: "none",
          borderBottom: scrolled
            ? "1px solid rgba(57,255,20,0.10)"
            : "1px solid rgba(57,255,20,0.06)",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: { xs: 1.2, md: scrolled ? 0.8 : 1.6 },
            height: { xs: 72, md: scrolled ? 68 : 84 },
            transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            px: { xs: 2, md: 4, lg: 6 },
            maxWidth: 1440,
            mx: "auto",
            width: "100%",
          }}
        >
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link href="/" passHref>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, filter 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    filter: "drop-shadow(0 0 10px rgba(57, 255, 20, 0.25))",
                  },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                >
                  <Image
                    src="/images/lamahhlogo.png"
                    alt="Lamah Clothing Co."
                    width={scrolled ? 130 : 150}
                    height={scrolled ? 52 : 60}
                    style={{
                      objectFit: "contain",
                      transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    priority
                  />
                </motion.div>
              </Box>
            </Link>
          </Box>

          {/* Center: Nav Links (Desktop) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
              px: 1.5,
              py: 0.75,
              borderRadius: "999px",
              bgcolor: "rgba(255,255,255,0.015)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
              border: "1px solid rgba(57,255,20,0.08)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.025), 0 2px 12px rgba(0,0,0,0.35)",
              transition: "all 0.3s ease",
            }}
          >
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + index * 0.07, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    style={{
                      position: "relative",
                      color: active ? "#39FF14" : "#EAEAEA",
                      textDecoration: "none",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: active ? 600 : 500,
                      letterSpacing: "0.01em",
                      padding: "10px 20px",
                      borderRadius: "999px",
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                      background: active
                        ? "linear-gradient(135deg, rgba(57,255,20,0.12) 0%, rgba(57,255,20,0.04) 100%)"
                        : "transparent",
                      border: active
                        ? "1px solid rgba(57,255,20,0.22)"
                        : "1px solid transparent",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#39FF14";
                        e.currentTarget.style.background = "rgba(57,255,20,0.06)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#EAEAEA";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {link.name}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="nav-indicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          style={{
                            position: "absolute",
                            bottom: -2,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 22,
                            height: 3,
                            background: "#39FF14",
                            borderRadius: 999,
                            boxShadow: "0 0 10px rgba(57, 255, 20, 0.6)",
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              );
            })}
          </Box>

          {/* Right: Icons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.5, sm: 1 },
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Chip
                label="⌘K"
                size="small"
                onClick={openSearch}
                sx={{
                  display: { xs: "none", lg: "inline-flex" },
                  mr: 1,
                  bgcolor: "rgba(255,255,255,0.015)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
                  color: "#9E9E9E",
                  border: "1px solid rgba(57,255,20,0.08)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.02), 0 2px 8px rgba(0,0,0,0.35)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  py: 0.4,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    color: "#39FF14",
                    borderColor: "rgba(57, 255, 20, 0.25)",
                    bgcolor: "rgba(57, 255, 20, 0.06)",
                    background:
                      "linear-gradient(180deg, rgba(57,255,20,0.10) 0%, rgba(57,255,20,0.03) 100%)",
                  },
                  "& .MuiChip-label": {
                    px: 1.2,
                  },
                }}
              />
            </motion.div>

            {[
              { Icon: Search, label: "search", onClick: openSearch, href: null },
              { Icon: Heart, label: "wishlist", onClick: null, href: "/wishlist" },
              {
                Icon: ShoppingCart,
                label: "cart",
                onClick: null,
                href: "/cart",
                badge: totalItems,
              },
            ].map(({ Icon, label, onClick, href, badge }, idx) => {
              const content = (
                <IconButton
                  onClick={onClick || undefined}
                  sx={{
                    color: "#EAEAEA",
                    p: { xs: 1.2, md: 1.5 },
                    borderRadius: "14px",
                    bgcolor: "rgba(255,255,255,0.015)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
                    border: "1px solid rgba(57,255,20,0.08)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.02), 0 2px 10px rgba(0,0,0,0.35)",
                    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                    "&:hover": {
                      color: "#39FF14",
                      bgcolor: "rgba(57, 255, 20, 0.08)",
                      background:
                        "linear-gradient(180deg, rgba(57,255,20,0.12) 0%, rgba(57,255,20,0.04) 100%)",
                      borderColor: "rgba(57,255,20,0.25)",
                      boxShadow:
                        "inset 0 1px 0 rgba(57,255,20,0.08), 0 4px 16px rgba(57,255,20,0.10)",
                      transform: "translateY(-1px)",
                    },
                  }}
                  aria-label={label}
                >
                  {badge !== undefined ? (
                    <Badge
                      badgeContent={badge}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "#39FF14",
                          color: "#000",
                          fontWeight: 700,
                          fontSize: "11px",
                          fontFamily: "Inter, sans-serif",
                          minWidth: 18,
                          height: 18,
                          p: 0,
                          boxShadow: "0 0 8px rgba(57, 255, 20, 0.5)",
                        },
                      }}
                    >
                      <Icon size={19} />
                    </Badge>
                  ) : (
                    <Icon size={19} />
                  )}
                </IconButton>
              );

              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.65 + idx * 0.06 }}
                >
                  {href ? <Link href={href}>{content}</Link> : content}
                </motion.div>
              );
            })}

            {/* Account */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.85 }}
            >
              <Link href={isLoggedIn ? "/dashboard/orders" : "/login"}>
                <IconButton
                  sx={{
                    color: isLoggedIn ? "#39FF14" : "#EAEAEA",
                    p: { xs: 1.2, md: 1.5 },
                    borderRadius: "14px",
                    bgcolor: isLoggedIn
                      ? "rgba(57, 255, 20, 0.08)"
                      : "rgba(255,255,255,0.015)",
                    background: isLoggedIn
                      ? "linear-gradient(180deg, rgba(57,255,20,0.12) 0%, rgba(57,255,20,0.04) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
                    border: isLoggedIn
                      ? "1px solid rgba(57, 255, 20, 0.22)"
                      : "1px solid rgba(57,255,20,0.08)",
                    boxShadow: isLoggedIn
                      ? "inset 0 1px 0 rgba(57,255,20,0.08), 0 4px 16px rgba(57,255,20,0.10)"
                      : "inset 0 1px 0 rgba(255,255,255,0.02), 0 2px 10px rgba(0,0,0,0.35)",
                    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                    ml: 0.5,
                    "&:hover": {
                      color: "#39FF14",
                      bgcolor: "rgba(57, 255, 20, 0.08)",
                      background:
                        "linear-gradient(180deg, rgba(57,255,20,0.14) 0%, rgba(57,255,20,0.05) 100%)",
                      borderColor: "rgba(57,255,20,0.3)",
                      boxShadow:
                        "inset 0 1px 0 rgba(57,255,20,0.08), 0 6px 20px rgba(57,255,20,0.14)",
                      transform: "translateY(-1px)",
                    },
                  }}
                  aria-label="account"
                >
                  <User size={19} />
                </IconButton>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.95 }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    ml: { xs: 0.5, sm: 1 },
                    color: "#EAEAEA",
                    p: 1.2,
                    borderRadius: "14px",
                    bgcolor: "rgba(255,255,255,0.015)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
                    border: "1px solid rgba(57,255,20,0.08)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.02), 0 2px 10px rgba(0,0,0,0.35)",
                    "&:hover": {
                      color: "#39FF14",
                      bgcolor: "rgba(57, 255, 20, 0.08)",
                      background:
                        "linear-gradient(180deg, rgba(57,255,20,0.12) 0%, rgba(57,255,20,0.04) 100%)",
                      borderColor: "rgba(57,255,20,0.25)",
                      boxShadow:
                        "inset 0 1px 0 rgba(57,255,20,0.08), 0 4px 16px rgba(57,255,20,0.10)",
                    },
                  }}
                >
                  <MenuIcon size={22} />
                </IconButton>
              </motion.div>
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
              boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDuration: "0.4s",
            },
            "& .MuiBackdrop-root": {
              bgcolor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <SearchModal open={searchOpen} onClose={closeSearch} />
    </>
  );
}
