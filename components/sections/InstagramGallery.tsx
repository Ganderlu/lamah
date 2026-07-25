"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const instagramImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1475180429745-c1bbd5425c7a?w=400&auto=format&fit=crop&q=60",
];

export default function InstagramGallery() {
  return (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Instagram size={32} style={{ color: "#39FF14", marginBottom: "1rem" }} />
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontFamily: "Bebas Neue, cursive",
            }}
          >
            @LAMAHCLOTHINGCO
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {instagramImages.map((image, index) => (
            <Grid item key={index} xs={6} sm={4} md={3}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                style={{ position: "relative", height: "280px", borderRadius: "12px", overflow: "hidden" }}
              >
                <Image
                  src={image}
                  alt={`Lamah Instagram ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(57,255,20,0.15)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    "&:hover": { opacity: 1 },
                  }}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
