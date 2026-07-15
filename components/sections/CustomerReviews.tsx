"use client";

import { Box, Container, Typography, Grid, Paper, Avatar } from "@mui/material";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The quality is insane. I’ve never felt more comfortable in streetwear. Lamah is my new go-to brand!",
  },
  {
    name: "Sarah Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Fast shipping and the fit is perfect. The neon green accents are so clean without being over the top.",
  },
  {
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Premium feel at an accessible price. Customer service was amazing when I needed to exchange sizes.",
  },
];

export default function CustomerReviews() {
  return (
    <Box sx={{ py: 12, bgcolor: "#080808" }}>
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
          WHAT OUR CUSTOMERS SAY
        </Typography>

        <Grid container spacing={4}>
          {reviews.map((review, index) => (
            <Grid item key={index} xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Paper
                  sx={{
                    p: 5,
                    bgcolor: "#111111",
                    border: "1px solid rgba(57,255,20,0.1)",
                    borderRadius: "16px",
                    height: "100%",
                  }}
                >
                  <Box sx={{ color: "#39FF14", mb: 3 }}>
                    <Quote size={28} />
                  </Box>
                  <Typography variant="body1" sx={{ color: "#fff", mb: 4 }}>
                    &ldquo;{review.text}&rdquo;
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={review.avatar} alt={review.name} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }}>
                        {review.name}
                      </Typography>
                      <Box sx={{ color: "#39FF14", mt: 0.5 }}>
                        {"★".repeat(review.rating)}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
