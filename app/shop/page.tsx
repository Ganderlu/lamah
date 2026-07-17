
"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { products, bestSellers } from "@/lib/constants/products";

export default function ShopPage() {
  const allProducts = [...products, ...bestSellers];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ position: "relative", height: "400px", overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(5,5,5,0.7)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "3rem", md: "5rem" },
                  color: "#fff",
                  letterSpacing: "0.2em",
                  mb: 2,
                }}
              >
                SHOP ALL
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                }}
              >
                Discover our full collection of premium streetwear
              </Typography>
            </motion.div>
          </Box>
        </Box>

        {/* Products Grid */}
        <Container maxWidth="xl" sx={{ py: 12 }}>
          <Grid container spacing={4}>
            {allProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
