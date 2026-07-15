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
      }}
    >
      {/* Floating Smoke/Particle Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(57,255,20,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl">
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
              variant="overline"
              sx={{
                color: "#39FF14",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                letterSpacing: "0.3em",
                display: "block",
                mb: 2,
              }}
            >
              NEW COLLECTION
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: "#fff",
                fontFamily: "Bebas Neue, cursive",
                lineHeight: 0.9,
                mb: 3,
                fontSize: { xs: "3.5rem", md: "5rem", lg: "6rem" },
              }}
            >
              WE DON&apos;T SELL<br />
              CLOTHES<br />
              <span style={{ color: "#39FF14" }}>WE CREATE MOVEMENT</span>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#A0A0A0",
                maxWidth: "500px",
                mb: 5,
                fontSize: "1.1rem",
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
