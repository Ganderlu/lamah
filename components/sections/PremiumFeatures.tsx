"use client";

import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { Shield, Truck, CreditCard, RotateCcw, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Shield size={32} />,
    title: "Premium Quality",
    description: "Crafted with the finest materials for lasting comfort and style.",
  },
  {
    icon: <Truck size={32} />,
    title: "Fast Delivery",
    description: "Free shipping on all orders over $100, delivered in 2-3 days.",
  },
  {
    icon: <CreditCard size={32} />,
    title: "Secure Payment",
    description: "100% secure checkout with encrypted payment processing.",
  },
  {
    icon: <RotateCcw size={32} />,
    title: "Easy Returns",
    description: "30-day hassle-free returns and exchanges policy.",
  },
  {
    icon: <Headphones size={32} />,
    title: "24/7 Support",
    description: "Our team is always here to help you with any questions.",
  },
];

export default function PremiumFeatures() {
  return (
    <Box sx={{ py: 12, bgcolor: "#080808" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            color: "#fff",
            fontFamily: "Bebas Neue, cursive",
            mb: 10,
          }}
        >
          WHY LAMAH
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={2.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Paper
                  sx={{
                    p: 5,
                    bgcolor: "#111111",
                    border: "1px solid rgba(57,255,20,0.1)",
                    borderRadius: "16px",
                    textAlign: "center",
                    height: "100%",
                    "&:hover": {
                      borderColor: "rgba(57,255,20,0.4)",
                      boxShadow: "0 0 20px rgba(57,255,20,0.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box sx={{ color: "#39FF14", mb: 3, display: "flex", justifyContent: "center" }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "#fff",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
