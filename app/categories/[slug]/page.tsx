"use client";

import { Box, Container, Grid, Typography, CircularProgress } from "@mui/material";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { products, bestSellers } from "@/lib/constants/products";
import { fetchCategories } from "@/lib/categories";
import type { Category } from "@/types/category";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // For now, let's just use all products, but later we can filter by category
  const allProducts = [...products, ...bestSellers];

  // Function to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const categories = await fetchCategories("Active");
        // Try to find by exact slug match first, then try generated slug from name
        let foundCategory = categories.find(cat => cat.slug === slug);
        if (!foundCategory) {
          foundCategory = categories.find(cat => generateSlug(cat.name) === slug);
        }
        setCategory(foundCategory || null);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategory();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ py: 12, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#050505" }}>
        <CircularProgress sx={{ color: "#39FF14" }} />
      </Box>
    );
  }

  if (!category) {
    return (
      <Box sx={{ py: 12, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#050505" }}>
        <Typography variant="h4" sx={{ color: "#fff" }}>Category not found</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ position: "relative", height: "400px", overflow: "hidden" }}>
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : null}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(5,5,5,0.7)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "3rem", md: "5rem" },
                  color: "#fff",
                  letterSpacing: "0.2em",
                  mb: 2,
                }}
              >
                {category.name.toUpperCase()}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                }}
              >
                {category.description}
              </Typography>
            </motion.div>
          </Box>
        </Box>

        {/* Products Grid */}
        <Container maxWidth="xl" sx={{ py: 12 }}>
          <Grid container spacing={4}>
            {allProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
