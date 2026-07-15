"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function CollectionBanner() {
  return (
    <Box sx={{ py: 16, position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(57,255,20,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              bgcolor: "#111111",
              border: "1px solid rgba(57,255,20,0.15)",
              borderRadius: "24px",
              p: { xs: 6, md: 10 },
              textAlign: "center",
              position: "relative",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: "#fff",
                fontFamily: "Bebas Neue, cursive",
                mb: 2,
                fontSize: { xs: "3rem", md: "4.5rem" },
              }}
            >
              THE LAMAH MOVEMENT
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#A0A0A0",
                fontFamily: "Poppins, sans-serif",
                mb: 5,
                fontWeight: 400,
              }}
            >
              Designed to Inspire. Built to Last.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#39FF14",
                color: "#050505",
                "&:hover": { bgcolor: "#2ed611" },
                px: 8,
                py: 1.8,
                fontSize: "1rem",
              }}
            >
              Explore Collection
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
