
"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1, py: 12 }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "3rem", md: "5rem" },
                color: "#fff",
                letterSpacing: "0.2em",
                mb: 8,
                textAlign: "center",
              }}
            >
              YOUR CART
            </Typography>

            {items.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 16,
                  border: "2px solid rgba(57,255,20,0.3)",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(57,255,20,0.05) 0%, rgba(5,5,5,0.95) 100%)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    color: "#39FF14",
                    mb: 4,
                  }}
                >
                  YOUR CART IS EMPTY
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Poppins, sans-serif", color: "#A0A0A0", mb: 6 }}
                >
                  Add some premium streetwear to your collection
                </Typography>
                <Link href="/shop" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#39FF14",
                      color: "#000",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#2dd610" },
                      px: 6,
                      py: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    Shop Now
                  </Button>
                </Link>
              </Box>
            ) : (
              <Grid container spacing={6}>
                <Grid item xs={12} lg={8}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          bgcolor: "#111",
                          p: 3,
                          mb: 3,
                          borderRadius: "16px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          gap: 3,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            position: "relative",
                            borderRadius: "8px",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#39FF14",
                              fontWeight: 700,
                              mb: 2,
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              sx={{ color: "#fff" }}
                            >
                              <Minus size={16} />
                            </IconButton>
                            <Typography
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                color: "#fff",
                                minWidth: 24,
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              sx={{ color: "#fff" }}
                            >
                              <Plus size={16} />
                            </IconButton>
                            <IconButton
                              onClick={() => removeItem(item.id)}
                              sx={{ color: "#ff4757", ml: 2 }}
                            >
                              <Trash2 size={20} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                            }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))}
                </Grid>

                <Grid item xs={12} lg={4}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Paper
                      sx={{
                        bgcolor: "#111",
                        p: 4,
                        borderRadius: "16px",
                        border: "2px solid rgba(57,255,20,0.3)",
                        position: "sticky",
                        top: "120px",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          color: "#fff",
                          letterSpacing: "0.1em",
                          mb: 4,
                        }}
                      >
                        ORDER SUMMARY
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography
                            sx={{ fontFamily: "Poppins, sans-serif", color: "#A0A0A0" }}
                          >
                            Subtotal ({getTotalItems()} items)
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            ${getTotalPrice().toFixed(2)}
                          </Typography>
                        </Box>
                        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                      </Box>
                      <Box sx={{ mb: 4 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                            }}
                          >
                            Total
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#39FF14",
                              fontWeight: 700,
                            }}
                          >
                            ${getTotalPrice().toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          bgcolor: "#39FF14",
                          color: "#000",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          py: 2,
                          fontSize: "1rem",
                          textTransform: "uppercase",
                          "&:hover": { bgcolor: "#2dd610" },
                        }}
                      >
                        Proceed to Checkout
                      </Button>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            )}
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
