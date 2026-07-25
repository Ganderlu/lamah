"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { fetchProducts } from "@/lib/products";
import type { Product } from "@/types/product";

type StorefrontProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
};

const matchesMenCollection = (product: Product) => {
  const category = product.category.toLowerCase();
  const collection = product.collection.toLowerCase();
  const tags = product.tags.map((tag) => tag.toLowerCase());
  return (
    category.includes("men") ||
    category.includes("male") ||
    collection.includes("men") ||
    collection.includes("male") ||
    tags.some((tag) => tag.includes("men") || tag.includes("male"))
  );
};

export default function MenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await fetchProducts("Active");
        setProducts(productsData.filter(matchesMenCollection));
      } catch (error) {
        console.error("Error loading men's products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        <Box sx={{ position: "relative", height: { xs: 420, md: 520 }, overflow: "hidden" }}>
          <Image
            src="/images/lamahwhiteb.png"
            alt="Men's Collection"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            priority
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,5,5,0.28) 0%, rgba(5,5,5,0.72) 55%, rgba(5,5,5,0.95) 100%)",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Container maxWidth="xl" sx={{ pb: { xs: 6, md: 10 } }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label="LIVE MEN'S EDIT"
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
                    fontSize: { xs: "3rem", md: "5.4rem" },
                    color: "#fff",
                    letterSpacing: "0.18em",
                    mb: 1.5,
                    lineHeight: 0.95,
                  }}
                >
                  MEN&apos;S COLLECTION
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#C9C9C9",
                    maxWidth: 640,
                  }}
                >
                  Tailored streetwear essentials pulled directly from your live catalog for a sharp and premium men&apos;s storefront.
                </Typography>
              </motion.div>
            </Container>
          </Box>
        </Box>

        <Container maxWidth="xl" sx={{ py: 10 }}>
          {loading ? (
            <Box sx={{ py: 12, display: "flex", justifyContent: "center" }}>
              <CircularProgress sx={{ color: "#39FF14" }} />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", gap: 3, flexWrap: "wrap", alignItems: "end" }}>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      fontSize: { xs: "2.3rem", md: "3.6rem" },
                      color: "#fff",
                      letterSpacing: "0.1em",
                      mb: 1,
                    }}
                  >
                    Shop Men
                  </Typography>
                  <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
                    Active men&apos;s products from your database.
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
                    No men&apos;s products found yet.
                  </Typography>
                  <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
                    Make sure your product `category`, `collection`, or `tags` include `men` so they appear here automatically.
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
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
