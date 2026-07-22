
"use client";

import { Box, Container, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchCollections } from "@/lib/collections";
import type { Collection } from "@/types/collection";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections();
        setCollections(data.filter(col => col.status === "Active"));
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

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
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "3rem", md: "5rem" },
                color: "#fff",
                letterSpacing: "0.2em",
                mb: 8,
                textAlign: "center",
              }}
            >
              COLLECTIONS
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                <CircularProgress sx={{ color: "#39FF14" }} />
              </Box>
            ) : (
              <Grid container spacing={6}>
                {collections.map((collection, index) => (
                  <Grid item xs={12} md={6} key={collection.id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/collections/${collection.slug}`} passHref style={{ textDecoration: "none" }}>
                        <Paper
                          sx={{
                            position: "relative",
                            height: 500,
                            borderRadius: "24px",
                            overflow: "hidden",
                            border: "2px solid rgba(57,255,20,0.2)",
                            boxShadow: "0 0 30px rgba(57,255,20,0.1)",
                            cursor: "pointer",
                            transition: "all 0.4s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 0 50px rgba(57,255,20,0.2)",
                            },
                          }}
                        >
                          <Box sx={{ position: "relative", height: "100%" }}>
                            <Image
                              src={collection.coverImage || "/images/lamahwhiteb.png"}
                              alt={collection.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "linear-gradient(to top, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.4) 100%)",
                                display: "flex",
                                alignItems: "flex-end",
                                p: 6,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h3"
                                  sx={{
                                    fontFamily: "Bebas Neue, cursive",
                                    color: "#fff",
                                    letterSpacing: "0.2em",
                                    mb: 1,
                                  }}
                                >
                                  {collection.name}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    color: "#39FF14",
                                  }}
                                >
                                  SHOP NOW →
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Link>
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
