"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

export default function FeatureBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["-3%", "6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3]);

  return (
    <Box
      ref={bannerRef}
      sx={{
        position: "relative",
        minHeight: { xs: "90vh", md: "100vh" },
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        bgcolor: "#040404",
      }}
    >
      {/* Animated Background Image with parallax */}
      <motion.div
        style={{ y: bgY, scale: 1.12 }}
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=2400&q=85)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </motion.div>

      {/* Multi-layer Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4,4,4,0.85) 0%, rgba(4,4,4,0.4) 35%, rgba(4,4,4,0.55) 70%, rgba(4,4,4,0.95) 100%), linear-gradient(90deg, rgba(4,4,4,0.92) 0%, rgba(4,4,4,0.7) 30%, rgba(4,4,4,0.3) 55%, rgba(4,4,4,0.12) 75%, rgba(4,4,4,0.5) 100%)",
        }}
      />

      {/* Subtle grid overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(57,255,20,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 20% 50%, rgba(0,0,0,1) 0%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 20% 50%, rgba(0,0,0,1) 0%, transparent 65%)",
        }}
      />

      {/* Floating glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "35%",
          left: "25%",
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, rgba(57,255,20,0.22) 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xl"
        component={motion.div}
        style={{ y: textY, opacity }}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          px: { xs: 2, md: 4, lg: 6 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Box sx={{ maxWidth: { xs: "100%", md: 620 }, ml: { xs: 0, md: 0, lg: 2 } }}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  mb: { xs: 4, md: 5 },
                  borderRadius: "999px",
                  bgcolor: "rgba(57,255,20,0.08)",
                  border: "1px solid rgba(57,255,20,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Sparkles size={14} style={{ color: "#39FF14" }} />
                <Typography
                  sx={{
                    color: "#39FF14",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    fontSize: "0.72rem",
                  }}
                >
                  SIGNATURE COLLECTION
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: "#fff",
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "3.4rem", sm: "5rem", md: "6.4rem", lg: "7.6rem" },
                  lineHeight: 0.88,
                  letterSpacing: "0.015em",
                  mb: { xs: 3, md: 4 },
                  fontWeight: 400,
                }}
              >
                <Box component="span" sx={{ display: "block" }}>
                  DEFINE YOUR
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background:
                      "linear-gradient(135deg, #39FF14 0%, #6CFF52 40%, #9CFF7A 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 30px rgba(57,255,20,0.35))",
                  }}
                >
                  MOVEMENT
                </Box>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Typography
                sx={{
                  color: "#CFCFCF",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "0.98rem", md: "1.1rem" },
                  lineHeight: 1.85,
                  maxWidth: 540,
                  mb: { xs: 5, md: 7 },
                }}
              >
                Own your lane in pieces engineered for modern movement. From first
                light to last call, this is the drop you reach for — timeless design,
                premium fabric, signature Lamah energy.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 55px rgba(57,255,20,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                style={{ display: "inline-block" }}
              >
                <Button
                  component={Link}
                  href="/shop"
                  variant="contained"
                  endIcon={<ArrowRight size={19} />}
                  sx={{
                    bgcolor: "#39FF14",
                    color: "#050505",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    px: { xs: 4, sm: 5.5, md: 7 },
                    py: { xs: 1.7, md: 2 },
                    borderRadius: "14px",
                    boxShadow: "0 14px 40px rgba(57,255,20,0.28)",
                    textTransform: "none",
                    letterSpacing: "0.01em",
                    "&:hover": {
                      bgcolor: "#2FD10F",
                    },
                  }}
                >
                  Shop The Drop
                </Button>
              </motion.div>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
