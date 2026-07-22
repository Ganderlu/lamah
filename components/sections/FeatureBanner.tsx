"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FeatureBanner() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "130vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0.4) 50%, transparent 100%)",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, width: "100%" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ maxWidth: "500px", ml: { xs: 0, md: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                mb: 2,
              }}
            >
              The New In Edit for Men
            </Typography>
            <Button
              component={Link}
              href="/men"
              variant="outlined"
              sx={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "#fff",
                px: 4,
                py: 1.5,
                borderRadius: 0,
                "&:hover": {
                  borderColor: "#39FF14",
                  color: "#39FF14",
                },
              }}
            >
              SHOP NOW
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}