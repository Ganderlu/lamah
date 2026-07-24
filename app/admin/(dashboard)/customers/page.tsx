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
  Avatar,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  Drawer,
  Menu,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
} from "@mui/material";
import {
  LayoutDashboard,
  Users,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Star,
  Activity,
  CheckCircle2,
  X,
  Send,
  Clock,
  UserCheck,
  MapPin,
  Lock,
  MessageSquare,
  Plus,
  Gift,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Customer } from "@/types/customer";
import {
  fetchCustomers,
  updateCustomer,
  deleteCustomer,
} from "@/lib/customers";
import { fetchAllOrders } from "@/lib/orders";

// Status Chip Component
const StatusChip = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
      case "Active":
        return { bg: "rgba(57,255,20,0.1)", color: "#39FF14" };
      case "Blocked":
        return { bg: "rgba(239,68,68,0.1)", color: "#EF4444" };
      case "Inactive":
        return { bg: "rgba(160,160,160,0.1)", color: "#A0A0A0" };
      default:
        return { bg: "rgba(160,160,160,0.1)", color: "#A0A0A0" };
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

// Membership Chip Component
const MembershipChip = ({ membership }: { membership: string }) => {
  const getColor = () => {
    switch (membership) {
      case "Gold Member":
        return { bg: "rgba(245,166,35,0.1)", color: "#F5A623" };
      case "Silver Member":
        return { bg: "rgba(192,192,192,0.1)", color: "#C0C0C0" };
      case "Bronze Member":
        return { bg: "rgba(205,127,50,0.1)", color: "#CD7F32" };
      default:
        return { bg: "rgba(160,160,160,0.1)", color: "#A0A0A0" };
    }
  };

  const colors = getColor();

  return (
    <Chip
      label={membership}
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

// Format currency in NGN
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive" | "Blocked"
  >("All");
  const [membershipFilter, setMembershipFilter] = useState<
    "All" | "Gold Member" | "Silver Member" | "Bronze Member" | "Regular Customer"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState(0);

  // Dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuCustomer, setSelectedMenuCustomer] = useState<Customer | null>(null);

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
      const [customersData, ordersData] = await Promise.all([
        fetchCustomers(statusFilter, membershipFilter),
        fetchAllOrders(),
      ]);
      setCustomers(customersData);
      setOrders(ordersData);
      
      const total = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      setTotalRevenue(total);
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
  }, [statusFilter, membershipFilter]);

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (customer.firstName + " " + customer.lastName).toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.username.toLowerCase().includes(lowerQuery) ||
      (customer.phone && customer.phone.includes(lowerQuery))
    );
  });

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));

  // Stats for summary cards
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(
    (c) => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  const repeatCustomers = customers.filter((c) => (c.ordersCount || 0) > 1).length;

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedMenuCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMenuCustomer(null);
  };

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleBlockConfirm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenBlockDialog(true);
    handleMenuClose();
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer?.id) return;
    try {
      await deleteCustomer(selectedCustomer.id);
      setSnackbar({
        open: true,
        message: "Customer deleted successfully!",
        severity: "success",
      });
      setOpenDeleteDialog(false);
      setSelectedCustomer(null);
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete customer",
        severity: "error",
      });
    }
  };

  const handleBlockCustomer = async () => {
    if (!selectedCustomer?.id) return;
    try {
      await updateCustomer(selectedCustomer.id, { status: "Blocked" });
      setSnackbar({
        open: true,
        message: "Customer blocked successfully!",
        severity: "success",
      });
      setOpenBlockDialog(false);
      setBlockReason("");
      setSelectedCustomer(null);
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to block customer",
        severity: "error",
      });
    }
  };

  // Mock data for customer profile
  const recentOrders = [
    { id: "#LO-8721", products: "Lamah Signature Hoodie", amount: 89000, status: "Delivered", date: "May 20, 2026" },
    { id: "#LO-8715", products: "Oversized Tee, Cargo Pants", amount: 156000, status: "Processing", date: "May 15, 2026" },
  ];
  const recentActivity = [
    { type: "Account Created", date: "May 15, 2024", icon: <UserCheck size={16} /> },
    { type: "Recent Login", date: "May 20, 2026", icon: <CheckCircle2 size={16} /> },
    { type: "Latest Purchase", date: "May 20, 2026", icon: <ShoppingBag size={16} /> },
    { type: "Address Updated", date: "May 18, 2026", icon: <MapPin size={16} /> },
    { type: "Password Changed", date: "May 10, 2026", icon: <Lock size={16} /> },
  ];
  const customerNotes = [
    { id: "1", text: "Customer requested expedited shipping for next order.", date: "May 18, 2026" },
    { id: "2", text: "Loyal customer, should consider upgrading to Gold membership.", date: "May 10, 2026" },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            mb: 6,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 3,
          }}
        >
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
              Customers
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link href="/admin" passHref style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    color: "#A0A0A0",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  Dashboard
                </Typography>
              </Link>
              <Typography sx={{ color: "#A0A0A0" }}>›</Typography>
              <Typography
                sx={{
                  color: "#39FF14",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                Customers
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
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
              Export Customers
            </Button>
            <Button
              variant="outlined"
              startIcon={<Upload size={16} />}
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
              Import Customers
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={16} />}
              onClick={loadData}
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
              Refresh
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
                        color: "#A0A0A0",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Total Customers
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
                      {totalCustomers.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography
                        sx={{
                          color: "#39FF14",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        +18%
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        vs last month
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
                    <Users color="#39FF14" size={28} />
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
                        color: "#A0A0A0",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      New Customers
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
                      {newCustomers}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography
                        sx={{
                          color: "#39FF14",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        +12%
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        vs last month
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
                    <UserCheck color="#39FF14" size={28} />
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
                        color: "#A0A0A0",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Repeat Customers
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
                      {repeatCustomers}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography
                        sx={{
                          color: "#39FF14",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        +9%
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        vs last month
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
                    <Repeat size={28} color="#39FF14" />
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
                        color: "#A0A0A0",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        display: "block",
                        mb: 1,
                      }}
                    >
                      Total Revenue
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
                      {formatCurrency(totalRevenue)}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUp size={14} color="#39FF14" />
                      <Typography
                        sx={{
                          color: "#39FF14",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        +22%
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontSize: "0.75rem",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        vs last month
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
                    <CreditCard color="#39FF14" size={28} />
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
          {/* Search & Filter Bar */}
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
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
                <Search size={18} color="#A0A0A0" />
                <InputBase
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    ml: 1.5,
                    flex: 1,
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    "& ::placeholder": {
                      color: "#A0A0A0",
                    },
                  }}
                />
              </Box>
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
                  <MenuItem value="Blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={membershipFilter}
                  onChange={(e) => setMembershipFilter(e.target.value as any)}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
                    border: "1px solid rgba(57,255,20,0.2)",
                    borderRadius: 2,
                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: 0 },
                  }}
                >
                  <MenuItem value="All">All Memberships</MenuItem>
                  <MenuItem value="Gold Member">Gold Member</MenuItem>
                  <MenuItem value="Silver Member">Silver Member</MenuItem>
                  <MenuItem value="Bronze Member">Bronze Member</MenuItem>
                  <MenuItem value="Regular Customer">Regular Customer</MenuItem>
                </Select>
              </FormControl>
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
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                  setMembershipFilter("All");
                }}
                sx={{
                  borderColor: "rgba(57,255,20,0.3)",
                  color: "#A0A0A0",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "rgba(57,255,20,0.1)" }} />

          {/* Table / Mobile Cards */}
          {loading ? (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <CircularProgress sx={{ color: "#39FF14" }} />
            </Box>
          ) : filteredCustomers.length === 0 ? (
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
                No Customers Found
              </Typography>
              <Typography
                sx={{
                  color: "#A0A0A0",
                  fontFamily: "Poppins, sans-serif",
                  mb: 3,
                }}
              >
                No customers match your search criteria.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshCw size={18} />}
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                  setMembershipFilter("All");
                  loadData();
                }}
                sx={{
                  borderColor: "rgba(57,255,20,0.3)",
                  color: "#39FF14",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Refresh
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <TableContainer sx={{ maxHeight: "70vh" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "rgba(5,5,5,0.8)" }}>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Customer
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Phone
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Orders
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Total Spent
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Membership
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Joined
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#A0A0A0",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedCustomers.map((customer) => (
                        <motion.tr
                          key={customer.id}
                          whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              {customer.avatar ? (
                                <img
                                  src={customer.avatar}
                                  alt={customer.firstName}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: "rgba(57,255,20,0.2)",
                                    color: "#39FF14",
                                    fontWeight: 700,
                                  }}
                                >
                                  {customer.firstName[0]}
                                  {customer.lastName[0]}
                                </Avatar>
                              )}
                              <Box>
                                <Typography
                                  sx={{
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontFamily: "Poppins, sans-serif",
                                  }}
                                >
                                  {customer.firstName} {customer.lastName}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#A0A0A0",
                                    fontSize: "0.75rem",
                                    fontFamily: "Poppins, sans-serif",
                                  }}
                                >
                                  @{customer.username}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2, color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                            {customer.email}
                          </TableCell>
                          <TableCell sx={{ py: 2, color: "#fff", fontFamily: "Inter, sans-serif" }}>
                            {customer.ordersCount || 0}
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2,
                              color: "#fff",
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 700,
                            }}
                          >
                            {customer.totalSpent ? formatCurrency(customer.totalSpent) : "₦890,000"}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <MembershipChip membership={customer.membership} />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <StatusChip status={customer.status} />
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2,
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.875rem",
                            }}
                          >
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="View Profile">
                                <IconButton
                                  size="small"
                                  sx={{ color: "#A0A0A0" }}
                                  onClick={() => handleViewProfile(customer)}
                                >
                                  <Eye size={16} />
                                </IconButton>
                              </Tooltip>
                              <IconButton
                                size="small"
                                sx={{ color: "#A0A0A0" }}
                                onClick={(e) => handleMenuOpen(e, customer)}
                              >
                                <MoreVertical size={16} />
                              </IconButton>
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
                {paginatedCustomers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(57,255,20,0.03)" }}
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid rgba(57,255,20,0.1)",
                      cursor: "pointer",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          alt={customer.firstName}
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "rgba(57,255,20,0.2)",
                            color: "#39FF14",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {customer.firstName[0]}
                          {customer.lastName[0]}
                        </Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontWeight: 600,
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "1rem",
                              }}
                            >
                              {customer.firstName} {customer.lastName}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#A0A0A0",
                                fontSize: "0.75rem",
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              @{customer.username}
                            </Typography>
                          </Box>
                          <StatusChip status={customer.status} />
                        </Box>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                            mt: 1,
                          }}
                        >
                          {customer.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid rgba(57,255,20,0.08)",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography
                            sx={{
                              color: "#A0A0A0",
                              fontSize: "0.75rem",
                              fontFamily: "Poppins, sans-serif",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                            }}
                          >
                            Total Spent
                          </Typography>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 600,
                              fontFamily: "Inter, sans-serif",
                              fontSize: "1rem",
                            }}
                          >
                            {customer.totalSpent ? formatCurrency(customer.totalSpent) : "₦890,000"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View Profile">
                          <IconButton
                            size="small"
                            sx={{ color: "#A0A0A0" }}
                            onClick={() => handleViewProfile(customer)}
                          >
                            <Eye size={18} />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          size="small"
                          sx={{ color: "#A0A0A0" }}
                          onClick={(e) => handleMenuOpen(e, customer)}
                        >
                          <MoreVertical size={18} />
                        </IconButton>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </>
          )}

          {/* Pagination */}
          {!loading && filteredCustomers.length > 0 && (
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#A0A0A0",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredCustomers.length)} of{" "}
                {filteredCustomers.length} customers
              </Typography>
              <Pagination
                page={page}
                count={totalPages}
                onChange={(_, newPage) => setPage(newPage)}
                sx={{
                  ".MuiPaginationItem-root": {
                    color: "#A0A0A0",
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

      {/* Customer Profile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "450px" },
            background: "#111111",
            borderLeft: "1px solid rgba(57,255,20,0.15)",
          },
        }}
      >
        {selectedCustomer && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Drawer Header */}
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(57,255,20,0.1)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Customer Profile
              </Typography>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ color: "#A0A0A0" }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Customer Info */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                {selectedCustomer.avatar ? (
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.firstName}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "rgba(57,255,20,0.2)",
                      color: "#39FF14",
                      fontWeight: 700,
                      fontSize: "2rem",
                    }}
                  >
                    {selectedCustomer.firstName[0]}
                    {selectedCustomer.lastName[0]}
                  </Avatar>
                )}
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#A0A0A0",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    @{selectedCustomer.username}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <MembershipChip membership={selectedCustomer.membership} />
                    <StatusChip status={selectedCustomer.status} />
                  </Box>
                </Box>
              </Box>

              {/* Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      bgcolor: "rgba(5,5,5,0.5)",
                      border: "1px solid rgba(57,255,20,0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#A0A0A0",
                          textTransform: "uppercase",
                          fontFamily: "Poppins, sans-serif",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Orders
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#39FF14",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {selectedCustomer.ordersCount || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      bgcolor: "rgba(5,5,5,0.5)",
                      border: "1px solid rgba(57,255,20,0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#A0A0A0",
                          textTransform: "uppercase",
                          fontFamily: "Poppins, sans-serif",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Reward Points
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#F5A623",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {selectedCustomer.rewardPoints}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "rgba(57,255,20,0.1)" }}>
                <Tabs
                  value={drawerTab}
                  onChange={(_, newValue) => setDrawerTab(newValue)}
                  sx={{
                    "& .MuiTab-root": {
                      color: "#A0A0A0",
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
                  <Tab label="Overview" />
                  <Tab label="Orders" />
                  <Tab label="Notes" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
                {drawerTab === 0 && (
                  <Box sx={{ p: 3 }}>
                    {/* Contact Info */}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        mb: 2,
                      }}
                    >
                      Contact Information
                    </Typography>
                    <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(5,5,5,0.5)", borderRadius: 2 }}>
                      <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                        <MessageSquare size={18} color="#A0A0A0" />
                        <Typography
                          sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}
                        >
                          {selectedCustomer.email}
                        </Typography>
                      </Box>
                      {selectedCustomer.phone && (
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Smartphone size={18} color="#A0A0A0" />
                          <Typography
                            sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}
                          >
                            {selectedCustomer.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Recent Activity */}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        mb: 2,
                      }}
                    >
                      Recent Activity
                    </Typography>
                    <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(5,5,5,0.5)", borderRadius: 2 }}>
                      {recentActivity.map((activity, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                            mb: idx < recentActivity.length - 1 ? 2 : 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              bgcolor: "rgba(57,255,20,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#39FF14",
                              flexShrink: 0,
                            }}
                          >
                            {activity.icon}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 500,
                              }}
                            >
                              {activity.type}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.75rem",
                              }}
                            >
                              {activity.date}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {drawerTab === 1 && (
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        mb: 2,
                      }}
                    >
                      Order History
                    </Typography>
                    {recentOrders.map((order, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: "rgba(5,5,5,0.5)",
                          borderRadius: 2,
                          border: "1px solid rgba(57,255,20,0.1)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#39FF14",
                              fontWeight: 700,
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {order.id}
                          </Typography>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              bgcolor:
                                order.status === "Delivered"
                                  ? "rgba(57,255,20,0.1)"
                                  : "rgba(245,166,35,0.1)",
                              color: order.status === "Delivered" ? "#39FF14" : "#F5A623",
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                            mb: 1,
                          }}
                        >
                          {order.products}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 700,
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {formatCurrency(order.amount)}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#A0A0A0",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "0.75rem",
                            }}
                          >
                            {order.date}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}

                {drawerTab === 2 && (
                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        mb: 2,
                      }}
                    >
                      Admin Notes
                    </Typography>
                    {customerNotes.map((note, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: "rgba(5,5,5,0.5)",
                          borderRadius: 2,
                          border: "1px solid rgba(57,255,20,0.1)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            mb: 1,
                          }}
                        >
                          {note.text}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          {note.date}
                        </Typography>
                      </Box>
                    ))}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        placeholder="Add a note..."
                        variant="outlined"
                        size="small"
                        multiline
                        rows={2}
                        sx={{
                          "& .MuiInputBase-root": {
                            color: "#fff",
                            bgcolor: "rgba(5,5,5,0.5)",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(57,255,20,0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(57,255,20,0.4)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#39FF14",
                          },
                        }}
                      />
                      <IconButton
                        sx={{
                          bgcolor: "#39FF14",
                          color: "#000",
                          "&:hover": { bgcolor: "#2dd610" },
                        }}
                      >
                        <Send size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => selectedMenuCustomer && handleViewProfile(selectedMenuCustomer)}
        >
          <ListItemIcon>
            <Eye size={18} color="#A0A0A0" />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Edit size={18} color="#A0A0A0" />
          </ListItemIcon>
          <ListItemText>Edit Customer</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => selectedMenuCustomer && handleBlockConfirm(selectedMenuCustomer)}
        >
          <ListItemIcon>
            <Ban size={18} color="#EF4444" />
          </ListItemIcon>
          <ListItemText sx={{ color: "#EF4444" }}>Block Customer</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => selectedMenuCustomer && handleDeleteConfirm(selectedMenuCustomer)}
        >
          <ListItemIcon>
            <Trash2 size={18} color="#EF4444" />
          </ListItemIcon>
          <ListItemText sx={{ color: "#EF4444" }}>Delete Customer</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Customer Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", bgcolor: "#090909" }}>
          Delete Customer?
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#090909" }}>
          <Typography
            sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", mt: 1 }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#090909", px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: "#A0A0A0", textTransform: "none", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteCustomer}
            sx={{
              bgcolor: "#EF4444",
              color: "#fff",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              "&:hover": { bgcolor: "#dc2626" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Customer Dialog */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", bgcolor: "#090909" }}>
          Block Customer?
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#090909" }}>
          <TextField
            label="Reason for blocking"
            multiline
            rows={3}
            fullWidth
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            sx={{
              mt: 1,
              "& .MuiInputBase-root": {
                color: "#fff",
              },
              "& .MuiInputLabel-root": {
                color: "#A0A0A0",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(57,255,20,0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(57,255,20,0.4)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#39FF14",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#090909", px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenBlockDialog(false)}
            sx={{ color: "#A0A0A0", textTransform: "none", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBlockCustomer}
            sx={{
              bgcolor: "#EF4444",
              color: "#fff",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              "&:hover": { bgcolor: "#dc2626" },
            }}
          >
            Block
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
            bgcolor: snackbar.severity === "success" ? "rgba(57,255,20,0.1)" : "rgba(239,68,68,0.1)",
            color: snackbar.severity === "success" ? "#39FF14" : "#EF4444",
            fontFamily: "Poppins, sans-serif",
            border: `1px solid ${
              snackbar.severity === "success" ? "rgba(57,255,20,0.3)" : "rgba(239,68,68,0.3)"
            }`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Repeat icon component
const Repeat = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

// Smartphone icon component
const Smartphone = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);
