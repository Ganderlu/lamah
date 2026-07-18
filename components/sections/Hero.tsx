"use client";

import { motion } from "framer-motion";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#050505",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
        }}
      />
      {/* Dark Overlay to ensure content is readable */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(5,5,5,1) 0%, rgba(5,5,5,0.95) 30%, rgba(5,5,5,0.8) 50%, rgba(5,5,5,0.3) 70%, rgba(5,5,5,0.7) 100%)",
        }}
      />
      {/* Floating Smoke/Particle Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(57,255,20,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 8, lg: 12 },
            alignItems: "center",
            py: 8,
          }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h1"
              sx={{
                color: "#39FF14",
                fontFamily: "Bebas Neue, cursive",
                lineHeight: 1,
                mb: 3,
                fontSize: { xs: "4rem", md: "6rem", lg: "7rem" },
                textShadow: "0 0 40px rgba(57,255,20,0.8), 0 0 80px rgba(57,255,20,0.4)",
              }}
            >
              WE CREATE MOVEMENT
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#FFFFFF",
                maxWidth: "500px",
                mb: 5,
                fontSize: "1.1rem",
                textShadow: "0 0 15px rgba(0,0,0,0.8)",
              }}
            >
              Every piece we design carries a purpose. Wear the mindset. Live the movement.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} gap={3}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#39FF14",
                  color: "#050505",
                  "&:hover": { bgcolor: "#2ed611" },
                  px: 5,
                  py: 1.5,
                }}
              >
                Shop Men
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#39FF14",
                  color: "#39FF14",
                  "&:hover": { borderColor: "#39FF14", bgcolor: "rgba(57,255,20,0.1)" },
                  px: 5,
                  py: 1.5,
                }}
              >
                Shop Women
              </Button>
            </Stack>
          </motion.div>

          {/* Right Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-20px",
                  background:
                    "radial-gradient(circle, rgba(57,255,20,0.3) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  zIndex: 0,
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: { xs: 300, md: 400 },
                  height: { xs: 400, md: 500 },
                  bgcolor: "#050505",
                  borderRadius: "20px",
                  border: "1px solid rgba(57,255,20,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: { xs: "1rem", md: "1.5rem" },
                  padding: "2rem",
                  boxShadow: "0 0 60px rgba(57,255,20,0.2)",
                }}
              >
                {["LOVE", "ACCEPT", "MOTIVATE", "ASPIRE", "HEAL"].map((word, i) => (
                  <Typography
                    key={i}
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      color: "#39FF14",
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      letterSpacing: "0.2em",
                      textShadow: "0 0 20px rgba(57,255,20,0.6)",
                    }}
                  >
                    {word}
                  </Typography>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#39FF14",
            cursor: "pointer",
          }}
        >
          <Typography variant="caption" sx={{ letterSpacing: "0.2em", mb: 1 }}>
            SCROLL
          </Typography>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown />
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
