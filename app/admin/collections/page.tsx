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
  Tab,
  Tabs,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  LayoutDashboard,
  Plus,
  Upload,
  Search,
  Filter,
  SortAsc,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  ShoppingBag,
  Package,
  MoreVertical,
  X,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Collection } from "@/types/collection";
import type { Product } from "@/types/product";
import {
  fetchCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/lib/collections";
import { fetchProducts } from "@/lib/products";
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

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "Draft">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);

  // Form data
  const [formData, setFormData] = useState<Partial<Collection>>({
    name: "",
    slug: "",
    description: "",
    status: "Draft",
    featured: false,
    productIds: [],
    coverImage: "",
    bannerImage: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const PAGE_SIZE = 10;

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [collectionsData, productsData] = await Promise.all([
        fetchCollections(statusFilter),
        fetchProducts(),
      ]);
      setCollections(collectionsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading data:", error);
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

  // Filter collections
  const filteredCollections = collections.filter((col) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      col.name.toLowerCase().includes(lowerQuery) ||
      col.description.toLowerCase().includes(lowerQuery) ||
      col.slug.toLowerCase().includes(lowerQuery)
    );
  });

  const paginatedCollections = filteredCollections.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(filteredCollections.length / PAGE_SIZE));

  // Helper to generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (name === "name" && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Create collection
  const handleCreateCollection = async () => {
    try {
      await createCollection(formData as Omit<Collection, "id" | "createdAt" | "updatedAt">);
      setSnackbar({
        open: true,
        message: "Collection created successfully!",
        severity: "success",
      });
      setOpenCreateDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create collection",
        severity: "error",
      });
    }
  };

  // Edit collection
  const handleOpenEdit = (col: Collection) => {
    setSelectedCollection(col);
    setFormData({ ...col });
    setOpenEditDialog(true);
  };

  const handleUpdateCollection = async () => {
    if (!selectedCollection?.id) return;
    try {
      await updateCollection(selectedCollection.id, formData);
      setSnackbar({
        open: true,
        message: "Collection updated successfully!",
        severity: "success",
      });
      setOpenEditDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update collection",
        severity: "error",
      });
    }
  };

  // Delete collection
  const handleOpenDelete = (col: Collection) => {
    setSelectedCollection(col);
    setOpenDeleteDialog(true);
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollection?.id) return;
    try {
      await deleteCollection(selectedCollection.id);
      setSnackbar({
        open: true,
        message: "Collection deleted successfully!",
        severity: "success",
      });
      setOpenDeleteDialog(false);
      setSelectedCollection(null);
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete collection",
        severity: "error",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      status: "Draft",
      featured: false,
      productIds: [],
      coverImage: "",
      bannerImage: "",
      seoTitle: "",
      seoDescription: "",
    });
    setSelectedProductIds([]);
  };

  // Product management
  const handleOpenAddProducts = (col: Collection) => {
    setSelectedCollection(col);
    setSelectedProductIds([...col.productIds]);
    setOpenAddProductDialog(true);
  };

  const handleAddProducts = async () => {
    if (!selectedCollection?.id) return;
    try {
      await updateCollection(selectedCollection.id, {
        productIds: selectedProductIds,
      });
      setSnackbar({
        open: true,
        message: "Products added to collection!",
        severity: "success",
      });
      setOpenAddProductDialog(false);
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add products",
        severity: "error",
      });
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!selectedCollection?.id) return;
    try {
      const updatedProductIds = selectedCollection.productIds.filter(id => id !== productId);
      await updateCollection(selectedCollection.id, {
        productIds: updatedProductIds,
      });
      setSelectedCollection({
        ...selectedCollection,
        productIds: updatedProductIds,
      });
      setSnackbar({
        open: true,
        message: "Product removed from collection!",
        severity: "success",
      });
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to remove product",
        severity: "error",
      });
    }
  };

  // Get products for selected collection
  const getSelectedCollectionProducts = () => {
    if (!selectedCollection) return [];
    return products.filter(p => selectedCollection.productIds.includes(p.id || ""));
  };

  // Filter available products for dialog
  const filteredAvailableProducts = products.filter((p) => {
    if (!productSearchQuery) return true;
    return p.name.toLowerCase().includes(productSearchQuery.toLowerCase());
  });

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
              Collections
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link href="/admin" passHref style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                  Dashboard
                </Typography>
              </Link>
              <Typography sx={{ color: "#9E9E9E" }}>›</Typography>
              <Typography sx={{ color: "#39FF14", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                Collections
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ShoppingBag size={18} />}
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
              View Products
            </Button>
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
              Import Collections
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => {
                resetForm();
                setSelectedCollection(null);
                setOpenCreateDialog(true);
              }}
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
              Add New Collection
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
                      Total Collections
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
                      {collections.length}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography sx={{ color: "#39FF14", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                        +20%
                      </Typography>
                    </Box>
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
                    <Star color="#39FF14" size={28} />
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
                      Products Assigned
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
                      {collections.reduce((sum, c) => sum + c.productIds.length, 0)}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography sx={{ color: "#39FF14", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                        +18%
                      </Typography>
                    </Box>
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
                      Collection Views
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
                      2,450
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography sx={{ color: "#39FF14", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                        +22%
                      </Typography>
                    </Box>
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
                    <Eye color="#39FF14" size={28} />
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
                      Orders from Collections
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
                      320
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography sx={{ color: "#39FF14", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                        +15%
                      </Typography>
                    </Box>
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

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left: Collections Table */}
        <Grid item xs={12} lg={selectedCollection ? 8 : 12}>
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
              {/* Search & Filter Bar */}
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
                      py: 0.75,
                      flex: 1,
                      minWidth: 200,
                      border: "1px solid rgba(57,255,20,0.1)",
                    }}
                  >
                    <Search size={18} color="#9E9E9E" />
                    <InputBase
                      placeholder="Search collections..."
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
                    startIcon={<Filter size={16} />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "rgba(57,255,20,0.3)",
                      color: "#39FF14",
                      textTransform: "none",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "rgba(57,255,20,0.3)",
                      color: "#9E9E9E",
                      textTransform: "none",
                      fontFamily: "Poppins, sans-serif",
                    }}
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("All");
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ borderColor: "rgba(57,255,20,0.1)" }} />

              {/* Table */}
              {loading ? (
                <Box sx={{ p: 6, textAlign: "center" }}>
                  <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif" }}>
                    Loading collections...
                  </Typography>
                </Box>
              ) : paginatedCollections.length === 0 ? (
                <Box sx={{ p: 8, textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    No Collections Found
                  </Typography>
                  <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", mb: 3 }}>
                    Create your first product collection
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={() => {
                      resetForm();
                      setOpenCreateDialog(true);
                    }}
                    sx={{
                      bgcolor: "#39FF14",
                      color: "#000",
                      textTransform: "none",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Add Collection
                  </Button>
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
                              Collection
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Products
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Status
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Created Date
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedCollections.map((col) => (
                            <motion.tr
                              key={col.id}
                              whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                              onClick={() => setSelectedCollection(col)}
                              style={{ cursor: "pointer" }}
                            >
                              <TableCell sx={{ py: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  {col.coverImage ? (
                                    <Image
                                      src={col.coverImage}
                                      alt={col.name}
                                      width={44}
                                      height={44}
                                      style={{ borderRadius: 8, objectFit: "cover" }}
                                    />
                                  ) : (
                                    <Avatar sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#1a1a1a" }}>
                                      <Star size={20} color="#9E9E9E" />
                                    </Avatar>
                                  )}
                                  <Box>
                                    <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                                      {col.name}
                                    </Typography>
                                    <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif" }}>
                                      {col.description.length > 50 ? `${col.description.substring(0, 50)}...` : col.description}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2, color: "#fff", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                                {col.productIds.length} Products
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <StatusChip status={col.status} />
                              </TableCell>
                              <TableCell sx={{ py: 2, color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                                {new Date(col.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <Tooltip title="View">
                                    <IconButton
                                      size="small"
                                      sx={{ color: "#9E9E9E" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCollection(col);
                                      }}
                                    >
                                      <Eye size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      sx={{ color: "#9E9E9E" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEdit(col);
                                      }}
                                    >
                                      <Edit size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      sx={{ color: "#FF4D4F" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDelete(col);
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
                    {paginatedCollections.map((col) => (
                      <motion.div
                        key={col.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedCollection(col)}
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid rgba(57,255,20,0.1)",
                          cursor: "pointer",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                          {col.coverImage ? (
                            <Image
                              src={col.coverImage}
                              alt={col.name}
                              width={56}
                              height={56}
                              style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                            />
                          ) : (
                            <Avatar sx={{ width: 56, height: 56, borderRadius: 2, flexShrink: 0, bgcolor: "#1a1a1a" }}>
                              <Star size={24} color="#9E9E9E" />
                            </Avatar>
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <Box>
                                <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "1rem" }}>
                                  {col.name}
                                </Typography>
                              </Box>
                              <StatusChip status={col.status} />
                            </Box>
                            <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                              {col.description}
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
                                {col.productIds.length}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                sx={{ color: "#9E9E9E" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(col);
                                }}
                              >
                                <Edit size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                sx={{ color: "#FF4D4F" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDelete(col);
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
              {!loading && filteredCollections.length > 0 && (
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                    Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredCollections.length)} of {filteredCollections.length} collections
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

        {/* Right: Collection Details Panel */}
        {selectedCollection && (
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ background: "#111111", border: "1px solid rgba(57,255,20,0.15)", borderRadius: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Panel Header */}
                  <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(57,255,20,0.1)" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Collection Details
                    </Typography>
                    <IconButton
                      onClick={() => setSelectedCollection(null)}
                      sx={{ color: "#9E9E9E" }}
                    >
                      <X size={20} />
                    </IconButton>
                  </Box>

                  {/* Collection Cover */}
                  <Box sx={{ p: 3 }}>
                    {selectedCollection.coverImage && (
                      <Box sx={{ mb: 3, borderRadius: 3, overflow: "hidden" }}>
                        <Image
                          src={selectedCollection.coverImage}
                          alt={selectedCollection.name}
                          width={400}
                          height={200}
                          style={{ width: "100%", height: "auto", objectFit: "cover" }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontFamily: "Poppins, sans-serif",
                        mb: 1,
                      }}
                    >
                      {selectedCollection.name}
                    </Typography>
                    <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", mb: 2 }}>
                      {selectedCollection.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <Chip label={`${selectedCollection.productIds.length} Products`} sx={{ bgcolor: "rgba(57,255,20,0.1)", color: "#39FF14" }} />
                      <StatusChip status={selectedCollection.status} />
                      {selectedCollection.featured && (
                        <Chip label="Featured" sx={{ bgcolor: "rgba(245,166,35,0.1)", color: "#F5A623" }} />
                      )}
                    </Box>
                    <Typography sx={{ color: "#666", fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                      Created: {new Date(selectedCollection.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "rgba(57,255,20,0.1)" }} />

                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: "rgba(57,255,20,0.1)" }}>
                    <Tabs
                      value={selectedTab}
                      onChange={(_, newValue) => setSelectedTab(newValue)}
                      sx={{
                        "& .MuiTab-root": {
                          color: "#9E9E9E",
                          textTransform: "none",
                          fontFamily: "Poppins, sans-serif",
                        },
                        "& .Mui-selected": {
                          color: "#39FF14 !important",
                        },
                        "& .MuiTabs-indicator": {
                          bgcolor: "#39FF14",
                        },
                      }}
                    >
                      <Tab label="Products" />
                      <Tab label="Details" />
                    </Tabs>
                  </Box>

                  {/* Tab Content */}
                  <Box sx={{ p: 3, maxHeight: "400px", overflowY: "auto" }}>
                    {selectedTab === 0 ? (
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                            Products in Collection
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Plus size={14} />}
                            onClick={() => handleOpenAddProducts(selectedCollection)}
                            sx={{
                              bgcolor: "#39FF14",
                              color: "#000",
                              textTransform: "none",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            Add Product
                          </Button>
                        </Box>
                        {getSelectedCollectionProducts().length === 0 ? (
                          <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif" }}>
                              No products in this collection
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {getSelectedCollectionProducts().map((product) => (
                              <Box key={product.id} sx={{ p: 2, bgcolor: "rgba(5,5,5,0.5)", borderRadius: 2, border: "1px solid rgba(57,255,20,0.1)" }}>
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                  {product.thumbnail ? (
                                    <Image
                                      src={product.thumbnail}
                                      alt={product.name}
                                      width={50}
                                      height={50}
                                      style={{ borderRadius: 8, objectFit: "cover" }}
                                    />
                                  ) : (
                                    <Avatar sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: "#1a1a1a" }}>
                                      <Package size={20} color="#9E9E9E" />
                                    </Avatar>
                                  )}
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {product.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                      <Typography sx={{ color: "#fff", fontWeight: 700, fontFamily: "Inter, sans-serif", fontSize: "0.875rem" }}>
                                        ${product.price.toLocaleString()}
                                      </Typography>
                                      <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif" }}>
                                        • Stock: {product.stock}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <IconButton
                                    size="small"
                                    sx={{ color: "#FF4D4F" }}
                                    onClick={() => product.id && handleRemoveProduct(product.id)}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                          <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.5 }}>
                            Slug
                          </Typography>
                          <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                            {selectedCollection.slug}
                          </Typography>
                        </Box>
                        {selectedCollection.seoTitle && (
                          <Box>
                            <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.5 }}>
                              SEO Title
                            </Typography>
                            <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                              {selectedCollection.seoTitle}
                            </Typography>
                          </Box>
                        )}
                        {selectedCollection.seoDescription && (
                          <Box>
                            <Typography sx={{ color: "#9E9E9E", fontSize: "0.75rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.5 }}>
                              SEO Description
                            </Typography>
                            <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                              {selectedCollection.seoDescription}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>

      {/* Create Collection Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", bgcolor: "#090909" }}>
          Create New Collection
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#090909", pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Collection Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <TextField
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleFormChange}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CldUploadWidget
                  uploadPreset="ml_default"
                  onSuccess={(result) => {
                    if (result.info && typeof result.info !== "string") {
                      setFormData((prev) => ({
                        ...prev,
                        coverImage: result.info.secure_url,
                      }));
                      setSnackbar({
                        open: true,
                        message: "Cover image uploaded!",
                        severity: "success",
                      });
                    }
                  }}
                >
                  {({ open }) => (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => open()}
                      startIcon={<Upload size={16} />}
                      sx={{
                        borderColor: formData.coverImage ? "#39FF14" : "rgba(57,255,20,0.3)",
                        color: formData.coverImage ? "#39FF14" : "#9E9E9E",
                        textTransform: "none",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {formData.coverImage ? "Cover Image Added" : "Upload Cover Image"}
                    </Button>
                  )}
                </CldUploadWidget>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CldUploadWidget
                  uploadPreset="ml_default"
                  onSuccess={(result) => {
                    if (result.info && typeof result.info !== "string") {
                      setFormData((prev) => ({
                        ...prev,
                        bannerImage: result.info.secure_url,
                      }));
                      setSnackbar({
                        open: true,
                        message: "Banner image uploaded!",
                        severity: "success",
                      });
                    }
                  }}
                >
                  {({ open }) => (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => open()}
                      startIcon={<Upload size={16} />}
                      sx={{
                        borderColor: formData.bannerImage ? "#39FF14" : "rgba(57,255,20,0.3)",
                        color: formData.bannerImage ? "#39FF14" : "#9E9E9E",
                        textTransform: "none",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {formData.bannerImage ? "Banner Added" : "Upload Banner"}
                    </Button>
                  )}
                </CldUploadWidget>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    sx={{
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(57,255,20,0.2)" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(57,255,20,0.4)" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#39FF14" },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                  Featured
                </Typography>
                <Switch
                  checked={formData.featured}
                  onChange={(e) => handleSwitchChange("featured", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#39FF14",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#39FF14",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              label="SEO Title"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleFormChange}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <TextField
              label="SEO Description"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleFormChange}
              multiline
              rows={2}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#090909", px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenCreateDialog(false)}
            sx={{ color: "#9E9E9E", textTransform: "none", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCollection}
            sx={{
              bgcolor: "#39FF14",
              color: "#000",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Create Collection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", bgcolor: "#090909" }}>
          Edit Collection
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#090909", pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Collection Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <TextField
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleFormChange}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CldUploadWidget
                  uploadPreset="ml_default"
                  onSuccess={(result) => {
                    if (result.info && typeof result.info !== "string") {
                      setFormData((prev) => ({
                        ...prev,
                        coverImage: result.info.secure_url,
                      }));
                    }
                  }}
                >
                  {({ open }) => (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => open()}
                      startIcon={<Upload size={16} />}
                      sx={{
                        borderColor: formData.coverImage ? "#39FF14" : "rgba(57,255,20,0.3)",
                        color: formData.coverImage ? "#39FF14" : "#9E9E9E",
                        textTransform: "none",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {formData.coverImage ? "Change Cover" : "Upload Cover"}
                    </Button>
                  )}
                </CldUploadWidget>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CldUploadWidget
                  uploadPreset="ml_default"
                  onSuccess={(result) => {
                    if (result.info && typeof result.info !== "string") {
                      setFormData((prev) => ({
                        ...prev,
                        bannerImage: result.info.secure_url,
                      }));
                    }
                  }}
                >
                  {({ open }) => (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => open()}
                      startIcon={<Upload size={16} />}
                      sx={{
                        borderColor: formData.bannerImage ? "#39FF14" : "rgba(57,255,20,0.3)",
                        color: formData.bannerImage ? "#39FF14" : "#9E9E9E",
                        textTransform: "none",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {formData.bannerImage ? "Change Banner" : "Upload Banner"}
                    </Button>
                  )}
                </CldUploadWidget>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    sx={{
                      color: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(57,255,20,0.2)" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(57,255,20,0.4)" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#39FF14" },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                  Featured
                </Typography>
                <Switch
                  checked={formData.featured}
                  onChange={(e) => handleSwitchChange("featured", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#39FF14",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#39FF14",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              label="SEO Title"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleFormChange}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
            <TextField
              label="SEO Description"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleFormChange}
              multiline
              rows={2}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9E9E9E" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#090909", px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ color: "#9E9E9E", textTransform: "none", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateCollection}
            sx={{
              bgcolor: "#39FF14",
              color: "#000",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Update Collection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", bgcolor: "#090909" }}>
          Delete Collection?
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#090909" }}>
          <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", mt: 1 }}>
            Deleting this collection will not delete the products.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#090909", px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: "#9E9E9E", textTransform: "none", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteCollection}
            sx={{
              bgcolor: "#FF4D4F",
              color: "#fff",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Products Dialog */}
      <Dialog open={openAddProductDialog} onClose={() => setOpenAddProductDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", bgcolor: "#090909" }}>
          Add Products to Collection
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#090909", pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                bgcolor: "rgba(5,5,5,0.5)",
                px: 2,
                py: 0.75,
                border: "1px solid rgba(57,255,20,0.1)",
                mb: 2,
              }}
            >
              <Search size={18} color="#9E9E9E" />
              <InputBase
                placeholder="Search products..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
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
            <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
              {filteredAvailableProducts.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 1,
                    bgcolor: "rgba(5,5,5,0.5)",
                    borderRadius: 2,
                    border: "1px solid rgba(57,255,20,0.1)",
                  }}
                >
                  <Checkbox
                    checked={selectedProductIds.includes(product.id || "")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProductIds([...selectedProductIds, product.id || ""]);
                      } else {
                        setSelectedProductIds(selectedProductIds.filter(id => id !== product.id));
                      }
                    }}
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#39FF14",
                      },
                    }}
                  />
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: 8, objectFit: "cover", marginRight: 12 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: "#1a1a1a", marginRight: 2 }}>
                      <Package size={20} color="#9E9E9E" />
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 0.5 }}>
                      <Typography sx={{ color: "#39FF14", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                        ${product.price.toLocaleString()}
                      </Typography>
                      <Typography sx={{ color: "#9E9E9E", fontSize: "0.875rem", fontFamily: "Poppins, sans-serif" }}>
                        Stock: {product.stock}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#090909", px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenAddProductDialog(false)}
            sx={{ color: "#9E9E9E", textTransform: "none", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddProducts}
            sx={{
              bgcolor: "#39FF14",
              color: "#000",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Add Selected Products
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === "success" ? "rgba(57,255,20,0.1)" : "rgba(255,77,79,0.1)",
            color: snackbar.severity === "success" ? "#39FF14" : "#FF4D4F",
            fontFamily: "Poppins, sans-serif",
            border: `1px solid ${snackbar.severity === "success" ? "rgba(57,255,20,0.3)" : "rgba(255,77,79,0.3)"}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
