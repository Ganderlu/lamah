"use client";

import { useState } from "react";
import { Box, Card, Typography, IconButton, Button, Snackbar, Alert } from "@mui/material";
import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
}

export default function ProductCard({ id, name, price, image, isNew = false }: ProductCardProps) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(id);

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    setOpenSnackbar(true);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, price, image });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            bgcolor: "#111111",
            border: "1px solid rgba(57,255,20,0.1)",
            "&:hover": {
              borderColor: "rgba(57,255,20,0.5)",
              boxShadow: "0 0 25px rgba(57,255,20,0.15)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {/* Product Image */}
          <Box sx={{ position: "relative", height: "320px" }}>
            <Image
              src={image}
              alt={name}
              fill
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
            />
            {isNew && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  bgcolor: "#39FF14",
                  color: "#050505",
                  px: 2,
                  py: 0.5,
                  borderRadius: 4,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "Poppins, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                NEW
              </Box>
            )}
            <IconButton
              onClick={handleToggleWishlist}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: "rgba(5,5,5,0.7)",
                color: isWishlisted ? "#39FF14" : "#fff",
                "&:hover": { bgcolor: "rgba(5,5,5,0.9)" },
              }}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </IconButton>
          </Box>

          {/* Product Info */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                mb: 1,
              }}
            >
              {name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#39FF14",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                }}
              >
                ${price.toFixed(2)}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Plus size={16} />}
                onClick={handleAddToCart}
                sx={{
                  borderColor: "rgba(57,255,20,0.5)",
                  color: "#39FF14",
                  "&:hover": {
                    borderColor: "#39FF14",
                    bgcolor: "rgba(57,255,20,0.1)",
                  },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Card>
      </motion.div>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Added to cart!
        </Alert>
      </Snackbar>
    </>
  );
}
