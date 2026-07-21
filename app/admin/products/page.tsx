"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputBase,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Avatar,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Plus,
  Upload,
  Search,
  Filter,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products";
import { fetchCategories } from "@/lib/categories";
import Image from "next/image";

// Status Chip Component
const StatusChip = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
      case "Active":
        return { bg: "rgba(57,255,20,0.1)", color: "#39FF14" };
      case "Inactive":
        return { bg: "rgba(255,77,79,0.1)", color: "#FF4D4F" };
      case "Draft":
        return { bg: "rgba(158,158,158,0.1)", color: "#9E9E9E" };
      default:
        return { bg: "rgba(158,158,158,0.1)", color: "#9E9E9E" };
    }
  };

  const colors = getColor();

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontFamily: "Poppins, sans-serif",
        borderRadius: 1,
      }}
    />
  );
};

export default function AdminProductsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive" | "Draft"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    description: "",
    category: "",
    collection: "",
    brand: "",
    price: 0,
    discountPrice: undefined,
    stock: 0,
    weight: undefined,
    sizes: [],
    colors: [],
    tags: [],
    thumbnail: "",
    gallery: [],
    featured: false,
    status: "Draft",
  });
  const [tempSizes, setTempSizes] = useState("");
  const [tempColors, setTempColors] = useState("");
  const [tempTags, setTempTags] = useState("");

  // Fetch products and categories on load
  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(statusFilter),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  // Handle form changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Open create modal
  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "",
      collection: "",
      brand: "",
      price: 0,
      discountPrice: undefined,
      stock: 0,
      weight: undefined,
      sizes: [],
      colors: [],
      tags: [],
      thumbnail: "",
      gallery: [],
      featured: false,
      status: "Draft",
    });
    setTempSizes("");
    setTempColors("");
    setTempTags("");
    setOpenModal(true);
  };

  // Open edit modal
  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      ...product,
    });
    setTempSizes(product.sizes.join(", "));
    setTempColors(product.colors.join(", "));
    setTempTags(product.tags.join(", "));
    setOpenModal(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      // Parse arrays
      const finalData = {
        ...formData,
        sizes: tempSizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: tempColors.split(",").map((c) => c.trim()).filter(Boolean),
        tags: tempTags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (selectedProduct?.id) {
        await updateProduct(selectedProduct.id, finalData);
        setSnackbar({
          open: true,
          message: "Product updated successfully",
          severity: "success",
        });
      } else {
        await createProduct(finalData as Omit<Product, "id" | "createdAt" | "updatedAt">);
        setSnackbar({
          open: true,
          message: "Product created successfully",
          severity: "success",
        });
      }
      setOpenModal(false);
          loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save product",
        severity: "error",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (selectedProduct?.id) {
      try {
        await deleteProduct(selectedProduct.id);
        setSnackbar({
          open: true,
          message: "Product deleted successfully",
          severity: "success",
        });
        setOpenDeleteModal(false);
        loadData();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete product",
          severity: "error",
        });
      }
    }
  };

  // Handle Cloudinary upload success
  const handleCloudinaryUpload = (result: any, fieldName: "thumbnail" | "gallery", index?: number) => {
    if (result.event === "success" && result.info) {
      if (fieldName === "thumbnail") {
        setFormData((prev) => ({
          ...prev,
          thumbnail: result.info.secure_url,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), result.info.secure_url],
        }));
      }
      setSnackbar({
        open: true,
        message: "Image uploaded successfully",
        severity: "success",
      });
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Stats for summary cards
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 20).length;

  // Helper to get stock color
  const getStockColor = (stock: number) => {
    if (stock === 0) return "#FF4D4F";
    if (stock <= 20) return "#F5A623";
    return "#39FF14";
  };

  return (
    <Box sx={{ maxWidth: "1800px", mx: "auto", width: "100%", overflowX: "hidden" }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 3 }}>
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                color: "#fff",
                letterSpacing: "0.1em",
                mb: 1,
              }}
            >
              Products
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link href="/admin" passHref style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                  Dashboard
                </Typography>
              </Link>
              <Typography sx={{ color: "#9E9E9E" }}>›</Typography>
              <Typography sx={{ color: "#39FF14", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                Products
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Upload size={18} />}
              sx={{
                borderColor: "rgba(57,255,20,0.3)",
                color: "#39FF14",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  borderColor: "#39FF14",
                  bgcolor: "rgba(57,255,20,0.05)",
                },
              }}
            >
              Import Products
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleOpenCreateModal}
              sx={{
                bgcolor: "#39FF14",
                color: "#000",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#2dd610",
                },
              }}
            >
              Add New Product
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(17,17,17,1) 0%, rgba(9,9,9,1) 100%)",
                border: "1px solid rgba(57,255,20,0.15)",
                boxShadow: "0 0 30px rgba(57,255,20,0.05)",
                "&:hover": {
                  border: "1px solid rgba(57,255,20,0.3)",
                  boxShadow: "0 0 40px rgba(57,255,20,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9E9E9E",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Total Products
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                        mb: 1,
                      }}
                    >
                      {totalProducts}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(57,255,20,0.1)",
                      border: "2px solid rgba(57,255,20,0.2)",
                    }}
                  >
                    <Package color="#39FF14" size={28} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(17,17,17,1) 0%, rgba(9,9,9,1) 100%)",
                border: "1px solid rgba(57,255,20,0.15)",
                boxShadow: "0 0 30px rgba(57,255,20,0.05)",
                "&:hover": {
                  border: "1px solid rgba(57,255,20,0.3)",
                  boxShadow: "0 0 40px rgba(57,255,20,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9E9E9E",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Active Products
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                        mb: 1,
                      }}
                    >
                      {activeProducts}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(57,255,20,0.1)",
                      border: "2px solid rgba(57,255,20,0.2)",
                    }}
                  >
                    <CheckCircle2 color="#39FF14" size={28} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(17,17,17,1) 0%, rgba(9,9,9,1) 100%)",
                border: "1px solid rgba(57,255,20,0.15)",
                boxShadow: "0 0 30px rgba(57,255,20,0.05)",
                "&:hover": {
                  border: "1px solid rgba(57,255,20,0.3)",
                  boxShadow: "0 0 40px rgba(57,255,20,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9E9E9E",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Out of Stock
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                        mb: 1,
                      }}
                    >
                      {outOfStockProducts}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(255,77,79,0.1)",
                      border: "2px solid rgba(255,77,79,0.2)",
                    }}
                  >
                    <XCircle color="#FF4D4F" size={28} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(17,17,17,1) 0%, rgba(9,9,9,1) 100%)",
                border: "1px solid rgba(57,255,20,0.15)",
                boxShadow: "0 0 30px rgba(57,255,20,0.05)",
                "&:hover": {
                  border: "1px solid rgba(57,255,20,0.3)",
                  boxShadow: "0 0 40px rgba(57,255,20,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9E9E9E",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Low Stock
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                        mb: 1,
                      }}
                    >
                      {lowStockProducts}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(245,166,35,0.1)",
                      border: "2px solid rgba(245,166,35,0.2)",
                    }}
                  >
                    <AlertTriangle color="#F5A623" size={28} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card
          sx={{
            background: "#111111",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 3,
          }}
        >
          {/* Toolbar */}
          <Box sx={{ p: 3, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
              {/* Status Filter */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
                    border: "1px solid rgba(57,255,20,0.2)",
                    borderRadius: 2,
                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
                  }}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                </Select>
              </FormControl>
              {/* Search */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 2,
                  bgcolor: "rgba(5,5,5,0.5)",
                  px: 2,
                  py: 0.5,
                  flex: 1,
                  minWidth: 200,
                  border: "1px solid rgba(57,255,20,0.1)",
                }}
              >
                <Search size={18} color="#9E9E9E" />
                <InputBase
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    ml: 1.5,
                    flex: 1,
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    "& ::placeholder": {
                      color: "#9E9E9E",
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                sx={{
                  borderColor: "rgba(57,255,20,0.3)",
                  color: "#39FF14",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    borderColor: "#39FF14",
                    bgcolor: "rgba(57,255,20,0.05)",
                  },
                }}
              >
                Export
              </Button>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "rgba(57,255,20,0.1)" }} />

          {/* Table / Mobile Cards */}
          {loading ? (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif" }}>
                Loading products...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Desktop Table */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <TableContainer sx={{ maxHeight: "70vh" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgba(5,5,5,0.8)" }}>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          SKU
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Category
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Price
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Stock
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Featured
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Created
                        </TableCell>
                        <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedProducts.map((product) => (
                        <motion.tr
                          key={product.id}
                          whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              {product.thumbnail ? (
                                <Image
                                  src={product.thumbnail}
                                  alt={product.name}
                                  width={44}
                                  height={44}
                                  style={{ borderRadius: 8, objectFit: "cover" }}
                                />
                              ) : (
                                <Avatar sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#1a1a1a" }}>
                                  <ImageIcon size={20} color="#9E9E9E" />
                                </Avatar>
                              )}
                              <Box sx={{ maxWidth: 200 }}>
                                <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {product.name}
                                </Typography>
                                <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {product.description}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                            {product.sku}
                          </TableCell>
                          <TableCell sx={{ py: 2, color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                            {product.category}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Typography sx={{ color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                                ${product.price.toLocaleString()}
                              </Typography>
                              {product.discountPrice && (
                                <Typography sx={{ color: "#39FF14", fontSize: "0.75rem", fontFamily: "Inter, sans-serif" }}>
                                  ${product.discountPrice.toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ color: getStockColor(product.stock), fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                              {product.stock}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <StatusChip status={product.status} />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Switch
                              checked={product.featured}
                              onChange={async () => {
                                await updateProduct(product.id!, { featured: !product.featured });
                                loadProducts();
                              }}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#39FF14",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "rgba(57,255,20,0.3)",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2, color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#9E9E9E" }}
                                >
                                  <Eye size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#9E9E9E" }}
                                  onClick={() => handleOpenEditModal(product)}
                                >
                                  <Edit size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Duplicate">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#9E9E9E" }}
                                >
                                  <Copy size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#FF4D4F" }}
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setOpenDeleteModal(true);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Mobile Cards View */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid rgba(57,255,20,0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          width={56}
                          height={56}
                          style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 56, height: 56, borderRadius: 2, flexShrink: 0, bgcolor: "#1a1a1a" }}>
                          <ImageIcon size={24} color="#9E9E9E" />
                        </Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "1rem" }}>
                              {product.name}
                            </Typography>
                            <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif" }}>
                              {product.sku}
                            </Typography>
                          </Box>
                          <StatusChip status={product.status} />
                        </Box>
                        <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                          {product.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 2, borderTop: "1px solid rgba(57,255,20,0.08)" }}>
                      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Price
                          </Typography>
                          <Typography sx={{ color: "#fff", fontWeight: 700, fontFamily: "Inter, sans-serif", fontSize: "1rem" }}>
                            ${product.price.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Stock
                          </Typography>
                          <Typography sx={{ color: getStockColor(product.stock), fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem" }}>
                            {product.stock}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            sx={{ color: "#9E9E9E" }}
                            onClick={() => handleOpenEditModal(product)}
                          >
                            <Edit size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            sx={{ color: "#FF4D4F" }}
                            onClick={() => {
                              setSelectedProduct(product);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </>
          )}

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} products
              </Typography>
              <Pagination
                page={page}
                count={totalPages}
                onChange={(_, newPage) => setPage(newPage)}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#9E9E9E",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#39FF14 !important",
                    color: "#000 !important",
                  },
                }}
              />
            </Box>
          )}
        </Card>
      </motion.div>

      {/* Add/Edit Product Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: "#111111", color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, borderBottom: "1px solid rgba(57,255,20,0.1)" }}>
          {selectedProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#111111", p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SKU"
                  name="sku"
                  fullWidth
                  value={formData.sku}
                  onChange={handleFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "rgba(57,255,20,0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(57,255,20,0.4)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#39FF14",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#9E9E9E",
                  "&.Mui-focused": {
                    color: "#39FF14",
                  },
                },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(5,5,5,0.5)",
                      border: "1px solid rgba(57,255,20,0.2)",
                      borderRadius: 1,
                      ".MuiOutlinedInput-notchedOutline": { border: 0 },
                      "&:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#39FF14" },
                    }}
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Collection"
                  name="collection"
                  fullWidth
                  value={formData.collection}
                  onChange={handleFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Brand"
                  name="brand"
                  fullWidth
                  value={formData.brand}
                  onChange={handleFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleFormChange}
                  InputProps={{ startAdornment: <DollarSign size={16} color="#9E9E9E" style={{ marginRight: 8 }} /> }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Discount Price"
                  name="discountPrice"
                  type="number"
                  fullWidth
                  value={formData.discountPrice || ""}
                  onChange={handleFormChange}
                  InputProps={{ startAdornment: <DollarSign size={16} color="#9E9E9E" style={{ marginRight: 8 }} /> }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  fullWidth
                  value={formData.stock}
                  onChange={handleFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sizes (comma separated)"
                  fullWidth
                  value={tempSizes}
                  onChange={(e) => setTempSizes(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Colors (comma separated)"
                  fullWidth
                  value={tempColors}
                  onChange={(e) => setTempColors(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#9E9E9E",
                      "&.Mui-focused": {
                        color: "#39FF14",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={tempTags}
              onChange={(e) => setTempTags(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "rgba(57,255,20,0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(57,255,20,0.4)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#39FF14",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#9E9E9E",
                  "&.Mui-focused": {
                    color: "#39FF14",
                  },
                },
              }}
            />

            <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 1 }} />

            <Typography sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
              Media
            </Typography>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              {/* Thumbnail Upload */}
              <Card sx={{ flex: 1, p: 2, bgcolor: "rgba(5,5,5,0.5)", border: "1px dashed rgba(57,255,20,0.2)", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, cursor: "pointer", position: "relative" }}>
                {formData.thumbnail ? (
                  <>
                    <Image
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      fill
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                    <Box sx={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)" }}>
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER }}
                        onSuccess={(result) => handleCloudinaryUpload(result, "thumbnail")}
                      >
                        {({ open }) => (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => open()}
                            sx={{ bgcolor: "#39FF14", color: "#000", "&:hover": { bgcolor: "#2dd610" } }}
                          >
                            Change Thumbnail
                          </Button>
                        )}
                      </CldUploadWidget>
                    </Box>
                  </>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER }}
                    onSuccess={(result) => handleCloudinaryUpload(result, "thumbnail")}
                  >
                    {({ open }) => (
                      <Box onClick={() => open()} sx={{ textAlign: "center" }}>
                        <Upload size={32} color="#9E9E9E" />
                        <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                          Upload Thumbnail
                        </Typography>
                      </Box>
                    )}
                  </CldUploadWidget>
                )}
              </Card>

              {/* Gallery Upload */}
              <Card sx={{ flex: 2, p: 2, bgcolor: "rgba(5,5,5,0.5)", border: "1px dashed rgba(57,255,20,0.2)", borderRadius: 2, minHeight: 180 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {formData.gallery?.map((img, index) => (
                    <Box key={index} sx={{ width: 80, height: 80, position: "relative", borderRadius: 2, overflow: "hidden" }}>
                      <Image
                        src={img}
                        alt={`Gallery ${index}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                        }}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            gallery: prev.gallery?.filter((_, i) => i !== index) || [],
                          }));
                        }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Box>
                  ))}
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER }}
                    onSuccess={(result) => handleCloudinaryUpload(result, "gallery")}
                  >
                    {({ open }) => (
                      <Box
                        onClick={() => open()}
                        sx={{
                          width: 80,
                          height: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px dashed rgba(57,255,20,0.3)",
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { borderColor: "#39FF14" },
                        }}
                      >
                        <Plus size={24} color="#9E9E9E" />
                      </Box>
                    )}
                  </CldUploadWidget>
                </Box>
              </Card>
            </Box>

            <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>Featured:</Typography>
                  <Switch
                    checked={formData.featured || false}
                    onChange={(e) => handleSwitchChange("featured", e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#39FF14",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "rgba(57,255,20,0.3)",
                      },
                    }}
                  />
                </Box>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={formData.status || "Draft"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(5,5,5,0.5)",
                      border: "1px solid rgba(57,255,20,0.2)",
                      borderRadius: 1,
                      ".MuiOutlinedInput-notchedOutline": { border: 0 },
                      "&:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#39FF14" },
                    }}
                  >
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#111111", p: 2, borderTop: "1px solid rgba(57,255,20,0.1)" }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: "#39FF14", color: "#000", fontFamily: "Poppins, sans-serif", fontWeight: 600, "&:hover": { bgcolor: "#2dd610" } }}
          >
            {selectedProduct ? "Update Product" : "Publish Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle sx={{ bgcolor: "#111111", color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          Delete Product
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#111111" }}>
          <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif" }}>
            Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#111111" }}>
          <Button onClick={() => setOpenDeleteModal(false)} sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              color: "#FF4D4F",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              "&:hover": { bgcolor: "rgba(255,77,79,0.1)" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === "success" ? "rgba(57,255,20,0.1)" : "rgba(255,77,79,0.1)",
            color: snackbar.severity === "success" ? "#39FF14" : "#FF4D4F",
            border: `1px solid ${snackbar.severity === "success" ? "rgba(57,255,20,0.2)" : "rgba(255,77,79,0.2)"}`,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
