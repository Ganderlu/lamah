"use client";

import { useEffect, useState, use } from "react";
import {
  Box,
  Chip,
  Container,
  Typography,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ArrowLeft, ShoppingBag, Tag, Package, Ruler, Palette } from "lucide-react";
import { fetchProductById } from "@/lib/products";
import { fetchNewArrivalById } from "@/lib/newArrivals";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

type DisplayProduct = {
  id: string;
  name: string;
  sku?: string;
  brand?: string;
  description?: string;
  category?: string;
  collection?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sizes: string[];
  colors: string[];
  tags: string[];
  thumbnail?: string;
  gallery: string[];
  featured?: boolean;
  source: "products" | "newArrivals";
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<DisplayProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const [regularProduct, newArrival] = await Promise.all([
          fetchProductById(id),
          fetchNewArrivalById(id),
        ]);

        let displayProduct: DisplayProduct | null = null;

        if (regularProduct) {
          displayProduct = {
            id: regularProduct.id!,
            name: regularProduct.name,
            sku: regularProduct.sku,
            brand: regularProduct.brand,
            description: regularProduct.description,
            category: regularProduct.category,
            collection: regularProduct.collection,
            price: regularProduct.price,
            discountPrice: regularProduct.discountPrice,
            stock: regularProduct.stock,
            sizes: regularProduct.sizes || [],
            colors: regularProduct.colors || [],
            tags: regularProduct.tags || [],
            thumbnail: regularProduct.thumbnail,
            gallery: regularProduct.gallery || [],
            featured: regularProduct.featured,
            source: "products",
          };
        } else if (newArrival) {
          displayProduct = {
            id: newArrival.id!,
            name: newArrival.productName,
            sku: newArrival.sku,
            brand: undefined,
            description: newArrival.description,
            category: newArrival.category,
            collection: newArrival.collection,
            price: newArrival.price,
            discountPrice: newArrival.discountPrice,
            stock: newArrival.stock,
            sizes: newArrival.sizes || [],
            colors: newArrival.colors || [],
            tags: newArrival.tags || [],
            thumbnail: newArrival.thumbnail,
            gallery: newArrival.gallery || [],
            featured: newArrival.featured,
            source: "newArrivals",
          };
        }

        setProduct(displayProduct);

        if (displayProduct) {
          const images = [
            displayProduct.thumbnail,
            ...displayProduct.gallery,
          ].filter(Boolean) as string[];
          setSelectedImage(images[0] || "/images/lamahwhiteb.png");
          if (displayProduct.sizes.length > 0) {
            setSelectedSize(displayProduct.sizes[0]);
          }
          if (displayProduct.colors.length > 0) {
            setSelectedColor(displayProduct.colors[0]);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    await addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: selectedImage || product.thumbnail || "/images/lamahwhiteb.png",
    });

    setSnackbarMessage("Added to cart!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setSnackbarMessage("Removed from wishlist");
      setSnackbarSeverity("success");
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: selectedImage || product.thumbnail || "/images/lamahwhiteb.png",
      });
      setSnackbarMessage("Added to wishlist!");
      setSnackbarSeverity("success");
    }
    setSnackbarOpen(true);
  };

  const allImages = product
    ? [product.thumbnail, ...product.gallery].filter(Boolean) as string[]
    : [];

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const finalPrice = product?.discountPrice || product?.price || 0;
  const hasDiscount = product && product.discountPrice && product.discountPrice < product.price;
  const inStock = product && product.stock > 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            bgcolor: "#050505",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#39FF14" }} />
        </Box>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            bgcolor: "#050505",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 12,
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontFamily: "Bebas Neue, cursive",
              letterSpacing: "0.12em",
              mb: 3,
            }}
          >
            PRODUCT NOT FOUND
          </Typography>
          <Typography
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
              mb: 6,
              maxWidth: 520,
            }}
          >
            The product you are looking for does not exist or may have been removed from the catalog.
          </Typography>
          <Link href="/shop" passHref>
            <Button
              variant="contained"
              startIcon={<ArrowLeft size={18} />}
              sx={{
                bgcolor: "#39FF14",
                color: "#000",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                px: 5,
                py: 1.5,
                borderRadius: "14px",
                "&:hover": {
                  bgcolor: "#2FD10F",
                },
              }}
            >
              Back to Shop
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
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: { xs: 3, md: 5 } }}>
              <Link
                href="/shop"
                style={{ textDecoration: "none" }}
              >
                <Button
                  startIcon={<ArrowLeft size={18} />}
                  sx={{
                    color: "#8E8E8E",
                    fontFamily: "Poppins, sans-serif",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    px: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "#39FF14",
                    },
                  }}
                >
                  Back to Shop
                </Button>
              </Link>
            </Box>

            <Grid container spacing={{ xs: 4, md: 8 }}>
              <Grid item xs={12} lg={7}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <Box
                    sx={{
                      position: "sticky",
                      top: { md: 24 },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: "24px",
                        overflow: "hidden",
                        bgcolor: "#111111",
                        border: "1px solid rgba(57,255,20,0.1)",
                        aspectRatio: { xs: "4/5", md: "1/1" },
                        mb: 3,
                        "&:hover": {
                          borderColor: "rgba(57,255,20,0.3)",
                        },
                      }}
                    >
                      <Image
                        src={selectedImage || "/images/lamahwhiteb.png"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                      />
                      {hasDiscount && (
                        <Chip
                          label="SALE"
                          sx={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            bgcolor: "#EF4444",
                            color: "#fff",
                            fontWeight: 700,
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.08em",
                            px: 1.5,
                          }}
                        />
                      )}
                      {product.featured && (
                        <Chip
                          label="FEATURED"
                          sx={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            bgcolor: "#39FF14",
                            color: "#000",
                            fontWeight: 700,
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.08em",
                            px: 1.5,
                          }}
                        />
                      )}
                    </Box>

                    {allImages.length > 1 && (
                      <Grid container spacing={2}>
                        {allImages.map((img, idx) => (
                          <Grid item xs={3} sm={2} key={idx}>
                            <Box
                              onClick={() => setSelectedImage(img)}
                              sx={{
                                position: "relative",
                                borderRadius: "14px",
                                overflow: "hidden",
                                aspectRatio: "1/1",
                                cursor: "pointer",
                                border:
                                  selectedImage === img
                                    ? "2px solid #39FF14"
                                    : "1px solid rgba(255,255,255,0.06)",
                                bgcolor: "#111111",
                                transition: "all 0.25s ease",
                                "&:hover": {
                                  borderColor: "rgba(57,255,20,0.5)",
                                },
                              }}
                            >
                              <Image
                                src={img}
                                alt={`${product.name} ${idx + 1}`}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} lg={5}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Box sx={{ py: { xs: 0, md: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      {product.category && (
                        <Chip
                          label={product.category}
                          icon={<Tag size={14} style={{ color: "#39FF14" }} />}
                          sx={{
                            bgcolor: "rgba(57,255,20,0.08)",
                            color: "#39FF14",
                            border: "1px solid rgba(57,255,20,0.2)",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                          }}
                        />
                      )}
                      {product.collection && (
                        <Chip
                          label={product.collection}
                          icon={<Package size={14} style={{ color: "#fff" }} />}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.04)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="h1"
                      sx={{
                        fontFamily: "Bebas Neue, cursive",
                        fontSize: { xs: "2.5rem", md: "3.8rem" },
                        color: "#fff",
                        letterSpacing: "0.1em",
                        lineHeight: 0.95,
                        mb: 2,
                      }}
                    >
                      {product.name}
                    </Typography>

                    {product.brand && (
                      <Typography
                        sx={{
                          color: "#8E8E8E",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.95rem",
                          mb: 3,
                        }}
                      >
                        Brand: <span style={{ color: "#fff" }}>{product.brand}</span>
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 2.5,
                        mb: 4,
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          color: "#39FF14",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          fontSize: { xs: "2.2rem", md: "2.8rem" },
                          lineHeight: 1,
                        }}
                      >
                        {formatCurrency(finalPrice)}
                      </Typography>
                      {hasDiscount && (
                        <Typography
                          sx={{
                            color: "#7A7A7A",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1.4rem",
                            textDecoration: "line-through",
                            pb: 0.5,
                          }}
                        >
                          {formatCurrency(product.price)}
                        </Typography>
                      )}
                    </Box>

                    {product.description && (
                      <Box sx={{ mb: 5 }}>
                        <Typography
                          sx={{
                            color: "#CFCFCF",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                            lineHeight: 1.8,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {product.description}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 5 }} />

                    {product.sizes.length > 0 && (
                      <Box sx={{ mb: 5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Ruler size={16} style={{ color: "#39FF14" }} />
                          <Typography
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 600,
                              fontSize: "1rem",
                            }}
                          >
                            Size
                          </Typography>
                          {selectedSize && (
                            <Typography
                              sx={{
                                color: "#8E8E8E",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.875rem",
                              }}
                            >
                              : {selectedSize}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1.5,
                          }}
                        >
                          {product.sizes.map((size) => (
                            <Chip
                              key={size}
                              label={size}
                              onClick={() => setSelectedSize(size)}
                              sx={{
                                cursor: "pointer",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                px: 1.5,
                                py: 0.8,
                                bgcolor:
                                  selectedSize === size
                                    ? "#39FF14"
                                    : "rgba(255,255,255,0.04)",
                                color:
                                  selectedSize === size
                                    ? "#000"
                                    : "#fff",
                                border:
                                  selectedSize === size
                                    ? "1px solid #39FF14"
                                    : "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "12px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor:
                                    selectedSize === size
                                      ? "#39FF14"
                                      : "rgba(57,255,20,0.4)",
                                  bgcolor:
                                    selectedSize === size
                                      ? "#39FF14"
                                      : "rgba(57,255,20,0.06)",
                                },
                                "& .MuiChip-label": {
                                  px: 2,
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {product.colors.length > 0 && (
                      <Box sx={{ mb: 5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Palette size={16} style={{ color: "#39FF14" }} />
                          <Typography
                            sx={{
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 600,
                              fontSize: "1rem",
                            }}
                          >
                            Color
                          </Typography>
                          {selectedColor && (
                            <Typography
                              sx={{
                                color: "#8E8E8E",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.875rem",
                              }}
                            >
                              : {selectedColor}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1.5,
                          }}
                        >
                          {product.colors.map((color) => (
                            <Chip
                              key={color}
                              label={color}
                              onClick={() => setSelectedColor(color)}
                              sx={{
                                cursor: "pointer",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                px: 1.5,
                                py: 0.8,
                                bgcolor:
                                  selectedColor === color
                                    ? "#39FF14"
                                    : "rgba(255,255,255,0.04)",
                                color:
                                  selectedColor === color
                                    ? "#000"
                                    : "#fff",
                                border:
                                  selectedColor === color
                                    ? "1px solid #39FF14"
                                    : "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "12px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor:
                                    selectedColor === color
                                      ? "#39FF14"
                                      : "rgba(57,255,20,0.4)",
                                  bgcolor:
                                    selectedColor === color
                                      ? "#39FF14"
                                      : "rgba(57,255,20,0.06)",
                                },
                                "& .MuiChip-label": {
                                  px: 2,
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ mb: 5 }}>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontSize: "1rem",
                          mb: 2,
                        }}
                      >
                        Quantity
                      </Typography>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          bgcolor: "rgba(255,255,255,0.02)",
                          overflow: "hidden",
                        }}
                      >
                        <IconButton
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          sx={{
                            color: "#fff",
                            p: 1.8,
                            borderRadius: 0,
                            "&:hover": {
                              bgcolor: "rgba(57,255,20,0.08)",
                              color: "#39FF14",
                            },
                            "&.Mui-disabled": {
                              color: "#4A4A4A",
                            },
                          }}
                        >
                          <Minus size={18} />
                        </IconButton>
                        <Box
                          sx={{
                            minWidth: 60,
                            textAlign: "center",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            color: "#fff",
                            fontSize: "1.1rem",
                          }}
                        >
                          {quantity}
                        </Box>
                        <IconButton
                          onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                          disabled={product.stock > 0 ? quantity >= product.stock : false}
                          sx={{
                            color: "#fff",
                            p: 1.8,
                            borderRadius: 0,
                            "&:hover": {
                              bgcolor: "rgba(57,255,20,0.08)",
                              color: "#39FF14",
                            },
                            "&.Mui-disabled": {
                              color: "#4A4A4A",
                            },
                          }}
                        >
                          <Plus size={18} />
                        </IconButton>
                      </Box>
                      {product.stock > 0 && (
                        <Typography
                          sx={{
                            color: "#8E8E8E",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                            mt: 1.5,
                          }}
                        >
                          {product.stock} item{product.stock !== 1 ? "s" : ""} in stock
                        </Typography>
                      )}
                      {product.stock === 0 && (
                        <Typography
                          sx={{
                            color: "#EF4444",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                            mt: 1.5,
                            fontWeight: 500,
                          }}
                        >
                          Out of stock
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<ShoppingBag size={20} />}
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        sx={{
                          flex: { xs: "1 1 100%", sm: "1 1 auto" },
                          bgcolor: "#39FF14",
                          color: "#000",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                          px: 5,
                          py: 1.8,
                          borderRadius: "16px",
                          minHeight: 54,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "#2FD10F",
                            transform: "translateY(-1px)",
                            boxShadow: "0 8px 24px rgba(57,255,20,0.25)",
                          },
                          "&.Mui-disabled": {
                            bgcolor: "#2A2A2A",
                            color: "#5A5A5A",
                          },
                        }}
                      >
                        {!inStock ? "Out of Stock" : "Add to Cart"}
                      </Button>
                      <IconButton
                        onClick={handleToggleWishlist}
                        sx={{
                          bgcolor: isWishlisted
                            ? "rgba(57,255,20,0.12)"
                            : "rgba(255,255,255,0.04)",
                          border: isWishlisted
                            ? "1px solid #39FF14"
                            : "1px solid rgba(255,255,255,0.08)",
                          color: isWishlisted ? "#39FF14" : "#fff",
                          borderRadius: "16px",
                          p: 2.3,
                          minHeight: 54,
                          minWidth: 54,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            bgcolor: "rgba(57,255,20,0.1)",
                            borderColor: "rgba(57,255,20,0.4)",
                            color: "#39FF14",
                          },
                        }}
                      >
                        <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
                      </IconButton>
                    </Box>

                    {product.tags.length > 0 && (
                      <>
                        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 4 }} />
                        <Box>
                          <Typography
                            sx={{
                              color: "#8E8E8E",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.9rem",
                              mb: 2,
                            }}
                          >
                            Tags
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {product.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={`#${tag}`}
                                sx={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "0.8rem",
                                  fontWeight: 500,
                                  bgcolor: "rgba(255,255,255,0.03)",
                                  color: "#A0A0A0",
                                  border: "1px solid rgba(255,255,255,0.05)",
                                  borderRadius: "10px",
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </>
                    )}

                    {product.sku && (
                      <Box sx={{ mt: 5 }}>
                        <Typography
                          sx={{
                            color: "#6A6A6A",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.85rem",
                          }}
                        >
                          SKU: {product.sku}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "14px",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
}
