"use client";

import { useEffect, useMemo, useState, use } from "react";
import { Box, Chip, CircularProgress, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { fetchCategories } from "@/lib/categories";
import { fetchProductsByCategory } from "@/lib/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

type StorefrontProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
};

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        const categories = await fetchCategories("Active");
        let foundCategory = categories.find((cat) => cat.slug === slug);

        if (!foundCategory) {
          foundCategory = categories.find((cat) => generateSlug(cat.name) === slug);
        }

        setCategory(foundCategory || null);

        if (!foundCategory) {
          setProducts([]);
          return;
        }

        const categoryProducts = await fetchProductsByCategory(foundCategory.name);
        setProducts(categoryProducts.filter((product) => product.status === "Active"));
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategoryData();
  }, [slug]);

  const storefrontProducts = useMemo(
    () =>
      products
        .filter((product) => Boolean(product.id))
        .map(
          (product) =>
            ({
              id: product.id as string,
              name: product.name,
              price: product.discountPrice || product.price,
              image: product.thumbnail || "/images/lamahwhiteb.png",
              isNew: false,
            }) satisfies StorefrontProduct
        ),
    [products]
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            py: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "#050505",
          }}
        >
          <CircularProgress sx={{ color: "#39FF14" }} />
        </Box>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            py: 12,
            px: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "#050505",
            textAlign: "center",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ color: "#fff", fontFamily: "Bebas Neue, cursive", letterSpacing: "0.12em", mb: 2 }}
            >
              Category Not Found
            </Typography>
            <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
              The selected category could not be found in your active database categories.
            </Typography>
          </Box>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        <Box sx={{ position: "relative", minHeight: { xs: 360, md: 430 }, overflow: "hidden" }}>
          {(category.bannerImage || category.image) ? (
            <Image
              src={category.bannerImage || category.image || "/images/lamahwhiteb.png"}
              alt={category.name}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : null}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,5,5,0.32) 0%, rgba(5,5,5,0.72) 55%, rgba(5,5,5,0.96) 100%)",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 9 } }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label="SHOP BY CATEGORY"
                  sx={{
                    mb: 2.5,
                    bgcolor: "rgba(57,255,20,0.12)",
                    color: "#39FF14",
                    border: "1px solid rgba(57,255,20,0.24)",
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "0.08em",
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: { xs: "3rem", md: "5.2rem" },
                    color: "#fff",
                    letterSpacing: "0.16em",
                    mb: 1.5,
                    lineHeight: 0.95,
                  }}
                >
                  {category.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#CFCFCF",
                    maxWidth: 680,
                  }}
                >
                  {category.description || `Explore all active ${category.name.toLowerCase()} products from your live catalog.`}
                </Typography>
              </motion.div>
            </Container>
          </Box>
        </Box>

        <Container maxWidth="xl" sx={{ py: 10 }}>
          <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", gap: 3, flexWrap: "wrap", alignItems: "end" }}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "2.3rem", md: "3.5rem" },
                  color: "#fff",
                  letterSpacing: "0.1em",
                  mb: 1,
                }}
              >
                {storefrontProducts.length === 0 ? "No Products Yet" : "Category Products"}
              </Typography>
              <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
                Live products from the `{category.name}` category in your database.
              </Typography>
            </Box>
            <Chip
              label={`${storefrontProducts.length} Items`}
              sx={{
                bgcolor: "rgba(255,255,255,0.04)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </Box>

          {storefrontProducts.length === 0 ? (
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
                No active products found for this category.
              </Typography>
              <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
                Products assigned to `{category.name}` will appear here automatically once they are active in the database.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {storefrontProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
