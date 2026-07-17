"use client";

import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function WomenPage() {
  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ position: "relative", height: "500px", overflow: "hidden" }}>
          <Image
            src="/images/lamahwhitef.png"
            alt="Women's Collection"
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
                WOMEN'S COLLECTION
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  maxWidth: "600px",
                }}
              >
                Elevated streetwear for the modern woman
              </Typography>
            </motion.div>
          </Box>
        </Box>

        {/* Coming Soon Section */}
        <Container maxWidth="xl" sx={{ py: 16 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                px: 4,
                border: "2px solid rgba(57,255,20,0.3)",
                borderRadius: "24px",
                background: "linear-gradient(135deg, rgba(57,255,20,0.05) 0%, rgba(5,5,5,0.95) 100%)",
                boxShadow: "0 0 40px rgba(57,255,20,0.1)",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "4rem", md: "7rem" },
                  color: "#39FF14",
                  letterSpacing: "0.3em",
                  mb: 4,
                }}
              >
                COMING SOON
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                We're working on something amazing. Stay tuned for our new women's collection.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
