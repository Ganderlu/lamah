"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

// Men's single product
const menProduct = {
  id: "m1",
  name: "white polo",
  price: 50,
  image: "/images/lamahwhiteb.png",
  isNew: true,
};

export default function MenPage() {
  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ position: "relative", height: "500px", overflow: "hidden" }}>
          <Image
            src="/images/lamahwhiteb.png"
            alt="Men's Collection"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            priority
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(5,5,5,0.6)",
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
                MEN'S COLLECTION
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  maxWidth: "600px",
                }}
              >
                Premium streetwear for the modern man
              </Typography>
            </motion.div>
          </Box>
        </Box>

        {/* Shop Men Section - Single Product */}
        <Container maxWidth="xl" sx={{ py: 12 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Bebas Neue, cursive",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              color: "#fff",
              letterSpacing: "0.1em",
              mb: 8,
              textAlign: "center",
            }}
          >
            SHOP MEN
          </Typography>
          <Grid container justifyContent="center" spacing={4}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard {...menProduct} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
