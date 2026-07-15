"use client";

import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  {
    title: "Men",
    description: "Premium streetwear for the modern man",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Women",
    description: "Elevated essentials for her",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Hoodies",
    description: "Comfort meets style",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Accessories",
    description: "Complete your look",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
  },
];

export default function Categories() {
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
            <Grid item xs={12} sm={6} lg={3} key={category.title}>
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
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                      className="group-hover:scale-110"
                    />
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
                      {category.title}
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
