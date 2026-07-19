"use client";

import { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, CircularProgress } from "@mui/material";
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
    <Box sx={{ py: 12, bgcolor: "#080808" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            color: "#fff",
            fontFamily: "Bebas Neue, cursive",
            mb: 8,
          }}
        >
          NEW ARRIVALS
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#39FF14" }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {arrivals.map((arrival) => (
              <Grid item key={arrival.id} xs={12} sm={6} md={4} lg={2}>
                <ProductCard
                  id={arrival.id || ""}
                  name={arrival.productName}
                  price={arrival.discountPrice || arrival.price}
                  image={arrival.thumbnail || ""}
                  isNew={arrival.newArrival}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
