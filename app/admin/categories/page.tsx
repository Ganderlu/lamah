
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
  LayoutDashboard,
  Plus,
  Upload,
  Search,
  Filter,
  SortAsc,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  PlayCircle,
  PauseCircle,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  Box as BoxIcon,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Category } from "@/types/category";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories";
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

export default function AdminCategoriesPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "Draft">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
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
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
    status: "Draft",
    featured: false,
    sortOrder: 0,
    parentId: "",
    seoTitle: "",
    seoDescription: "",
    image: "",
    bannerImage: "",
  });

  // Fetch categories on load
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories(statusFilter);
      setCategories(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load categories",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [statusFilter]);

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setSelectedCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      status: "Draft",
      featured: false,
      sortOrder: 0,
      parentId: "",
      seoTitle: "",
      seoDescription: "",
      image: "",
      bannerImage: "",
    });
    setOpenModal(true);
  };

  // Open edit modal
  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      ...category,
    });
    setOpenModal(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      if (selectedCategory?.id) {
        await updateCategory(selectedCategory.id, formData);
        setSnackbar({
          open: true,
          message: "Category updated successfully",
          severity: "success",
        });
      } else {
        await createCategory(formData as Omit<Category, "id" | "createdAt" | "updatedAt">);
        setSnackbar({
          open: true,
          message: "Category created successfully",
          severity: "success",
        });
      }
      setOpenModal(false);
      loadCategories();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save category",
        severity: "error",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (selectedCategory?.id) {
      try {
        await deleteCategory(selectedCategory.id);
        setSnackbar({
          open: true,
          message: "Category deleted successfully",
          severity: "success",
        });
        setOpenDeleteModal(false);
        loadCategories();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete category",
          severity: "error",
        });
      }
    }
  };

  // Handle Cloudinary upload success
  const handleCloudinaryUpload = (result: any, fieldName: "image" | "bannerImage") => {
    if (result.event === "success" && result.info) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: result.info.secure_url,
      }));
      setSnackbar({
        open: true,
        message: "Image uploaded successfully",
        severity: "success",
      });
    }
  };

  // Filter categories by search query
  const filteredCategories = categories.filter((category) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(lowerQuery) ||
      category.description.toLowerCase().includes(lowerQuery) ||
      category.slug.toLowerCase().includes(lowerQuery)
    );
  });

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Stats for summary cards
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "Active").length;
  const inactiveCategories = categories.filter((c) => c.status === "Inactive").length;
  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
  const topCategories = [...categories]
    .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    .slice(0, 5);

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
              Categories
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link href="/admin" passHref style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                  Dashboard
                </Typography>
              </Link>
              <Typography sx={{ color: "#9E9E9E" }}>›</Typography>
              <Typography sx={{ color: "#39FF14", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                Categories
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
              Import Categories
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
              Add New Category
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
                      Total Categories
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
                      {totalCategories}
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
                    <FolderKanban color="#39FF14" size={28} />
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
                      Active Categories
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
                      {activeCategories}
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
                      Inactive Categories
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
                      {inactiveCategories}
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
                    <PauseCircle color="#FF4D4F" size={28} />
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
                    <ShoppingBag color="#39FF14" size={28} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left: Table */}
        <Grid item xs={12} lg={8}>
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
                      placeholder="Search categories..."
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
              </Box>
              <Divider sx={{ borderColor: "rgba(57,255,20,0.1)" }} />

              {/* Table / Mobile Cards */}
              {loading ? (
                <Box sx={{ p: 6, textAlign: "center" }}>
                  <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif" }}>
                    Loading categories...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <TableContainer sx={{ maxHeight: "70vh" }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow
                            sx={{
                              bgcolor: "rgba(5,5,5,0.8)",
                            }}
                          >
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Category
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Description
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Products
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Status
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Created At
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedCategories.map((category) => (
                            <motion.tr
                              key={category.id}
                              whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                            >
                              <TableCell sx={{ py: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  {category.image ? (
                                    <Image
                                      src={category.image}
                                      alt={category.name}
                                      width={44}
                                      height={44}
                                      style={{ borderRadius: 8, objectFit: "cover" }}
                                    />
                                  ) : (
                                    <Avatar sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#1a1a1a" }}>
                                      <BoxIcon size={20} color="#9E9E9E" />
                                    </Avatar>
                                  )}
                                  <Box>
                                    <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                                      {category.name}
                                    </Typography>
                                    <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif" }}>
                                      /{category.slug}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2, color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", maxWidth: 200 }}>
                                {category.description}
                              </TableCell>
                              <TableCell sx={{ py: 2, color: "#fff", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                                {category.productCount || 0}
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <StatusChip status={category.status} />
                              </TableCell>
                              <TableCell sx={{ py: 2, color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                                {new Date(category.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      sx={{ color: "#9E9E9E" }}
                                      onClick={() => handleOpenEditModal(category)}
                                    >
                                      <Edit size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      sx={{ color: "#FF4D4F" }}
                                      onClick={() => {
                                        setSelectedCategory(category);
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
                    {paginatedCategories.map((category) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid rgba(57,255,20,0.1)",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              width={56}
                              height={56}
                              style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                            />
                          ) : (
                            <Avatar sx={{ width: 56, height: 56, borderRadius: 2, flexShrink: 0, bgcolor: "#1a1a1a" }}>
                              <BoxIcon size={24} color="#9E9E9E" />
                            </Avatar>
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <Box>
                                <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "1rem" }}>
                                  {category.name}
                                </Typography>
                                <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif" }}>
                                  /{category.slug}
                                </Typography>
                              </Box>
                              <StatusChip status={category.status} />
                            </Box>
                            <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                              {category.description}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 2, borderTop: "1px solid rgba(57,255,20,0.08)" }}>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Products
                              </Typography>
                              <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Inter, sans-serif", fontSize: "1rem" }}>
                                {category.productCount || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                              <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Created
                              </Typography>
                              <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                                {new Date(category.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#9E9E9E" }}
                                  onClick={() => handleOpenEditModal(category)}
                                >
                                  <Edit size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#FF4D4F" }}
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setOpenDeleteModal(true);
                                  }}
                                >
                                  <Trash2 size={18} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </>
              )}

              {/* Pagination */}
              {!loading && filteredCategories.length > 0 && (
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                    Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredCategories.length)} of {filteredCategories.length} categories
                  </Typography>
                  <Pagination
                    page={page}
                    count={totalPages}
                    onChange={(_, newPage) => setPage(newPage)}
                    sx={{
                      ".MuiPaginationItem-root": {
                        color: "#9E9E9E",
                      },
                      ".Mui-selected": {
                        bgcolor: "#39FF14 !important",
                        color: "#000 !important",
                      },
                    }}
                  />
                </Box>
              )}
            </Card>
          </motion.div>
        </Grid>

        {/* Right: Analytics */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Category Overview Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ background: "#111111", border: "1px solid rgba(57,255,20,0.15)", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 3,
                    }}
                  >
                    Category Overview
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Box sx={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(57,255,20,0.1)" strokeWidth="16" />
                        {totalCategories > 0 && (
                          <>
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              fill="none"
                              stroke="#39FF14"
                              strokeWidth="16"
                              strokeDasharray={`${(activeCategories / totalCategories) * 2 * Math.PI * 70} ${2 * Math.PI * 70}`}
                              strokeLinecap="round"
                              transform="rotate(-90 80 80)"
                            />
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              fill="none"
                              stroke="#FF4D4F"
                              strokeWidth="16"
                              strokeDasharray={`${(inactiveCategories / totalCategories) * 2 * Math.PI * 70} ${2 * Math.PI * 70}`}
                              strokeDashoffset={`${-(activeCategories / totalCategories) * 2 * Math.PI * 70}`}
                              strokeLinecap="round"
                              transform="rotate(-90 80 80)"
                            />
                          </>
                        )}
                      </svg>
                      <Box sx={{ position: "absolute", textAlign: "center" }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontFamily: "Inter, sans-serif", fontSize: "2rem" }}>
                          {totalCategories}
                        </Typography>
                        <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif" }}>
                          Total
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#39FF14" }} />
                        <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                          Active
                        </Typography>
                      </Box>
                      <Typography sx={{ color: "#9E9E9E", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>
                        {activeCategories} ({totalCategories > 0 ? Math.round((activeCategories / totalCategories) * 100) : 0}%)
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#FF4D4F" }} />
                        <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                          Inactive
                        </Typography>
                      </Box>
                      <Typography sx={{ color: "#9E9E9E", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>
                        {inactiveCategories} ({totalCategories > 0 ? Math.round((inactiveCategories / totalCategories) * 100) : 0}%)
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Categories Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Card sx={{ background: "#111111", border: "1px solid rgba(57,255,20,0.15)", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 3,
                    }}
                  >
                    Top Categories (by products)
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {topCategories.map((cat, index) => {
                      const maxCount = topCategories[0]?.productCount || 1;
                      const percentage = ((cat.productCount || 0) / maxCount) * 100;
                      return (
                        <Box key={cat.id || index}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                              {cat.name}
                            </Typography>
                            <Typography sx={{ color: "#9E9E9E", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>
                              {cat.productCount || 0}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: 6,
                              bgcolor: "rgba(57,255,20,0.1)",
                              borderRadius: 3,
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                              style={{
                                height: "100%",
                                background: "#39FF14",
                                borderRadius: 3,
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Grid>
      </Grid>

      {/* Add/Edit Category Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "#111111", color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, borderBottom: "1px solid rgba(57,255,20,0.1)" }}>
          {selectedCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#111111", p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              label="Category Name"
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
            <TextField
              label="Slug"
              name="slug"
              fullWidth
              value={formData.slug}
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
            <FormControl fullWidth>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={(e) => handleFormChange({ target: { name: "status", value: e.target.value } } as any)}
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
            <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 1 }} />
            <Typography sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
              Media
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <Card sx={{ flex: 1, p: 2, bgcolor: "rgba(5,5,5,0.5)", border: "1px dashed rgba(57,255,20,0.2)", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, cursor: "pointer", position: "relative" }}>
                {formData.image ? (
                  <>
                    <Image
                      src={formData.image}
                      alt="Category preview"
                      fill
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                    <Box sx={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)" }}>
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        folder={process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}
                        onSuccess={(result) => handleCloudinaryUpload(result, "image")}
                      >
                        {({ open }) => (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => open()}
                            sx={{ bgcolor: "#39FF14", color: "#000", "&:hover": { bgcolor: "#2dd610" } }}
                          >
                            Change Image
                          </Button>
                        )}
                      </CldUploadWidget>
                    </Box>
                  </>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    folder={process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}
                    onSuccess={(result) => handleCloudinaryUpload(result, "image")}
                  >
                    {({ open }) => (
                      <Box onClick={() => open()} sx={{ textAlign: "center" }}>
                        <Upload size={32} color="#9E9E9E" />
                        <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                          Upload Category Image
                        </Typography>
                      </Box>
                    )}
                  </CldUploadWidget>
                )}
              </Card>
              <Card sx={{ flex: 1, p: 2, bgcolor: "rgba(5,5,5,0.5)", border: "1px dashed rgba(57,255,20,0.2)", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, cursor: "pointer", position: "relative" }}>
                {formData.bannerImage ? (
                  <>
                    <Image
                      src={formData.bannerImage}
                      alt="Banner preview"
                      fill
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                    <Box sx={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)" }}>
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        folder={process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}
                        onSuccess={(result) => handleCloudinaryUpload(result, "bannerImage")}
                      >
                        {({ open }) => (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => open()}
                            sx={{ bgcolor: "#39FF14", color: "#000", "&:hover": { bgcolor: "#2dd610" } }}
                          >
                            Change Banner
                          </Button>
                        )}
                      </CldUploadWidget>
                    </Box>
                  </>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    folder={process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}
                    onSuccess={(result) => handleCloudinaryUpload(result, "bannerImage")}
                  >
                    {({ open }) => (
                      <Box onClick={() => open()} sx={{ textAlign: "center" }}>
                        <Upload size={32} color="#9E9E9E" />
                        <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                          Upload Banner Image
                        </Typography>
                      </Box>
                    )}
                  </CldUploadWidget>
                )}
              </Card>
            </Box>
            <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 1 }} />
            <Typography sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
              Settings
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>Featured Category</Typography>
              <Switch
                checked={formData.featured || false}
                onChange={(e) => handleSwitchChange("featured", e.target.checked)}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#39FF14" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#39FF14" } }}
              />
            </Box>
            <TextField
              label="Sort Order"
              name="sortOrder"
              type="number"
              fullWidth
              value={formData.sortOrder || 0}
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
            <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 1 }} />
            <Typography sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
              SEO
            </Typography>
            <TextField
              label="SEO Title"
              name="seoTitle"
              fullWidth
              value={formData.seoTitle || ""}
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
            <TextField
              label="SEO Description"
              name="seoDescription"
              fullWidth
              multiline
              rows={2}
              value={formData.seoDescription || ""}
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#111111", p: 3, borderTop: "1px solid rgba(57,255,20,0.1)" }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: "#9E9E9E", textTransform: "none", fontFamily: "Poppins, sans-serif" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
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
            {selectedCategory ? "Update Category" : "Save Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle sx={{ bgcolor: "#111111", color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          Delete Category
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#111111" }}>
          <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", mb: 2, mt: 1 }}>
            Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
          </Typography>
          <Typography sx={{ color: "#FF4D4F", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
            Warning: All products in this category may be affected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#111111" }}>
          <Button onClick={() => setOpenDeleteModal(false)} sx={{ color: "#9E9E9E", textTransform: "none", fontFamily: "Poppins, sans-serif" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              bgcolor: "#FF4D4F",
              color: "#fff",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#e64547",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
