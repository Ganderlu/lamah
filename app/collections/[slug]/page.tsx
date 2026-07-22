"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchCollections } from "@/lib/collections";
import { fetchProducts } from "@/lib/products";
import type { Collection } from "@/types/collection";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const loadData = async () => {
      try {
        const [collectionsData, productsData] = await Promise.all([
          fetchCollections(),
          fetchProducts(),
        ]);
        
        const foundCollection = collectionsData.find(col => col.slug === slug);
        setCollection(foundCollection || null);
        
        if (foundCollection) {
          const filteredProducts = productsData.filter(
            (product) => product.collection === foundCollection.name && product.status === "Active"
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error loading collection data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress sx={{ color: "#39FF14" }} />
        </Box>
        <Footer />
      </>
    );
  }

  if (!collection) {
    return (
      <>
        <Navbar />
        <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 12 }}>
          <Typography variant="h4" sx={{ color: "#fff", mb: 4, fontFamily: "Poppins, sans-serif" }}>
            Collection not found
          </Typography>
          <Link href="/collections" passHref>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#39FF14",
                color: "#000",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Back to Collections
            </Button>
          </Link>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1, py: 12 }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Collection Header */}
            {collection.bannerImage && (
              <Box sx={{ mb: 8, position: "relative", borderRadius: "24px", overflow: "hidden", height: 400 }}>
                <Image
                  src={collection.bannerImage}
                  alt={collection.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.4) 100%)",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 6,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{
                        fontFamily: "Bebas Neue, cursive",
                        color: "#fff",
                        letterSpacing: "0.2em",
                        mb: 2,
                      }}
                    >
                      {collection.name}
                    </Typography>
                    {collection.description && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          maxWidth: 600,
                        }}
                      >
                        {collection.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}

            {!collection.bannerImage && (
              <Box sx={{ mb: 8, textAlign: "center" }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    color: "#fff",
                    letterSpacing: "0.2em",
                    mb: 2,
                  }}
                >
                  {collection.name}
                </Typography>
                {collection.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#A0A0A0",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {collection.description}
                  </Typography>
                )}
              </Box>
            )}

            <Typography
              variant="h2"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                color: "#fff",
                letterSpacing: "0.1em",
                mb: 6,
              }}
            >
              {products.length === 0 ? "NO PRODUCTS YET" : "PRODUCTS"}
            </Typography>

            {products.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#A0A0A0",
                    fontFamily: "Poppins, sans-serif",
                    mb: 4,
                  }}
                >
                  No products in this collection yet
                </Typography>
                <Link href="/shop" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#39FF14",
                      color: "#000",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Shop All Products
                  </Button>
                </Link>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {products.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          bgcolor: "#111111",
                          border: "1px solid rgba(57,255,20,0.15)",
                          borderRadius: "18px",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 10px 30px rgba(57,255,20,0.15)",
                          },
                        }}
                      >
                        <Link href={`/product/${product.id}`} passHref style={{ textDecoration: "none" }}>
                          <CardMedia
                            sx={{ position: "relative", height: 300 }}
                          >
                            <Image
                              src={product.thumbnail || "/images/lamahwhiteb.png"}
                              alt={product.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                            {product.discountPrice && (
                              <Chip
                                label="SALE"
                                sx={{
                                  position: "absolute",
                                  top: 16,
                                  left: 16,
                                  bgcolor: "#EF4444",
                                  color: "#fff",
                                  fontWeight: 700,
                                }}
                              />
                            )}
                            {product.featured && (
                              <Chip
                                label="FEATURED"
                                sx={{
                                  position: "absolute",
                                  top: 16,
                                  right: 16,
                                  bgcolor: "#39FF14",
                                  color: "#000",
                                  fontWeight: 700,
                                }}
                              />
                            )}
                          </CardMedia>
                          <CardContent sx={{ p: 3 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                mb: 1,
                                fontSize: "1rem",
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                              <Typography
                                sx={{
                                  color: "#39FF14",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 700,
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formatCurrency(product.discountPrice || product.price)}
                              </Typography>
                              {product.discountPrice && (
                                <Typography
                                  sx={{
                                    color: "#A0A0A0",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "1rem",
                                    textDecoration: "line-through",
                                  }}
                                >
                                  {formatCurrency(product.price)}
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Link>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
