"use client";

import { Box, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { bestSellers } from "@/lib/constants/products";

export default function BestSellers() {
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
          BEST SELLERS
        </Typography>

        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 },
          }}
        >
          {bestSellers.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
          {/* Duplicate to fill the slider */}
          {bestSellers.map((product) => (
            <SwiperSlide key={`${product.id}-dup`}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
}
