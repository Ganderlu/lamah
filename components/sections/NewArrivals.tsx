"use client";

import { useEffect, useState } from "react";
import { Box, Chip, Container, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { fetchNewArrivals } from "@/lib/newArrivals";
import type { NewArrival } from "@/types/newArrival";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 45 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function NewArrivals() {
  const [arrivals, setArrivals] = useState<NewArrival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArrivals = async () => {
      try {
        const data = await fetchNewArrivals("Active");
        setArrivals(data);
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArrivals();
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 14, md: 20 },
        bgcolor: "#070707",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(57,255,20,0.08) 0%, transparent 35%), radial-gradient(ellipse at 100% 20%, rgba(0,229,255,0.04) 0%, transparent 35%), linear-gradient(180deg, #050505 0%, #080808 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(57,255,20,0.25), transparent)",
        }}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4, lg: 6 }, position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 8, md: 12 },
              position: "relative",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <Chip
                icon={<Sparkles size={13} style={{ color: "#39FF14" }} />}
                label="JUST LANDED · FW 25/26"
                sx={{
                  mb: { xs: 3, md: 4 },
                  bgcolor: "rgba(57,255,20,0.08)",
                  color: "#39FF14",
                  border: "1px solid rgba(57,255,20,0.25)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  fontSize: "0.7rem",
                  py: 0.8,
                  borderRadius: "999px",
                  backdropFilter: "blur(8px)",
                  "& .MuiChip-icon": { ml: 1.2, mr: 0.3 },
                  "& .MuiChip-label": { px: 2.2 },
                }}
              />
            </motion.div>

            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "3.1rem", sm: "4.5rem", md: "6rem" },
                letterSpacing: "0.02em",
                lineHeight: 0.9,
                mb: { xs: 3, md: 4 },
              }}
            >
              NEW{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #39FF14 0%, #6CFF52 50%, #39FF14 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 25px rgba(57,255,20,0.25))",
                }}
              >
                ARRIVALS
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                mx: "auto",
                color: "#9A9A9A",
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.8,
              }}
            >
              Freshly cut, just dropped. First access to our latest designs — premium
              essentials and statement pieces built for movement.
            </Typography>
          </Box>
        </motion.div>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
            <CircularProgress sx={{ color: "#39FF14" }} size={48} thickness={4} />
          </Box>
        ) : arrivals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                py: 14,
                px: 4,
                textAlign: "center",
                borderRadius: "28px",
                border: "1px solid rgba(57,255,20,0.12)",
                background:
                  "linear-gradient(180deg, rgba(17,17,17,0.85) 0%, rgba(5,5,5,0.95) 100%)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "1.15rem",
                  mb: 1.5,
                  fontWeight: 500,
                }}
              >
                No active new arrivals yet.
              </Typography>
              <Typography
                sx={{
                  color: "#8E8E8E",
                  fontFamily: "Poppins, sans-serif",
                  mb: 4,
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                Publish items in your new arrivals database collection and they'll
                appear here automatically.
              </Typography>
              <Button
                component={Link}
                href="/shop"
                variant="contained"
                endIcon={<ArrowRight size={17} />}
                sx={{
                  bgcolor: "#39FF14",
                  color: "#050505",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  px: 4,
                  py: 1.3,
                  borderRadius: "12px",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#2FD10F",
                    boxShadow: "0 10px 30px rgba(57,255,20,0.25)",
                  },
                }}
              >
                Browse Shop
              </Button>
            </Box>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
                {arrivals.slice(0, 8).map((arrival) => (
                  <Grid item key={arrival.id} xs={12} sm={6} md={4} lg={3}>
                    <motion.div variants={cardVariants}>
                      <ProductCard
                        id={arrival.id || ""}
                        name={arrival.productName}
                        price={arrival.discountPrice || arrival.price}
                        image={arrival.thumbnail || "/images/lamahwhiteb.png"}
                        isNew={arrival.newArrival}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box sx={{ mt: { xs: 8, md: 12 }, display: "flex", justifyContent: "center" }}>
                <Button
                  component={Link}
                  href="/shop"
                  variant="outlined"
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    borderColor: "rgba(57,255,20,0.35)",
                    color: "#39FF14",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    px: { xs: 4, md: 6 },
                    py: 1.6,
                    borderRadius: "14px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#39FF14",
                      bgcolor: "rgba(57,255,20,0.06)",
                    },
                  }}
                >
                  View All Products
                </Button>
              </Box>
            </motion.div>
          </>
        )}
      </Container>
    </Box>
  );
}
