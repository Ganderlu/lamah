
"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCartStore } from "@/lib/store/cart";
import { Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

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
              YOUR WISHLIST
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
                  YOUR WISHLIST IS EMPTY
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Poppins, sans-serif", color: "#A0A0A0", mb: 6 }}
                >
                  Save your favorite items for later
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
              <Grid container spacing={4}>
                {items.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          bgcolor: "#111",
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <Box sx={{ position: "relative", height: 300 }}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <IconButton
                            onClick={() => removeItem(item.id)}
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              bgcolor: "rgba(5,5,5,0.7)",
                              color: "#ff4757",
                              "&:hover": { bgcolor: "rgba(5,5,5,0.9)" },
                            }}
                          >
                            <Trash2 size={20} />
                          </IconButton>
                        </Box>
                        <Box sx={{ p: 3 }}>
                          <Typography
                            variant="h6"
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
                            variant="h5"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#39FF14",
                              fontWeight: 700,
                              mb: 2,
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCart size={18} />}
                            onClick={() => addItem(item)}
                            sx={{
                              bgcolor: "#39FF14",
                              color: "#000",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              "&:hover": { bgcolor: "#2dd610" },
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
