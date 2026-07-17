
"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
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
              ABOUT LAMAH
            </Typography>

            <Grid container spacing={6}>
              <Grid item xs={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      color: "#39FF14",
                      letterSpacing: "0.1em",
                      mb: 4,
                    }}
                  >
                    OUR STORY
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "#A0A0A0",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      mb: 4,
                    }}
                  >
                    Lamah Clothing Co. was born from a passion for street culture and premium craftsmanship.
                    We believe that fashion should be an expression of individuality and attitude.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "#A0A0A0",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                    }}
                  >
                    Every piece in our collection is designed with attention to detail, using only the finest materials.
                    From our signature hoodies to our exclusive accessories, we deliver quality that speaks for itself.
                  </Typography>
                </motion.div>
              </Grid>

              <Grid item xs={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      color: "#39FF14",
                      letterSpacing: "0.1em",
                      mb: 4,
                    }}
                  >
                    OUR VALUES
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#fff",
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      Quality First
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#A0A0A0",
                      }}
                    >
                      We never compromise on quality. Every product is made to last.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#fff",
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      Authentic Style
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#A0A0A0",
                      }}
                    >
                      Our designs are inspired by real street culture, not trends.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#fff",
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      Community Driven
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#A0A0A0",
                      }}
                    >
                      We build for the culture, not for the crowd.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
