"use client";

import { Box, Container, Typography, Grid, Card, CardContent, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Category } from "@/types/category";
import { fetchCategories } from "@/lib/categories";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories("Active");
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 12, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: "#39FF14" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 12 }}>
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
          SHOP BY CATEGORY
        </Typography>

        <Grid container spacing={4}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} lg={3} key={category.id || category.name}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "20px",
                    bgcolor: "#111111",
                    border: "1px solid rgba(57,255,20,0.1)",
                    "&:hover": {
                      borderColor: "rgba(57,255,20,0.5)",
                      boxShadow: "0 0 30px rgba(57,255,20,0.2)",
                    },
                    transition: "all 0.3s ease",
                    height: "100%",
                  }}
                >
                  <Box sx={{ position: "relative", height: "350px", overflow: "hidden" }}>
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                        className="group-hover:scale-110"
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: "#1a1a1a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ color: "#9E9E9E" }}>No Image</Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(5,5,5,0.9), transparent)",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: "Bebas Neue, cursive",
                        color: "#fff",
                        mb: 1,
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#A0A0A0", mb: 3 }}>
                      {category.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#39FF14",
                        color: "#050505",
                        "&:hover": { bgcolor: "#2ed611" },
                      }}
                    >
                      Shop Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
