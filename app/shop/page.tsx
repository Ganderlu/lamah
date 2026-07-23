
"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, Container, Grid, Typography } from "@mui/material";
import ProductCard from "@/components/ui/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { fetchProducts } from "@/lib/products";
import { fetchNewArrivals } from "@/lib/newArrivals";
import type { Product } from "@/types/product";
import type { NewArrival } from "@/types/newArrival";

type StorefrontCardItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
};

const normalizeProduct = (product: Product): StorefrontCardItem | null => {
  if (!product.id) return null;

  return {
    id: product.id,
    name: product.name,
    price: product.discountPrice || product.price,
    image: product.thumbnail || "/images/lamahwhiteb.png",
    isNew: false,
  };
};

const normalizeArrival = (arrival: NewArrival): StorefrontCardItem | null => {
  if (!arrival.id) return null;

  return {
    id: arrival.id,
    name: arrival.productName,
    price: arrival.discountPrice || arrival.price,
    image: arrival.thumbnail || "/images/lamahwhiteb.png",
    isNew: true,
  };
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, arrivalsData] = await Promise.all([
          fetchProducts("Active"),
          fetchNewArrivals("Active"),
        ]);

        setProducts(productsData);
        setNewArrivals(arrivalsData);
      } catch (error) {
        console.error("Error loading shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const productCards = useMemo(
    () => products.map(normalizeProduct).filter((item): item is StorefrontCardItem => Boolean(item)),
    [products]
  );
  const arrivalCards = useMemo(
    () => newArrivals.map(normalizeArrival).filter((item): item is StorefrontCardItem => Boolean(item)),
    [newArrivals]
  );

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            px: { xs: 3, md: 6 },
            py: { xs: 14, md: 18 },
            background:
              "radial-gradient(circle at top left, rgba(57,255,20,0.14) 0%, transparent 28%), linear-gradient(180deg, #050505 0%, #0B0B0B 100%)",
            borderBottom: "1px solid rgba(57,255,20,0.08)",
          }}
        >
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chip
                label="DATABASE-DRIVEN CATALOG"
                sx={{
                  mb: 3,
                  bgcolor: "rgba(57,255,20,0.12)",
                  color: "#39FF14",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(57,255,20,0.2)",
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "3rem", md: "5.5rem" },
                  color: "#fff",
                  letterSpacing: "0.18em",
                  mb: 2,
                  lineHeight: 0.95,
                }}
              >
                SHOP ALL
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 760,
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  mb: 4,
                }}
              >
                Browse every active product and every active new arrival straight from your database in one polished storefront experience.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Chip
                  label={`${productCards.length} Products`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <Chip
                  label={`${arrivalCards.length} New Arrivals`}
                  sx={{
                    bgcolor: "rgba(57,255,20,0.1)",
                    color: "#39FF14",
                    border: "1px solid rgba(57,255,20,0.2)",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </Box>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 10 }}>
          {loading ? (
            <Box sx={{ py: 12, display: "flex", justifyContent: "center" }}>
              <CircularProgress sx={{ color: "#39FF14" }} />
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 10 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: { xs: "2.4rem", md: "3.5rem" },
                    color: "#fff",
                    letterSpacing: "0.1em",
                    mb: 1,
                  }}
                >
                  All Products
                </Typography>
                <Typography
                  sx={{
                    color: "#8E8E8E",
                    fontFamily: "Poppins, sans-serif",
                    mb: 4,
                  }}
                >
                  Every active product currently available in your catalog.
                </Typography>
                {productCards.length === 0 ? (
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
                      No active products found.
                    </Typography>
                    <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
                      Add or activate products in the admin dashboard and they will appear here automatically.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    {productCards.map((product, index) => (
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
              </Box>

              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: { xs: "2.4rem", md: "3.5rem" },
                    color: "#fff",
                    letterSpacing: "0.1em",
                    mb: 1,
                  }}
                >
                  New Arrivals
                </Typography>
                <Typography
                  sx={{
                    color: "#8E8E8E",
                    fontFamily: "Poppins, sans-serif",
                    mb: 4,
                  }}
                >
                  The latest drops pulled directly from your `newArrivals` collection.
                </Typography>
                {arrivalCards.length === 0 ? (
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
                      No active new arrivals found.
                    </Typography>
                    <Typography sx={{ color: "#8E8E8E", fontFamily: "Poppins, sans-serif" }}>
                      Once you publish new arrivals from the admin panel, they will show up here automatically.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    {arrivalCards.map((product, index) => (
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
              </Box>
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
