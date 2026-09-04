"use client";

import { Box, Chip, Container, Typography, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { bestSellers } from "@/lib/constants/products";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BestSellers() {
  return (
    <Box
      sx={{
        py: { xs: 14, md: 20 },
        bgcolor: "#050505",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(57,255,20,0.25), transparent)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(255,140,57,0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "-8%",
          width: 450,
          height: 450,
          background:
            "radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ px: { xs: 2, md: 4, lg: 6 }, position: "relative" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 8, md: 12 },
              position: "relative",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <Chip
                icon={<Flame size={13} style={{ color: "#FF8B3D" }} />}
                label="MOST LOVED · CUSTOMER FAVORITES"
                sx={{
                  mb: { xs: 3, md: 4 },
                  bgcolor: "rgba(255,139,61,0.08)",
                  color: "#FF8B3D",
                  border: "1px solid rgba(255,139,61,0.2)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  fontSize: "0.7rem",
                  py: 0.8,
                  borderRadius: "999px",
                  "& .MuiChip-icon": { ml: 1.2, mr: 0.3 },
                  "& .MuiChip-label": { px: 2.2 },
                }}
              />
            </motion.div>

            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "3.1rem", sm: "4.5rem", md: "6rem" },
                letterSpacing: "0.02em",
                lineHeight: 0.9,
                mb: { xs: 3, md: 4 },
              }}
            >
              BEST{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #FF8B3D 0%, #FF5E3A 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 25px rgba(255,139,61,0.2))",
                }}
              >
                SELLERS
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                mx: "auto",
                color: "#9A9A9A",
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.8,
              }}
            >
              Movement-defining pieces loved by thousands. Our most-worn designs,
              proven through every season and every step you take.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <Box
            sx={{
              px: { xs: 0, md: 2 },
              pb: { xs: 2, md: 3 },
              "& .swiper": { position: "relative" },
              "& .swiper-button-next, & .swiper-button-prev": {
                color: "#39FF14",
                background: "rgba(12,12,12,0.9)",
                border: "1px solid rgba(57,255,20,0.2)",
                borderRadius: "14px",
                width: { xs: 42, md: 48 },
                height: { xs: 42, md: 48 },
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                "&:hover": {
                  background: "rgba(57,255,20,0.1)",
                  borderColor: "#39FF14",
                },
                "&::after": {
                  fontSize: { xs: "16px", md: "18px" },
                  fontWeight: 700,
                },
              },
              "& .swiper-button-next": { right: { xs: 4, md: -4 }, top: "44%" },
              "& .swiper-button-prev": { left: { xs: 4, md: -4 }, top: "44%" },
            }}
          >
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop
            speed={700}
            navigation
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 28 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
              1440: { slidesPerView: 4, spaceBetween: 36 },
            }}
          >
            {[...bestSellers, ...bestSellers].map((product, idx) => (
              <SwiperSlide key={`${product.id}-${idx}`} style={{ height: "auto" }}>
                <Box sx={{ py: 0.5 }}>
                  <ProductCard {...product} />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box
            sx={{
              mt: { xs: 8, md: 12 },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              component={Link}
              href="/shop"
              variant="contained"
              endIcon={<ArrowRight size={18} />}
              sx={{
                bgcolor: "#FF8B3D",
                color: "#050505",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                px: { xs: 4.5, md: 6.5 },
                py: 1.7,
                borderRadius: "14px",
                textTransform: "none",
                boxShadow: "0 12px 30px rgba(255,139,61,0.25)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#EF7A2C",
                  transform: "translateY(-1px)",
                  boxShadow: "0 18px 45px rgba(255,139,61,0.32)",
                },
              }}
            >
              Shop All Best Sellers
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
