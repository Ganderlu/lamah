"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  ArrowDown,
  ArrowUp,
  Box as BoxIcon,
  Download,
  Eye,
  Filter,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  ShoppingBag,
  Boxes,
} from "lucide-react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import StatCard from "@/components/admin/StatCard";
import { fetchCategories } from "@/lib/categories";
import {
  createNewArrival,
  deleteNewArrival,
  fetchNewArrivals,
  updateNewArrival,
} from "@/lib/newArrivals";
import type { NewArrival } from "@/types/newArrival";

const arrivalSchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  sku: z.string().min(3, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  collection: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be valid"),
  discountPrice: z.coerce.number().min(0, "Discount price must be valid").optional(),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean(),
  newArrival: z.boolean(),
  status: z.enum(["Active", "Draft", "Inactive"]),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

type ArrivalFormValues = z.infer<typeof arrivalSchema>;

const DEFAULT_FORM_VALUES: ArrivalFormValues = {
  productName: "",
  sku: "",
  category: "",
  collection: "",
  description: "",
  price: 0,
  discountPrice: undefined,
  stock: 0,
  sizes: "",
  colors: "",
  tags: "",
  featured: false,
  newArrival: true,
  status: "Draft",
  thumbnail: "",
  gallery: [],
};

const CATEGORY_FALLBACKS = [
  "Hoodies",
  "T-Shirts",
  "Pants",
  "Accessories",
  "Footwear",
];

const COLLECTION_OPTIONS = [
  "Lamah Core",
  "Midnight Drop",
  "Summer 2026",
  "Luxury Essentials",
  "Runway Capsule",
];

const STATUS_OPTIONS = ["All", "Active", "Draft", "Inactive"] as const;
const PAGE_SIZE_OPTIONS = [10, 20, 30];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function parseList(value?: string) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function StatusBadge({ status }: { status: NewArrival["status"] }) {
  const palette =
    status === "Active"
      ? { bg: "rgba(57,255,20,0.12)", color: "#39FF14" }
      : status === "Inactive"
      ? { bg: "rgba(239,68,68,0.12)", color: "#EF4444" }
      : { bg: "rgba(160,160,160,0.12)", color: "#A0A0A0" };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: palette.bg,
        color: palette.color,
        fontWeight: 700,
        fontFamily: "Poppins, sans-serif",
        borderRadius: 999,
      }}
    />
  );
}

function LoadingState() {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                bgcolor: "#111111",
                borderRadius: "18px",
                border: "1px solid rgba(57,255,20,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" sx={{ bgcolor: alpha("#39FF14", 0.1), mb: 1 }} />
                <Skeleton variant="text" width="40%" height={52} sx={{ bgcolor: alpha("#39FF14", 0.12) }} />
                <Skeleton variant="text" width="55%" sx={{ bgcolor: alpha("#39FF14", 0.08) }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card
        sx={{
          bgcolor: "#111111",
          borderRadius: "18px",
          border: "1px solid rgba(57,255,20,0.1)",
          p: 3,
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={52} sx={{ bgcolor: alpha("#39FF14", 0.08) }} />
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant="rounded" height={68} sx={{ bgcolor: alpha("#39FF14", 0.06) }} />
          ))}
        </Stack>
      </Card>
    </Box>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card
      sx={{
        bgcolor: "#111111",
        borderRadius: "18px",
        border: "1px dashed rgba(57,255,20,0.18)",
      }}
    >
      <CardContent
        sx={{
          py: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 86,
            height: 86,
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(57,255,20,0.08)",
            border: "1px solid rgba(57,255,20,0.15)",
            mb: 3,
          }}
        >
          <Sparkles size={34} color="#39FF14" />
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontFamily: "Bebas Neue, cursive",
            letterSpacing: "0.08em",
            mb: 1,
          }}
        >
          No New Arrivals
        </Typography>
        <Typography
          sx={{
            color: "#A0A0A0",
            fontFamily: "Poppins, sans-serif",
            maxWidth: 420,
            mb: 3,
          }}
        >
          There are no new arrivals available. Add the latest Lamah pieces to keep your storefront fresh.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onAdd}
          sx={{
            bgcolor: "#39FF14",
            color: "#000",
            fontWeight: 700,
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            borderRadius: "14px",
            "&:hover": { bgcolor: "#2dd610" },
          }}
        >
          Add New Arrival
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminNewArrivalsPage() {
  const [items, setItems] = useState<NewArrival[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(CATEGORY_FALLBACKS);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NewArrival | null>(null);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArrivalFormValues>({
    resolver: zodResolver(arrivalSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const gallery = watch("gallery");
  const thumbnail = watch("thumbnail");

  const loadPageData = async () => {
    try {
      setLoading(true);
      const [arrivalData, categoryData] = await Promise.all([
        fetchNewArrivals(),
        fetchCategories("Active").catch(() => []),
      ]);

      setItems(arrivalData);
      const dbCategories = categoryData
        .map((category) => category.name)
        .filter(Boolean);
      setCategoryOptions(
        dbCategories.length > 0 ? Array.from(new Set(dbCategories)) : CATEGORY_FALLBACKS
      );
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to load new arrivals.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPageData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const stats = useMemo(() => {
    const totalViews = items.reduce((sum, item) => sum + item.views, 0);
    const totalOrders = items.reduce((sum, item) => sum + item.orders, 0);
    return {
      total: items.length,
      active: items.filter((item) => item.status === "Active").length,
      views: totalViews,
      orders: totalOrders,
    };
  }, [items]);

  const openCreateModal = () => {
    setSelectedItem(null);
    reset(DEFAULT_FORM_VALUES);
    setOpenModal(true);
  };

  const openEditModal = (item: NewArrival) => {
    setSelectedItem(item);
    reset({
      productName: item.productName,
      sku: item.sku,
      category: item.category,
      collection: item.collection ?? "",
      description: item.description ?? "",
      price: item.price,
      discountPrice: item.discountPrice,
      stock: item.stock,
      sizes: item.sizes?.join(", ") ?? "",
      colors: item.colors?.join(", ") ?? "",
      tags: item.tags?.join(", ") ?? "",
      featured: item.featured,
      newArrival: item.newArrival,
      status: item.status,
      thumbnail: item.thumbnail ?? "",
      gallery: item.gallery ?? [],
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
    reset(DEFAULT_FORM_VALUES);
  };

  const handleDelete = async () => {
    if (!selectedItem?.id) return;
    try {
      await deleteNewArrival(selectedItem.id);
      setSnackbar({
        open: true,
        message: "New arrival deleted successfully.",
        severity: "success",
      });
      setOpenDeleteModal(false);
      setSelectedItem(null);
      await loadPageData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete new arrival.",
        severity: "error",
      });
    }
  };

  const onSubmit = async (values: ArrivalFormValues) => {
    const payload = {
      productName: values.productName,
      sku: values.sku,
      category: values.category,
      collection: values.collection || "",
      description: values.description,
      price: Number(values.price),
      discountPrice:
        values.discountPrice !== undefined && values.discountPrice !== null
          ? Number(values.discountPrice)
          : undefined,
      stock: Number(values.stock),
      sizes: parseList(values.sizes),
      colors: parseList(values.colors),
      tags: parseList(values.tags),
      featured: values.featured,
      newArrival: values.newArrival,
      status: values.status,
      thumbnail: values.thumbnail || "",
      gallery: values.gallery || [],
    };

    try {
      if (selectedItem?.id) {
        await updateNewArrival(selectedItem.id, payload);
        setSnackbar({
          open: true,
          message: "New arrival updated successfully.",
          severity: "success",
        });
      } else {
        await createNewArrival(payload);
        setSnackbar({
          open: true,
          message: "New arrival created successfully.",
          severity: "success",
        });
      }
      closeModal();
      await loadPageData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save new arrival.",
        severity: "error",
      });
    }
  };

  const handleThumbnailUpload = (result: any) => {
    const url = result?.info?.secure_url;
    if (!url) return;
    setValue("thumbnail", url, { shouldDirty: true, shouldValidate: true });
    setSnackbar({
      open: true,
      message: "Thumbnail uploaded.",
      severity: "success",
    });
  };

  const handleGalleryUpload = (result: any) => {
    const url = result?.info?.secure_url;
    if (!url) return;
    const currentGallery = watch("gallery") ?? [];
    if (currentGallery.includes(url)) return;
    setValue("gallery", [...currentGallery, url], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const moveGalleryImage = (index: number, direction: "left" | "right") => {
    const nextIndex = direction === "left" ? index - 1 : index + 1;
    const currentGallery = [...(watch("gallery") ?? [])];
    if (nextIndex < 0 || nextIndex >= currentGallery.length) return;
    const temp = currentGallery[index];
    currentGallery[index] = currentGallery[nextIndex];
    currentGallery[nextIndex] = temp;
    setValue("gallery", currentGallery, { shouldDirty: true });
  };

  const removeGalleryImage = (index: number) => {
    const currentGallery = [...(watch("gallery") ?? [])];
    currentGallery.splice(index, 1);
    setValue("gallery", currentGallery, { shouldDirty: true });
  };

  const currentStart = filteredItems.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const currentEnd = Math.min(page * itemsPerPage, filteredItems.length);

  return (
    <Box sx={{ maxWidth: "1800px", mx: "auto", width: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                letterSpacing: "0.08em",
                color: "#fff",
                mb: 0.75,
              }}
            >
              New Arrivals
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Link href="/admin" style={{ textDecoration: "none" }}>
                <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                  Dashboard
                </Typography>
              </Link>
              <Typography sx={{ color: "#A0A0A0" }}>{">"}</Typography>
              <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                Products
              </Typography>
              <Typography sx={{ color: "#A0A0A0" }}>{">"}</Typography>
              <Typography sx={{ color: "#39FF14", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", fontWeight: 600 }}>
                New Arrivals
              </Typography>
            </Box>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              sx={{
                borderColor: "rgba(57,255,20,0.18)",
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                textTransform: "none",
                borderRadius: "14px",
                minHeight: 48,
                "&:hover": {
                  borderColor: "rgba(57,255,20,0.35)",
                  bgcolor: "rgba(57,255,20,0.05)",
                },
              }}
            >
              Import Products
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={openCreateModal}
              sx={{
                bgcolor: "#39FF14",
                color: "#000",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "14px",
                minHeight: 48,
                boxShadow: "0 0 24px rgba(57,255,20,0.16)",
                "&:hover": { bgcolor: "#2dd610" },
              }}
            >
              Add New Arrival
            </Button>
          </Stack>
        </Box>
      </motion.div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total New Arrivals"
                value={stats.total}
                icon={Sparkles}
                change={25}
                changeLabel="vs last month"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Active Items"
                value={stats.active}
                icon={PackagePlus}
                change={15}
                changeLabel="vs last month"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Views"
                value={stats.views.toLocaleString()}
                icon={Eye}
                change={18}
                changeLabel="vs last month"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Orders"
                value={stats.orders.toLocaleString()}
                icon={ShoppingBag}
                change={20}
                changeLabel="vs last month"
              />
            </Grid>
          </Grid>

          <Card
            sx={{
              bgcolor: "#111111",
              borderRadius: "18px",
              border: "1px solid rgba(57,255,20,0.12)",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "14px",
                      border: "1px solid rgba(57,255,20,0.12)",
                      bgcolor: "#0b0b0b",
                      px: 2,
                      minHeight: 48,
                    }}
                  >
                    <Search size={18} color="#A0A0A0" />
                    <InputBase
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search new arrivals..."
                      sx={{
                        ml: 1.5,
                        flex: 1,
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        "& input::placeholder": {
                          color: "#A0A0A0",
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={categoryFilter}
                      onChange={(event) => {
                        setCategoryFilter(event.target.value);
                        setPage(1);
                      }}
                      sx={{
                        borderRadius: "14px",
                        minHeight: 48,
                        bgcolor: "#0b0b0b",
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(57,255,20,0.12)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(57,255,20,0.24)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#39FF14",
                        },
                      }}
                    >
                      <MenuItem value="All Categories">All Categories</MenuItem>
                      {categoryOptions.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value as (typeof STATUS_OPTIONS)[number]);
                        setPage(1);
                      }}
                      sx={{
                        borderRadius: "14px",
                        minHeight: 48,
                        bgcolor: "#0b0b0b",
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(57,255,20,0.12)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(57,255,20,0.24)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#39FF14",
                        },
                      }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status === "All" ? "All Status" : status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    startIcon={<Filter size={18} />}
                    sx={{
                      minHeight: 48,
                      borderRadius: "14px",
                      border: "1px solid rgba(57,255,20,0.12)",
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      textTransform: "none",
                      bgcolor: "#0b0b0b",
                    }}
                  >
                    Filter
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {filteredItems.length === 0 ? (
            <EmptyState onAdd={openCreateModal} />
          ) : (
            <Card
              sx={{
                bgcolor: "#111111",
                borderRadius: "18px",
                border: "1px solid rgba(57,255,20,0.12)",
              }}
            >
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {["Product", "Category", "Price", "Stock", "Status", "Added On", "Action"].map((label) => (
                          <TableCell
                            key={label}
                            sx={{
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              fontSize: "0.75rem",
                              borderBottom: "1px solid rgba(57,255,20,0.08)",
                            }}
                          >
                            {label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedItems.map((item) => (
                        <TableRow
                          key={item.id}
                          hover
                          sx={{
                            "& td": {
                              borderBottom: "1px solid rgba(57,255,20,0.06)",
                            },
                            "&:hover": {
                              bgcolor: "rgba(57,255,20,0.02)",
                            },
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Box
                                sx={{
                                  width: 58,
                                  height: 58,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  position: "relative",
                                  bgcolor: "#0b0b0b",
                                  flexShrink: 0,
                                }}
                              >
                                {item.thumbnail ? (
                                  <Image
                                    src={item.thumbnail}
                                    alt={item.productName}
                                    fill
                                    style={{ objectFit: "cover" }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <BoxIcon size={22} color="#A0A0A0" />
                                  </Box>
                                )}
                              </Box>
                              <Box>
                                <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                                  {item.productName}
                                </Typography>
                                <Typography sx={{ color: "#A0A0A0", fontFamily: "Inter, sans-serif", fontSize: "0.82rem" }}>
                                  {item.sku}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{item.category}</TableCell>
                          <TableCell sx={{ color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell sx={{ color: "#fff", fontFamily: "Inter, sans-serif" }}>{item.stock}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                            {formatDate(item.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => openEditModal(item)}
                                  sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "12px",
                                    border: "1px solid rgba(57,255,20,0.14)",
                                    color: "#fff",
                                    "&:hover": {
                                      color: "#39FF14",
                                      boxShadow: "0 0 18px rgba(57,255,20,0.12)",
                                    },
                                  }}
                                >
                                  <Pencil size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setOpenDeleteModal(true);
                                  }}
                                  sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "12px",
                                    border: "1px solid rgba(239,68,68,0.16)",
                                    color: "#EF4444",
                                    "&:hover": {
                                      boxShadow: "0 0 18px rgba(239,68,68,0.12)",
                                    },
                                  }}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Stack divider={<Divider sx={{ borderColor: "rgba(57,255,20,0.08)" }} />}>
                  {paginatedItems.map((item) => (
                    <Box key={item.id} sx={{ p: 2.25 }}>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            width: 74,
                            height: 74,
                            borderRadius: 2.5,
                            overflow: "hidden",
                            position: "relative",
                            bgcolor: "#0b0b0b",
                            flexShrink: 0,
                          }}
                        >
                          {item.thumbnail ? (
                            <Image src={item.thumbnail} alt={item.productName} fill style={{ objectFit: "cover" }} />
                          ) : (
                            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <BoxIcon size={22} color="#A0A0A0" />
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5 }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                                {item.productName}
                              </Typography>
                              <Typography sx={{ color: "#A0A0A0", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", mb: 1 }}>
                                {item.sku}
                              </Typography>
                            </Box>
                            <StatusBadge status={item.status} />
                          </Box>
                          <Grid container spacing={1.25} sx={{ mb: 1.25 }}>
                            <Grid item xs={6}>
                              <Typography sx={{ color: "#A0A0A0", fontSize: "0.72rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Category
                              </Typography>
                              <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "0.92rem" }}>
                                {item.category}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ color: "#A0A0A0", fontSize: "0.72rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Price
                              </Typography>
                              <Typography sx={{ color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.92rem" }}>
                                {formatCurrency(item.price)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ color: "#A0A0A0", fontSize: "0.72rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Stock
                              </Typography>
                              <Typography sx={{ color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "0.92rem" }}>
                                {item.stock}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ color: "#A0A0A0", fontSize: "0.72rem", fontFamily: "Poppins, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                Added On
                              </Typography>
                              <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "0.92rem" }}>
                                {formatDate(item.createdAt)}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              startIcon={<Pencil size={15} />}
                              onClick={() => openEditModal(item)}
                              sx={{
                                borderRadius: "12px",
                                borderColor: "rgba(57,255,20,0.14)",
                                color: "#fff",
                                textTransform: "none",
                                fontFamily: "Poppins, sans-serif",
                                "&:hover": {
                                  borderColor: "#39FF14",
                                  color: "#39FF14",
                                },
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<Trash2 size={15} />}
                              onClick={() => {
                                setSelectedItem(item);
                                setOpenDeleteModal(true);
                              }}
                              sx={{
                                borderRadius: "12px",
                                borderColor: "rgba(239,68,68,0.16)",
                                color: "#EF4444",
                                textTransform: "none",
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderTop: "1px solid rgba(57,255,20,0.08)",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                  Showing {currentStart} to {currentEnd} of {filteredItems.length} results
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    shape="rounded"
                    sx={{
                      ".MuiPaginationItem-root": {
                        color: "#fff",
                        border: "1px solid rgba(57,255,20,0.1)",
                      },
                      ".Mui-selected": {
                        bgcolor: "#39FF14 !important",
                        color: "#000 !important",
                        borderColor: "#39FF14",
                      },
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 112 }}>
                    <Select
                      value={itemsPerPage}
                      onChange={(event) => {
                        setItemsPerPage(Number(event.target.value));
                        setPage(1);
                      }}
                      sx={{
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        borderRadius: "12px",
                        bgcolor: "#0b0b0b",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(57,255,20,0.12)",
                        },
                      }}
                    >
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size} / page
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            </Card>
          )}
        </>
      )}

      <Dialog
        open={openModal}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: "#111111",
            borderRadius: "20px",
            border: "1px solid rgba(57,255,20,0.14)",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            borderBottom: "1px solid rgba(57,255,20,0.08)",
          }}
        >
          {selectedItem ? "Edit New Arrival" : "Add New Arrival"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box
            component="form"
            id="new-arrival-form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  {...register("productName")}
                  error={!!errors.productName}
                  helperText={errors.productName?.message}
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  {...register("sku")}
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel sx={labelSx}>Category</InputLabel>
                      <Select {...field} label="Category" sx={selectSx}>
                        {categoryOptions.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <Typography sx={helperSx}>{errors.category.message}</Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel sx={labelSx}>Status</InputLabel>
                      <Select {...field} label="Status" sx={selectSx}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  control={control}
                  name="collection"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel sx={labelSx}>Collection</InputLabel>
                      <Select {...field} label="Collection" sx={selectSx}>
                        <MenuItem value="">None</MenuItem>
                        {COLLECTION_OPTIONS.map((collection) => (
                          <MenuItem key={collection} value={collection}>
                            {collection}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  {...register("stock")}
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  {...register("price")}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Discount Price"
                  type="number"
                  {...register("discountPrice")}
                  error={!!errors.discountPrice}
                  helperText={errors.discountPrice?.message}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  minRows={4}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Sizes" placeholder="S, M, L, XL" {...register("sizes")} sx={fieldSx} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Colors" placeholder="Black, Green, Cream" {...register("colors")} sx={fieldSx} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Tags" placeholder="streetwear, premium, drop" {...register("tags")} sx={fieldSx} />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={sectionTitleSx}>Thumbnail</Typography>
                <Card sx={uploadCardSx}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
                      <Box
                        sx={{
                          width: { xs: "100%", md: 120 },
                          height: 120,
                          borderRadius: 2.5,
                          overflow: "hidden",
                          bgcolor: "#0b0b0b",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        {thumbnail ? (
                          <Image src={thumbnail} alt="Thumbnail preview" fill style={{ objectFit: "cover" }} />
                        ) : (
                          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Upload size={24} color="#A0A0A0" />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 0.5 }}>
                          Upload product thumbnail
                        </Typography>
                        <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mb: 2 }}>
                          Use Cloudinary drag-and-drop upload with cropping support enabled in the widget.
                        </Typography>
                        <CldUploadWidget
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                          options={{
                            folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
                            multiple: false,
                            cropping: true,
                            sources: ["local", "url", "camera"],
                          }}
                          onSuccess={handleThumbnailUpload}
                        >
                          {({ open }) => (
                            <Button
                              variant="outlined"
                              startIcon={<Upload size={18} />}
                              onClick={() => open()}
                              sx={uploadButtonSx}
                            >
                              Upload Thumbnail
                            </Button>
                          )}
                        </CldUploadWidget>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography sx={sectionTitleSx}>Gallery Images</Typography>
                <Card sx={uploadCardSx}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                      <Box>
                        <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                          Upload gallery images
                        </Typography>
                        <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                          Add multiple images, preview them, and reorder before publishing.
                        </Typography>
                      </Box>
                      <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{
                          folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
                          multiple: true,
                          maxFiles: 8,
                          sources: ["local", "url", "camera"],
                        }}
                        onSuccess={handleGalleryUpload}
                      >
                        {({ open }) => (
                          <Button
                            variant="outlined"
                            startIcon={<Upload size={18} />}
                            onClick={() => open()}
                            sx={uploadButtonSx}
                          >
                            Upload Gallery
                          </Button>
                        )}
                      </CldUploadWidget>
                    </Stack>

                    {gallery.length === 0 ? (
                      <Box
                        sx={{
                          minHeight: 120,
                          borderRadius: 2.5,
                          border: "1px dashed rgba(57,255,20,0.18)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        No gallery images uploaded yet.
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        {gallery.map((image, index) => (
                          <Grid item xs={12} sm={6} md={4} key={image}>
                            <Card
                              sx={{
                                bgcolor: "#0b0b0b",
                                borderRadius: 2.5,
                                border: "1px solid rgba(57,255,20,0.1)",
                              }}
                            >
                              <Box sx={{ position: "relative", width: "100%", height: 180 }}>
                                <Image src={image} alt={`Gallery ${index + 1}`} fill style={{ objectFit: "cover" }} />
                              </Box>
                              <Stack direction="row" spacing={1} sx={{ p: 1.5, justifyContent: "space-between" }}>
                                <IconButton onClick={() => moveGalleryImage(index, "left")} sx={galleryActionSx}>
                                  <ArrowUp size={16} />
                                </IconButton>
                                <IconButton onClick={() => moveGalleryImage(index, "right")} sx={galleryActionSx}>
                                  <ArrowDown size={16} />
                                </IconButton>
                                <IconButton onClick={() => removeGalleryImage(index)} sx={{ ...galleryActionSx, color: "#EF4444" }}>
                                  <Trash2 size={16} />
                                </IconButton>
                              </Stack>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => (
                    <Card sx={toggleCardSx}>
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                              Featured
                            </Typography>
                            <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.8rem" }}>
                              Highlight on premium slots
                            </Typography>
                          </Box>
                          <Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  control={control}
                  name="newArrival"
                  render={({ field }) => (
                    <Card sx={toggleCardSx}>
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                              New Arrival
                            </Typography>
                            <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.8rem" }}>
                              Mark as latest release
                            </Typography>
                          </Box>
                          <Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={toggleCardSx}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Tag size={18} color="#39FF14" />
                      <Box>
                        <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                          Publish Ready
                        </Typography>
                        <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", fontSize: "0.8rem" }}>
                          Add images, pricing, stock, and metadata before publishing.
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: "1px solid rgba(57,255,20,0.08)" }}>
          <Button onClick={closeModal} sx={secondaryButtonSx}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-arrival-form"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: "#39FF14",
              color: "#000",
              textTransform: "none",
              borderRadius: "14px",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              px: 2.5,
              "&:hover": { bgcolor: "#2dd610" },
            }}
          >
            {selectedItem ? "Update Arrival" : "Publish Arrival"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        PaperProps={{
          sx: {
            bgcolor: "#111111",
            borderRadius: "18px",
            border: "1px solid rgba(239,68,68,0.16)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
          Delete New Arrival
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
            Are you sure you want to remove "{selectedItem?.productName}" from new arrivals?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDeleteModal(false)} sx={secondaryButtonSx}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleDelete()}
            sx={{
              bgcolor: "#EF4444",
              color: "#fff",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              borderRadius: "14px",
              px: 2.5,
              "&:hover": { bgcolor: "#dc2626" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
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

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "14px",
    fontFamily: "Poppins, sans-serif",
    bgcolor: "#0b0b0b",
    "& fieldset": {
      borderColor: "rgba(57,255,20,0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(57,255,20,0.24)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#39FF14",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#A0A0A0",
    "&.Mui-focused": {
      color: "#39FF14",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#EF4444",
    ml: 0.5,
  },
};

const labelSx = {
  color: "#A0A0A0",
  "&.Mui-focused": {
    color: "#39FF14",
  },
};

const selectSx = {
  color: "#fff",
  borderRadius: "14px",
  bgcolor: "#0b0b0b",
  fontFamily: "Poppins, sans-serif",
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(57,255,20,0.12)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(57,255,20,0.24)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#39FF14",
  },
};

const helperSx = {
  color: "#EF4444",
  fontFamily: "Poppins, sans-serif",
  fontSize: "0.75rem",
  mt: 0.75,
  ml: 0.5,
};

const sectionTitleSx = {
  color: "#fff",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 700,
  mb: 1.25,
};

const uploadCardSx = {
  bgcolor: "#0f0f0f",
  borderRadius: "18px",
  border: "1px solid rgba(57,255,20,0.1)",
};

const uploadButtonSx = {
  borderColor: "rgba(57,255,20,0.16)",
  color: "#fff",
  textTransform: "none",
  fontFamily: "Poppins, sans-serif",
  borderRadius: "12px",
  "&:hover": {
    borderColor: "#39FF14",
    color: "#39FF14",
  },
};

const toggleCardSx = {
  bgcolor: "#0f0f0f",
  borderRadius: "18px",
  border: "1px solid rgba(57,255,20,0.1)",
  height: "100%",
};

const galleryActionSx = {
  width: 34,
  height: 34,
  borderRadius: "10px",
  border: "1px solid rgba(57,255,20,0.12)",
  color: "#fff",
};

const secondaryButtonSx = {
  color: "#A0A0A0",
  textTransform: "none",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 600,
};
