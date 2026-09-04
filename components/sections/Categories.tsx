"use client";

import { Box, Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Chip } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/category";
import { fetchCategories } from "@/lib/categories";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

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
      <Box sx={{ py: 16, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#050505" }}>
        <CircularProgress sx={{ color: "#39FF14" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 14, md: 20 }, bgcolor: "#050505", position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(57,255,20,0.3), transparent)",
        }}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4, lg: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <Chip
                label="EXPLORE COLLECTIONS"
                sx={{
                  mb: { xs: 3, md: 4 },
                  bgcolor: "rgba(57,255,20,0.06)",
                  color: "#39FF14",
                  border: "1px solid rgba(57,255,20,0.2)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  fontSize: "0.68rem",
                  borderRadius: "999px",
                  py: 0.7,
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
                fontSize: { xs: "3rem", sm: "4.2rem", md: "5.6rem" },
                lineHeight: 0.9,
                mb: { xs: 3, md: 4 },
                letterSpacing: "0.02em",
              }}
            >
              SHOP BY{" "}
              <Box
                component="span"
                sx={{
                  color: "#39FF14",
                  background:
                    "linear-gradient(135deg, #39FF14 0%, #6CFF52 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CATEGORY
              </Box>
            </Typography>

            <Typography
              sx={{
                textAlign: "center",
                color: "#9A9A9A",
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                maxWidth: 560,
                mx: "auto",
                lineHeight: 1.75,
              }}
            >
              Curated selections crafted for every move you make. Find exactly what
              moves you — across essentials, statements, and signature drops.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} lg={3} key={category.id || category.name}>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -12 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: { xs: "20px", md: "24px" },
                        bgcolor: "#111111",
                        border: "1px solid rgba(57,255,20,0.08)",
                        "&:hover": {
                          borderColor: "rgba(57,255,20,0.4)",
                          boxShadow:
                            "0 24px 70px rgba(0,0,0,0.55), 0 0 40px rgba(57,255,20,0.12)",
                        },
                        transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          height: { xs: 320, md: 400 },
                          overflow: "hidden",
                        }}
                      >
                        {category.image ? (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            style={{ width: "100%", height: "100%" }}
                          >
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          </motion.div>
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
                            <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins" }}>
                              No Image
                            </Typography>
                          </Box>
                        )}

                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.5) 45%, rgba(5,5,5,0.1) 75%, transparent 100%)",
                          }}
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "12px",
                            bgcolor: "rgba(57,255,20,0.12)",
                            border: "1px solid rgba(57,255,20,0.25)",
                            color: "#39FF14",
                            fontFamily: "Bebas Neue, cursive",
                            fontSize: "1.1rem",
                            letterSpacing: "0.05em",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          0{index + 1}
                        </Box>
                      </Box>

                      <CardContent
                        sx={{
                          position: "relative",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: { xs: 3, md: 4 },
                          mt: "-120px",
                          zIndex: 2,
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontFamily: "Bebas Neue, cursive",
                            color: "#fff",
                            fontSize: { xs: "2.1rem", md: "2.5rem" },
                            mb: 1,
                            letterSpacing: "0.02em",
                            lineHeight: 0.95,
                          }}
                        >
                          {category.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#9A9A9A",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.9rem",
                            lineHeight: 1.6,
                            mb: { xs: 3, md: 4 },
                            minHeight: { md: 44 },
                          }}
                        >
                          {category.description || "Explore the collection"}
                        </Typography>

                        <Button
                          component={Link}
                          href={`/categories/${category.slug || generateSlug(category.name)}`}
                          variant="contained"
                          endIcon={<ArrowRight size={17} />}
                          sx={{
                            bgcolor: "#39FF14",
                            color: "#050505",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: "0.88rem",
                            textTransform: "none",
                            px: 2.8,
                            py: 1.3,
                            borderRadius: "12px",
                            "&:hover": {
                              bgcolor: "#2FD10F",
                              boxShadow: "0 10px 30px rgba(57,255,20,0.25)",
                            },
                          }}
                        >
                          Shop Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
