
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
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Avatar,
  Divider,
  Tooltip,
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
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

// Summary Card Component
const SummaryCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
}: {
  title: string;
  value: string | number;
  icon: any;
  change: number;
  changeLabel: string;
}) => {
  const isPositive = change >= 0;

  return (
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
                {title}
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
                {value}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: isPositive ? "#39FF14" : "#FF4D4F",
                    fontWeight: 700,
                    fontFamily: "Poppins, sans-serif",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isPositive ? "↑" : "↓"} {Math.abs(change)}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9E9E9E",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {changeLabel}
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
              <Icon color="#39FF14" size={28} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Sample Data
const categories = [
  {
    id: "1",
    name: "Hoodies",
    slug: "hoodies",
    description: "Premium hoodies for all seasons and styles",
    productCount: 64,
    status: "Active",
    createdAt: "May 20, 2024",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&auto=format&fit=crop&q=60",
    featured: true,
  },
  {
    id: "2",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Essential tees for everyday comfort and style",
    productCount: 82,
    status: "Active",
    createdAt: "May 19, 2024",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=60",
    featured: true,
  },
  {
    id: "3",
    name: "Pants",
    slug: "pants",
    description: "Comfortable pants for streetwear lovers",
    productCount: 48,
    status: "Active",
    createdAt: "May 18, 2024",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&auto=format&fit=crop&q=60",
    featured: false,
  },
  {
    id: "4",
    name: "Jackets",
    slug: "jackets",
    description: "Stylish jackets for every occasion",
    productCount: 36,
    status: "Active",
    createdAt: "May 17, 2024",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&auto=format&fit=crop&q=60",
    featured: true,
  },
  {
    id: "5",
    name: "Accessories",
    slug: "accessories",
    description: "Complete your look with our accessories",
    productCount: 56,
    status: "Active",
    createdAt: "May 16, 2024",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=100&auto=format&fit=crop&q=60",
    featured: false,
  },
  {
    id: "6",
    name: "Hats & Caps",
    slug: "hats-caps",
    description: "Trendy hats and caps collection",
    productCount: 24,
    status: "Active",
    createdAt: "May 15, 2024",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&auto=format&fit=crop&q=60",
    featured: false,
  },
  {
    id: "7",
    name: "Shoes",
    slug: "shoes",
    description: "Premium footwear for all occasions",
    productCount: 28,
    status: "Inactive",
    createdAt: "May 14, 2024",
    image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=100&auto=format&fit=crop&q=60",
    featured: false,
  },
  {
    id: "8",
    name: "Bags",
    slug: "bags",
    description: "Bags and backpacks for every lifestyle",
    productCount: 18,
    status: "Inactive",
    createdAt: "May 13, 2024",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&auto=format&fit=crop&q=60",
    featured: false,
  },
];

const categorySummary = [
  {
    title: "Total Categories",
    value: 28,
    icon: BoxIcon,
    change: 12.5,
    changeLabel: "vs last month",
  },
  {
    title: "Active Categories",
    value: 24,
    icon: FolderKanban,
    change: 10.8,
    changeLabel: "vs last month",
  },
  {
    title: "Inactive Categories",
    value: 4,
    icon: PauseCircle,
    change: -2.1,
    changeLabel: "vs last month",
  },
  {
    title: "Total Products",
    value: 356,
    icon: ShoppingBag,
    change: 18.7,
    changeLabel: "vs last month",
  },
];

const topCategories = [
  { name: "T-Shirts", count: 82 },
  { name: "Hoodies", count: 64 },
  { name: "Accessories", count: 56 },
  { name: "Pants", count: 48 },
  { name: "Jackets", count: 36 },
];

const recentActivity = [
  { type: "Created", icon: Plus, time: "2 hours ago", description: "New category \"Summer Collection\" created" },
  { type: "Updated", icon: Edit, time: "5 hours ago", description: "Category \"Shoes\" updated" },
  { type: "Deactivated", icon: PauseCircle, time: "1 day ago", description: "Category \"Bags\" deactivated" },
  { type: "Updated", icon: Edit, time: "2 days ago", description: "Category \"Accessories\" updated" },
  { type: "Activated", icon: PlayCircle, time: "3 days ago", description: "Category \"Hats & Caps\" activated" },
];

export default function AdminCategoriesPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  return (
    <Box sx={{ maxWidth: "1800px", mx: "auto", width: "100%" }}>
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
              onClick={() => {
                setSelectedCategory(null);
                setOpenModal(true);
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
              Add New Category
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categorySummary.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <SummaryCard {...stat} />
          </Grid>
        ))}
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
                      onChange={(e) => setStatusFilter(e.target.value)}
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
                  {/* Sort & Filter Buttons */}
                  <IconButton sx={{ color: "#9E9E9E", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 1.5 }}>
                    <SortAsc size={18} />
                  </IconButton>
                  <IconButton sx={{ color: "#9E9E9E", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 1.5 }}>
                    <Filter size={18} />
                  </IconButton>
                  <IconButton sx={{ color: "#9E9E9E", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 1.5 }}>
                    <Download size={18} />
                  </IconButton>
                </Box>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value="Bulk Actions"
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(5,5,5,0.5)",
                      border: "1px solid rgba(57,255,20,0.2)",
                      borderRadius: 2,
                      ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    }}
                  >
                    <MenuItem value="Bulk Actions">Bulk Actions</MenuItem>
                    <MenuItem value="Delete">Delete Selected</MenuItem>
                    <MenuItem value="Activate">Activate Selected</MenuItem>
                    <MenuItem value="Deactivate">Deactivate Selected</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Divider sx={{ borderColor: "rgba(57,255,20,0.1)" }} />

              {/* Table */}
              <TableContainer sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: "rgba(5,5,5,0.8)",
                      }}
                    >
                      <TableCell sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
                        ::
                      </TableCell>
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
                    {categories.map((category) => (
                      <motion.tr
                        key={category.id}
                        whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <MoreVertical size={16} color="#9E9E9E" />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={category.image} sx={{ width: 44, height: 44, borderRadius: 2 }} />
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
                          {category.productCount}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <StatusChip status={category.status} />
                        </TableCell>
                        <TableCell sx={{ py: 2, color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                          {category.createdAt}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Tooltip title="Preview">
                              <IconButton size="small" sx={{ color: "#9E9E9E" }}>
                                <Eye size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                sx={{ color: "#9E9E9E" }}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setOpenModal(true);
                                }}
                              >
                                <Edit size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Duplicate">
                              <IconButton size="small" sx={{ color: "#9E9E9E" }}>
                                <Copy size={16} />
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

              {/* Pagination */}
              <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                  Showing 1 to {categories.length} of {categorySummary[0].value} categories
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={10}
                      sx={{
                        color: "#fff",
                        bgcolor: "rgba(5,5,5,0.5)",
                        border: "1px solid rgba(57,255,20,0.2)",
                        borderRadius: 2,
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                      }}
                    >
                      <MenuItem value={5}>5 / page</MenuItem>
                      <MenuItem value={10}>10 / page</MenuItem>
                      <MenuItem value={25}>25 / page</MenuItem>
                      <MenuItem value={50}>50 / page</MenuItem>
                    </Select>
                  </FormControl>
                  <Pagination
                    page={page}
                    count={10}
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
              </Box>
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
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#39FF14"
                          strokeWidth="16"
                          strokeDasharray={`${24 / 28 * 2 * Math.PI * 70} ${2 * Math.PI * 70}`}
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
                          strokeDasharray={`${4 / 28 * 2 * Math.PI * 70} ${2 * Math.PI * 70}`}
                          strokeDashoffset={`${-24 / 28 * 2 * Math.PI * 70}`}
                          strokeLinecap="round"
                          transform="rotate(-90 80 80)"
                        />
                      </svg>
                      <Box sx={{ position: "absolute", textAlign: "center" }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontFamily: "Inter, sans-serif", fontSize: "2rem" }}>
                          {categorySummary[0].value}
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
                        {categorySummary[1].value} ({Math.round(24 / 28 * 100)}%)
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
                        {categorySummary[2].value} ({Math.round(4 / 28 * 100)}%)
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
                      const maxCount = topCategories[0].count;
                      const percentage = (cat.count / maxCount) * 100;
                      return (
                        <Box key={index}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem" }}>
                              {cat.name}
                            </Typography>
                            <Typography sx={{ color: "#9E9E9E", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>
                              {cat.count}
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

            {/* Recent Activity Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ background: "#111111", border: "1px solid rgba(57,255,20,0.15)", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Recent Activity
                    </Typography>
                    <Button
                      variant="text"
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "0.75rem",
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {recentActivity.map((activity, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(57,255,20,0.1)",
                            flexShrink: 0,
                          }}
                        >
                          <activity.icon size={18} color="#39FF14" />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 500,
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.875rem",
                              mb: 0.25,
                            }}
                          >
                            {activity.description}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#9E9E9E",
                              fontSize: "0.75rem",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
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
              fullWidth
              defaultValue={selectedCategory?.name}
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
              fullWidth
              defaultValue={selectedCategory?.slug}
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
              label="Parent Category"
              fullWidth
              select
              defaultValue=""
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
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedCategory?.description}
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
              fullWidth
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
              fullWidth
              multiline
              rows={2}
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
              <Card sx={{ flex: 1, p: 2, bgcolor: "rgba(5,5,5,0.5)", border: "1px dashed rgba(57,255,20,0.2)", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 120, cursor: "pointer" }}>
                <Upload size={28} color="#9E9E9E" />
                <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                  Upload Category Image
                </Typography>
              </Card>
              <Card sx={{ flex: 1, p: 2, bgcolor: "rgba(5,5,5,0.5)", border: "1px dashed rgba(57,255,20,0.2)", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 120, cursor: "pointer" }}>
                <Upload size={28} color="#9E9E9E" />
                <Typography sx={{ color: "#9E9E9E", fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", mt: 1 }}>
                  Upload Banner Image
                </Typography>
              </Card>
            </Box>
            <Divider sx={{ borderColor: "rgba(57,255,20,0.1)", my: 1 }} />
            <Typography sx={{ color: "#9E9E9E", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "Poppins, sans-serif", fontSize: "0.75rem" }}>
              Settings
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>Featured Category</Typography>
              <Switch defaultChecked={selectedCategory?.featured} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#39FF14" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#39FF14" } }} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>Active</Typography>
              <Switch defaultChecked={selectedCategory?.status === "Active"} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#39FF14" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#39FF14" } }} />
            </Box>
            <TextField
              label="Sort Order"
              type="number"
              fullWidth
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
            onClick={() => setOpenModal(false)}
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
            onClick={() => setOpenDeleteModal(false)}
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
    </Box>
  );
}
