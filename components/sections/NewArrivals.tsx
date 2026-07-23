"use client";

import { useEffect, useState } from "react";
import { Box, Chip, Container, Typography, Grid, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { fetchNewArrivals } from "@/lib/newArrivals";
import type { NewArrival } from "@/types/newArrival";

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
        py: { xs: 10, md: 14 },
        bgcolor: "#080808",
        background:
          "radial-gradient(circle at top left, rgba(57,255,20,0.08) 0%, transparent 24%), linear-gradient(180deg, #060606 0%, #0A0A0A 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Chip
            label="JUST LANDED"
            sx={{
              mb: 2.5,
              bgcolor: "rgba(57,255,20,0.12)",
              color: "#39FF14",
              border: "1px solid rgba(57,255,20,0.2)",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.08em",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              color: "#fff",
              fontFamily: "Bebas Neue, cursive",
              fontSize: { xs: "2.8rem", md: "4.3rem" },
              letterSpacing: "0.12em",
              lineHeight: 0.95,
              mb: 1.5,
            }}
          >
            NEW ARRIVALS
          </Typography>
          <Typography
            sx={{
              maxWidth: 640,
              mx: "auto",
              color: "#9E9E9E",
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "0.98rem", md: "1.05rem" },
            }}
          >
            Fresh drops from your live catalog, presented in a cleaner premium layout with better spacing and stronger product focus.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#39FF14" }} />
          </Box>
        ) : arrivals.length === 0 ? (
          <Box
            sx={{
              py: 10,
              px: 4,
              textAlign: "center",
              borderRadius: "24px",
              border: "1px solid rgba(57,255,20,0.12)",
              background: "linear-gradient(180deg, rgba(17,17,17,0.92) 0%, rgba(5,5,5,0.98) 100%)",
            }}
          >
            <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", mb: 1 }}>
              No active new arrivals yet.
            </Typography>
            <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
              Publish items in your new arrivals database collection and they will appear here automatically.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {arrivals.map((arrival, index) => (
              <Grid item key={arrival.id} xs={12} sm={6} md={4} lg={3}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
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
        )}
      </Container>
    </Box>
  );
}
