"use client";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Drawer,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  TablePagination,
  Paper,
  Skeleton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  Filter,
  RefreshCw,
  Download,
  Printer,
  MoreVertical,
  Eye,
  Edit,
  FileText,
  XCircle,
  Trash2,
  Copy,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageSquare,
  Calendar,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/admin/StatCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAllOrders } from "@/lib/orders";
import type {
  CustomerOrder,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/types/order";

// Sample data for demonstration
const sampleOrders: CustomerOrder[] = [
  {
    id: "1",
    orderNumber: "#LMH-0001248",
    customerId: "101",
    customerName: "Patrick Onwubuya",
    customerEmail: "patrick@gmail.com",
    customerPhone: "+234 801 234 5678",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    products: [
      {
        id: "prod1",
        productId: "p1",
        name: "Lamah Signature Hoodie",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop",
        size: "L",
        color: "Black",
        quantity: 2,
        price: 35000,
      },
      {
        id: "prod2",
        productId: "p2",
        name: "Lamah Cargo Pants",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100&h=100&fit=crop",
        size: "M",
        color: "Olive",
        quantity: 1,
        price: 19000,
      },
    ],
    subtotal: 89000,
    shippingFee: 3000,
    discount: 0,
    tax: 7000,
    total: 89000,
    paymentMethod: "Visa",
    paymentStatus: "Paid",
    transactionId: "txn_1234567890",
    deliveryStatus: "Delivered",
    trackingNumber: "TRK-987654321",
    courier: "DHL",
    estimatedDelivery: "2026-05-22",
    shippingAddress: {
      street: "123 Luxury Street",
      city: "Lekki",
      state: "Lagos",
      postalCode: "106104",
      country: "Nigeria",
    },
    billingAddress: {
      street: "123 Luxury Street",
      city: "Lekki",
      state: "Lagos",
      postalCode: "106104",
      country: "Nigeria",
    },
    status: "Delivered",
    adminNotes: [],
    timeline: [
      { id: "t1", event: "Order Placed", description: "Order confirmed by customer", timestamp: "2026-05-18T10:30:00", completed: true },
      { id: "t2", event: "Payment Confirmed", description: "Payment received via Visa", timestamp: "2026-05-18T10:35:00", completed: true },
      { id: "t3", event: "Processing", description: "Order is being prepared", timestamp: "2026-05-19T09:00:00", completed: true },
      { id: "t4", event: "Packed", description: "Order has been packed", timestamp: "2026-05-19T14:00:00", completed: true },
      { id: "t5", event: "Shipped", description: "Order has been shipped", timestamp: "2026-05-20T08:00:00", completed: true },
      { id: "t6", event: "Out For Delivery", description: "Out for delivery", timestamp: "2026-05-22T07:00:00", completed: true },
      { id: "t7", event: "Delivered", description: "Order delivered successfully", timestamp: "2026-05-22T15:30:00", completed: true },
    ],
    createdAt: "2026-05-18T10:30:00",
    updatedAt: "2026-05-22T15:30:00",
  },
  {
    id: "2",
    orderNumber: "#LMH-0001247",
    customerId: "102",
    customerName: "Chiamaka Okafor",
    customerEmail: "chiamaka@gmail.com",
    customerPhone: "+234 802 345 6789",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    products: [
      {
        id: "prod3",
        productId: "p3",
        name: "Lamah Oversized Tee",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
        size: "XL",
        color: "White",
        quantity: 3,
        price: 18000,
      },
    ],
    subtotal: 54000,
    shippingFee: 2500,
    discount: 5000,
    tax: 4500,
    total: 56000,
    paymentMethod: "Mastercard",
    paymentStatus: "Paid",
    transactionId: "txn_0987654321",
    deliveryStatus: "Shipped",
    trackingNumber: "TRK-123456789",
    courier: "FedEx",
    estimatedDelivery: "2026-05-24",
    shippingAddress: {
      street: "456 Fashion Avenue",
      city: "Victoria Island",
      state: "Lagos",
      postalCode: "101241",
      country: "Nigeria",
    },
    billingAddress: {
      street: "456 Fashion Avenue",
      city: "Victoria Island",
      state: "Lagos",
      postalCode: "101241",
      country: "Nigeria",
    },
    status: "Shipped",
    adminNotes: [],
    timeline: [
      { id: "t1", event: "Order Placed", description: "Order confirmed by customer", timestamp: "2026-05-17T14:45:00", completed: true },
      { id: "t2", event: "Payment Confirmed", description: "Payment received via Mastercard", timestamp: "2026-05-17T14:48:00", completed: true },
      { id: "t3", event: "Processing", description: "Order is being prepared", timestamp: "2026-05-18T10:00:00", completed: true },
      { id: "t4", event: "Packed", description: "Order has been packed", timestamp: "2026-05-18T16:00:00", completed: true },
      { id: "t5", event: "Shipped", description: "Order has been shipped", timestamp: "2026-05-20T10:00:00", completed: true },
      { id: "t6", event: "Out For Delivery", description: "", timestamp: "", completed: false },
      { id: "t7", event: "Delivered", description: "", timestamp: "", completed: false },
    ],
    createdAt: "2026-05-17T14:45:00",
    updatedAt: "2026-05-20T10:00:00",
  },
  {
    id: "3",
    orderNumber: "#LMH-0001246",
    customerId: "103",
    customerName: "Emeka Nnamdi",
    customerEmail: "emeka@gmail.com",
    customerPhone: "+234 803 456 7890",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    products: [
      {
        id: "prod4",
        productId: "p4",
        name: "Lamah Classic Cap",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&h=100&fit=crop",
        size: "One Size",
        color: "Black",
        quantity: 1,
        price: 12000,
      },
      {
        id: "prod5",
        productId: "p5",
        name: "Lamah Slides",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop",
        size: "42",
        color: "Neon Green",
        quantity: 1,
        price: 33000,
      },
    ],
    subtotal: 45000,
    shippingFee: 2000,
    discount: 0,
    tax: 3800,
    total: 45000,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    transactionId: "",
    deliveryStatus: "Processing",
    trackingNumber: "",
    courier: "",
    estimatedDelivery: "2026-05-25",
    shippingAddress: {
      street: "789 Streetwear Lane",
      city: "Abuja",
      state: "FCT",
      postalCode: "900001",
      country: "Nigeria",
    },
    billingAddress: {
      street: "789 Streetwear Lane",
      city: "Abuja",
      state: "FCT",
      postalCode: "900001",
      country: "Nigeria",
    },
    status: "Processing",
    adminNotes: [],
    timeline: [
      { id: "t1", event: "Order Placed", description: "Order confirmed by customer", timestamp: "2026-05-16T09:20:00", completed: true },
      { id: "t2", event: "Payment Confirmed", description: "Awaiting bank transfer confirmation", timestamp: "", completed: false },
      { id: "t3", event: "Processing", description: "Order is being prepared", timestamp: "2026-05-17T11:00:00", completed: true },
      { id: "t4", event: "Packed", description: "", timestamp: "", completed: false },
      { id: "t5", event: "Shipped", description: "", timestamp: "", completed: false },
      { id: "t6", event: "Out For Delivery", description: "", timestamp: "", completed: false },
      { id: "t7", event: "Delivered", description: "", timestamp: "", completed: false },
    ],
    createdAt: "2026-05-16T09:20:00",
    updatedAt: "2026-05-17T11:00:00",
  },
  {
    id: "4",
    orderNumber: "#LMH-0001245",
    customerId: "104",
    customerName: "Adaobi Eze",
    customerEmail: "adaobi@gmail.com",
    customerPhone: "+234 804 567 8901",
    customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    products: [
      {
        id: "prod6",
        productId: "p6",
        name: "Lamah Bomber Jacket",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
        size: "M",
        color: "Navy",
        quantity: 1,
        price: 75000,
      },
    ],
    subtotal: 75000,
    shippingFee: 3500,
    discount: 0,
    tax: 6300,
    total: 78500,
    paymentMethod: "Stripe",
    paymentStatus: "Paid",
    transactionId: "pi_abcdefghijklmn",
    deliveryStatus: "Out For Delivery",
    trackingNumber: "TRK-456123789",
    courier: "UPS",
    estimatedDelivery: "2026-05-21",
    shippingAddress: {
      street: "101 Premium Drive",
      city: "Port Harcourt",
      state: "Rivers",
      postalCode: "500001",
      country: "Nigeria",
    },
    billingAddress: {
      street: "101 Premium Drive",
      city: "Port Harcourt",
      state: "Rivers",
      postalCode: "500001",
      country: "Nigeria",
    },
    status: "Out For Delivery",
    adminNotes: [],
    timeline: [
      { id: "t1", event: "Order Placed", description: "Order confirmed by customer", timestamp: "2026-05-15T16:10:00", completed: true },
      { id: "t2", event: "Payment Confirmed", description: "Payment received via Stripe", timestamp: "2026-05-15T16:12:00", completed: true },
      { id: "t3", event: "Processing", description: "Order is being prepared", timestamp: "2026-05-16T08:00:00", completed: true },
      { id: "t4", event: "Packed", description: "Order has been packed", timestamp: "2026-05-16T14:30:00", completed: true },
      { id: "t5", event: "Shipped", description: "Order has been shipped", timestamp: "2026-05-18T09:00:00", completed: true },
      { id: "t6", event: "Out For Delivery", description: "Out for delivery", timestamp: "2026-05-21T07:30:00", completed: true },
      { id: "t7", event: "Delivered", description: "", timestamp: "", completed: false },
    ],
    createdAt: "2026-05-15T16:10:00",
    updatedAt: "2026-05-21T07:30:00",
  },
  {
    id: "5",
    orderNumber: "#LMH-0001244",
    customerId: "105",
    customerName: "Ifeanyi Chukwu",
    customerEmail: "ifeanyi@gmail.com",
    customerPhone: "+234 805 678 9012",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    products: [
      {
        id: "prod7",
        productId: "p7",
        name: "Lamah Denim Jacket",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop",
        size: "L",
        color: "Blue",
        quantity: 1,
        price: 85000,
      },
    ],
    subtotal: 85000,
    shippingFee: 3000,
    discount: 10000,
    tax: 7200,
    total: 85200,
    paymentMethod: "PayPal",
    paymentStatus: "Failed",
    transactionId: "",
    deliveryStatus: "Cancelled",
    trackingNumber: "",
    courier: "",
    estimatedDelivery: "",
    shippingAddress: {
      street: "202 Luxury Boulevard",
      city: "Ikeja",
      state: "Lagos",
      postalCode: "100001",
      country: "Nigeria",
    },
    billingAddress: {
      street: "202 Luxury Boulevard",
      city: "Ikeja",
      state: "Lagos",
      postalCode: "100001",
      country: "Nigeria",
    },
    status: "Cancelled",
    adminNotes: [],
    timeline: [
      { id: "t1", event: "Order Placed", description: "Order confirmed by customer", timestamp: "2026-05-14T11:30:00", completed: true },
      { id: "t2", event: "Payment Confirmed", description: "Payment failed", timestamp: "2026-05-14T11:35:00", completed: false },
      { id: "t3", event: "Processing", description: "", timestamp: "", completed: false },
      { id: "t4", event: "Packed", description: "", timestamp: "", completed: false },
      { id: "t5", event: "Shipped", description: "", timestamp: "", completed: false },
      { id: "t6", event: "Out For Delivery", description: "", timestamp: "", completed: false },
      { id: "t7", event: "Delivered", description: "", timestamp: "", completed: false },
    ],
    createdAt: "2026-05-14T11:30:00",
    updatedAt: "2026-05-14T11:35:00",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuOrder, setCurrentMenuOrder] = useState<CustomerOrder | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchAllOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders(sampleOrders);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped" || o.status === "Out For Delivery").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter;
    const matchesDelivery = deliveryFilter === "All" || order.deliveryStatus === deliveryFilter;

    return matchesSearch && matchesStatus && matchesPayment && matchesDelivery;
  });

  // Pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get status badge color
  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
        return "info";
      case "Shipped":
      case "Out For Delivery":
        return "secondary";
      case "Pending":
        return "warning";
      case "Cancelled":
      case "Returned":
        return "error";
      default:
        return "default";
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "#39FF14";
      case "Pending":
        return "#F5A623";
      case "Failed":
        return "#EF4444";
      case "Refunded":
        return "#9E9E9E";
      default:
        return "#A0A0A0";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle menu
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: CustomerOrder) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenuOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenuOrder(null);
  };

  // Handle view order
  const handleViewOrder = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
    handleMenuClose();
  };

  // Handle add note
  const handleAddNote = () => {
    if (!selectedOrder || !noteText.trim()) return;
    setSelectedOrder({
      ...selectedOrder,
      adminNotes: [
        ...selectedOrder.adminNotes,
        {
          id: `note-${Date.now()}`,
          text: noteText.trim(),
          adminId: "admin-1",
          adminName: "Admin",
          createdAt: new Date().toISOString(),
        },
      ],
    });
    setNoteText("");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "none", mx: 0, px: 0 }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
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
              Orders
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                Orders
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              sx={{
                borderColor: "rgba(57,255,20,0.3)",
                color: "#fff",
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
            <Button
              variant="outlined"
              startIcon={<Printer size={18} />}
              sx={{
                borderColor: "rgba(57,255,20,0.3)",
                color: "#fff",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                "&:hover": {
                  borderColor: "#39FF14",
                  bgcolor: "rgba(57,255,20,0.05)",
                },
              }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshCw size={18} />}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 800);
              }}
              sx={{
                borderColor: "rgba(57,255,20,0.3)",
                color: "#fff",
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
        {loading ? (
          // Skeleton loaders for stats
          Array.from({ length: 5 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                title="Total Orders"
                value={totalOrders.toLocaleString()}
                icon={ShoppingCart}
                change={18}
                changeLabel="vs last month"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                icon={DollarSign}
                change={22}
                changeLabel="vs last month"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                title="Pending Orders"
                value={pendingOrders.toLocaleString()}
                icon={Clock}
                change={8}
                changeLabel="vs last month"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                title="Shipped Orders"
                value={shippedOrders.toLocaleString()}
                icon={Truck}
                change={15}
                changeLabel="vs last month"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                title="Completed Orders"
                value={deliveredOrders.toLocaleString()}
                icon={CheckCircle2}
                change={20}
                changeLabel="vs last month"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Search & Filter Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card
          sx={{
            background: "#111111",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="#A0A0A0" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      bgcolor: "rgba(5,5,5,0.5)",
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
                      color: "#A0A0A0",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(5,5,5,0.5)",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    }}
                  >
                    <MenuItem value="All">All Status</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Out For Delivery">Out For Delivery</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Returned">Returned</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <Select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    displayEmpty
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(5,5,5,0.5)",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    }}
                  >
                    <MenuItem value="All">All Payment</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                    <MenuItem value="Refunded">Refunded</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <Select
                    value={deliveryFilter}
                    onChange={(e) => setDeliveryFilter(e.target.value)}
                    displayEmpty
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(5,5,5,0.5)",
                      "& fieldset": {
                        borderColor: "rgba(57,255,20,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(57,255,20,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#39FF14",
                      },
                    }}
                  >
                    <MenuItem value="All">All Delivery</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Out For Delivery">Out For Delivery</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Filter size={18} />}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setPaymentFilter("All");
                    setDeliveryFilter("All");
                  }}
                  sx={{
                    borderColor: "rgba(57,255,20,0.3)",
                    color: "#39FF14",
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif",
                    py: 1.5,
                    "&:hover": {
                      borderColor: "#39FF14",
                      bgcolor: "rgba(57,255,20,0.05)",
                    },
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card
          sx={{
            background: "#111111",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 3,
            mb: 3,
          }}
        >
          {loading ? (
            <Box sx={{ p: 4 }}>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "rgba(5,5,5,0.5)" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Order ID
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Customer
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Payment
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Delivery
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Box sx={{ py: 8, textAlign: "center" }}>
                            <Package size={64} color="#A0A0A0" />
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                mt: 2,
                                mb: 1,
                              }}
                            >
                              No Orders Found
                            </Typography>
                            <Typography
                              sx={{
                                color: "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                                mb: 3,
                              }}
                            >
                              No customer orders match your search.
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("All");
                                setPaymentFilter("All");
                                setDeliveryFilter("All");
                              }}
                              sx={{
                                bgcolor: "#39FF14",
                                color: "#000",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "#2dd610",
                                },
                              }}
                            >
                              Refresh Orders
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedOrders.map((order, index) => (
                        <TableRow
                          key={order.id}
                          hover
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "rgba(57,255,20,0.02)",
                            },
                            "& .MuiTableCell-root": {
                              borderBottom: "1px solid rgba(57,255,20,0.1)",
                            },
                          }}
                        >
                          <TableCell sx={{ color: "#fff" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontWeight: 600,
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                {order.orderNumber}
                              </Typography>
                              <Tooltip title="Copy Order ID">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(order.orderNumber);
                                  }}
                                  sx={{ color: "#A0A0A0" }}
                                >
                                  <Copy size={14} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar
                                src={order.customerAvatar}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: "#39FF14",
                                  color: "#000",
                                  fontWeight: 700,
                                }}
                              >
                                {order.customerName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography
                                  sx={{
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {order.customerName}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#A0A0A0",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {order.customerEmail}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.875rem",
                              }}
                            >
                              {formatDate(order.createdAt)}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.75rem",
                              }}
                            >
                              {formatTime(order.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: getPaymentStatusColor(order.paymentStatus),
                                }}
                              />
                              <Box>
                                <Typography
                                  sx={{
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {order.paymentStatus}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#A0A0A0",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {order.paymentMethod}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "0.875rem",
                              }}
                            >
                              {order.deliveryStatus}
                            </Typography>
                            {order.estimatedDelivery && (
                              <Typography
                                sx={{
                                  color: "#A0A0A0",
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {formatDate(order.estimatedDelivery)}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusBadgeColor(order.status) as any}
                              sx={{
                                fontWeight: 600,
                                fontFamily: "Poppins, sans-serif",
                                borderRadius: 999,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontWeight: 700,
                                fontFamily: "Inter, sans-serif",
                                fontSize: "1rem",
                              }}
                            >
                              {formatCurrency(order.total)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="View Order">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewOrder(order)}
                                  sx={{
                                    border: "1px solid rgba(57,255,20,0.2)",
                                    color: "#39FF14",
                                    "&:hover": {
                                      borderColor: "#39FF14",
                                      bgcolor: "rgba(57,255,20,0.05)",
                                    },
                                  }}
                                >
                                  <Eye size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="More Options">
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleMenuClick(e, order)}
                                  sx={{
                                    border: "1px solid rgba(57,255,20,0.2)",
                                    color: "#A0A0A0",
                                    "&:hover": {
                                      borderColor: "#39FF14",
                                      bgcolor: "rgba(57,255,20,0.05)",
                                      color: "#39FF14",
                                    },
                                  }}
                                >
                                  <MoreVertical size={18} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredOrders.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  color: "#fff",
                  "& .MuiTablePagination-selectIcon": {
                    color: "#fff",
                  },
                  "& .MuiTablePagination-actions button": {
                    color: "#fff",
                  },
                }}
              />
            </>
          )}
        </Card>
      </motion.div>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: "#111111",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 3,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={() => currentMenuOrder && handleViewOrder(currentMenuOrder)}>
          <ListItemIcon>
            <Eye size={18} color="#39FF14" />
          </ListItemIcon>
          <ListItemText primary="View Order" sx={{ color: "#fff" }} />
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setStatusDialogOpen(true); }}>
          <ListItemIcon>
            <Edit size={18} color="#39FF14" />
          </ListItemIcon>
          <ListItemText primary="Update Status" sx={{ color: "#fff" }} />
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); }}>
          <ListItemIcon>
            <Printer size={18} color="#39FF14" />
          </ListItemIcon>
          <ListItemText primary="Print Invoice" sx={{ color: "#fff" }} />
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); }}>
          <ListItemIcon>
            <Download size={18} color="#39FF14" />
          </ListItemIcon>
          <ListItemText primary="Download Invoice" sx={{ color: "#fff" }} />
        </MenuItem>
        <Divider sx={{ borderColor: "rgba(57,255,20,0.15)" }} />
        <MenuItem onClick={() => { handleMenuClose(); }} sx={{ color: "#F5A623" }}>
          <ListItemIcon>
            <XCircle size={18} color="#F5A623" />
          </ListItemIcon>
          <ListItemText primary="Cancel Order" />
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setDeleteDialogOpen(true); }} sx={{ color: "#EF4444" }}>
          <ListItemIcon>
            <Trash2 size={18} color="#EF4444" />
          </ListItemIcon>
          <ListItemText primary="Delete Order" />
        </MenuItem>
      </Menu>

      {/* Order Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "500px" },
            bgcolor: "#050505",
            borderLeft: "1px solid rgba(57,255,20,0.15)",
          },
        }}
      >
        {selectedOrder && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Drawer Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid rgba(57,255,20,0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Order Details
                </Typography>
                <Typography
                  sx={{
                    color: "#39FF14",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {selectedOrder.orderNumber}
                </Typography>
              </Box>
              <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#A0A0A0" }}>
                <ChevronRight size={24} />
              </IconButton>
            </Box>

            {/* Drawer Content */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
              {/* Customer Info */}
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <User size={20} color="#39FF14" />
                    Customer
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar
                      src={selectedOrder.customerAvatar}
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "#39FF14",
                        color: "#000",
                        fontWeight: 700,
                      }}
                    >
                      {selectedOrder.customerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "1rem",
                        }}
                      >
                        {selectedOrder.customerName}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        {selectedOrder.customerEmail}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        {selectedOrder.customerPhone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Shipping & Billing Address */}
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <MapPin size={20} color="#39FF14" />
                        Shipping Address
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedOrder.shippingAddress.street}
                        <br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                        <br />
                        {selectedOrder.shippingAddress.country}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <MapPin size={20} color="#39FF14" />
                        Billing Address
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedOrder.billingAddress.street}
                        <br />
                        {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.postalCode}
                        <br />
                        {selectedOrder.billingAddress.country}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Products */}
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 2,
                    }}
                  >
                    Products
                  </Typography>
                  {selectedOrder.products.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: "flex",
                        gap: 2,
                        py: 2,
                        borderBottom: "1px solid rgba(57,255,20,0.1)",
                        "&:last-child": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "rgba(5,5,5,0.5)",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.75rem",
                          }}
                        >
                          Size: {product.size} | Color: {product.color}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "0.875rem",
                          }}
                        >
                          Qty: {product.quantity} x {formatCurrency(product.price)}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {formatCurrency(product.price * product.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 2,
                    }}
                  >
                    Order Summary
                  </Typography>
                  <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      sx={{ color: "#fff", fontFamily: "Inter, sans-serif" }}
                    >
                      {formatCurrency(selectedOrder.subtotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}
                    >
                      Shipping
                    </Typography>
                    <Typography
                      sx={{ color: "#fff", fontFamily: "Inter, sans-serif" }}
                    >
                      {formatCurrency(selectedOrder.shippingFee)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}
                    >
                      Discount
                    </Typography>
                    <Typography
                      sx={{ color: "#EF4444", fontFamily: "Inter, sans-serif" }}
                    >
                      -{formatCurrency(selectedOrder.discount)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}
                    >
                      Tax
                    </Typography>
                    <Typography
                      sx={{ color: "#fff", fontFamily: "Inter, sans-serif" }}
                    >
                      {formatCurrency(selectedOrder.tax)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: "rgba(57,255,20,0.15)", my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "1.125rem",
                      }}
                    >
                      Total
                    </Typography>
                    <Typography
                      sx={{
                        color: "#39FF14",
                        fontWeight: 700,
                        fontFamily: "Inter, sans-serif",
                        fontSize: "1.125rem",
                      }}
                    >
                      {formatCurrency(selectedOrder.total)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Payment & Delivery Info */}
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CreditCard size={20} color="#39FF14" />
                    Payment & Delivery
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", mb: 0.5 }}
                    >
                      Payment Method
                    </Typography>
                    <Typography
                      sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedOrder.paymentMethod}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", mb: 0.5 }}
                    >
                      Payment Status
                    </Typography>
                    <Chip
                      label={selectedOrder.paymentStatus}
                      sx={{
                        bgcolor: `${getPaymentStatusColor(selectedOrder.paymentStatus)}20`,
                        color: getPaymentStatusColor(selectedOrder.paymentStatus),
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        borderRadius: 999,
                      }}
                    />
                  </Box>
                  {selectedOrder.transactionId && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", mb: 0.5 }}
                      >
                        Transaction ID
                      </Typography>
                      <Typography
                        sx={{ color: "#fff", fontFamily: "Inter, sans-serif" }}
                      >
                        {selectedOrder.transactionId}
                      </Typography>
                    </Box>
                  )}
                  {selectedOrder.courier && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", mb: 0.5 }}
                      >
                        Courier
                      </Typography>
                      <Typography
                        sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins, sans-serif" }}
                      >
                        {selectedOrder.courier}
                      </Typography>
                    </Box>
                  )}
                  {selectedOrder.trackingNumber && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", mb: 0.5 }}
                      >
                        Tracking Number
                      </Typography>
                      <Typography
                        sx={{ color: "#fff", fontFamily: "Inter, sans-serif" }}
                      >
                        {selectedOrder.trackingNumber}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 2,
                    }}
                  >
                    Order Timeline
                  </Typography>
                  <Stepper orientation="vertical" activeStep={-1}>
                    {selectedOrder.timeline.map((step, index) => (
                      <Step key={step.id} completed={step.completed}>
                        <StepLabel
                          sx={{
                            "& .MuiStepLabel-label": {
                              color: step.completed ? "#39FF14" : "#A0A0A0",
                              fontWeight: step.completed ? 600 : 400,
                              fontFamily: "Poppins, sans-serif",
                            },
                            "& .MuiStepIcon-root": {
                              color: step.completed ? "#39FF14" : "#A0A0A0",
                            },
                            "& .MuiStepIcon-root.Mui-completed": {
                              color: "#39FF14",
                            },
                            "& .MuiStepIcon-root.Mui-active": {
                              color: "#39FF14",
                            },
                          }}
                        >
                          {step.event}
                        </StepLabel>
                        {step.description && (
                          <StepContent sx={{ color: "#A0A0A0" }}>
                            <Typography sx={{ fontFamily: "Poppins, sans-serif", mb: 0.5 }}>
                              {step.description}
                            </Typography>
                            {step.timestamp && (
                              <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem" }}>
                                {formatDate(step.timestamp)} {formatTime(step.timestamp)}
                              </Typography>
                            )}
                          </StepContent>
                        )}
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>

              {/* Admin Notes */}
              <Card
                sx={{
                  background: "#111111",
                  border: "1px solid rgba(57,255,20,0.15)",
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <MessageSquare size={20} color="#39FF14" />
                    Admin Notes
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Add a note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#fff",
                          bgcolor: "rgba(5,5,5,0.5)",
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
                          color: "#A0A0A0",
                        },
                        mb: 1,
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Send size={18} />}
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      sx={{
                        bgcolor: "#39FF14",
                        color: "#000",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#2dd610",
                        },
                      }}
                    >
                      Add Note
                    </Button>
                  </Box>
                  {selectedOrder.adminNotes.map((note) => (
                    <Box
                      key={note.id}
                      sx={{
                        p: 2,
                        bgcolor: "rgba(5,5,5,0.5)",
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                          mb: 0.5,
                        }}
                      >
                        {note.adminName}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.875rem",
                          mb: 0.5,
                        }}
                      >
                        {note.text}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#666",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.75rem",
                        }}
                      >
                        {formatDate(note.createdAt)} {formatTime(note.createdAt)}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>

            {/* Drawer Footer */}
            <Box
              sx={{
                p: 3,
                borderTop: "1px solid rgba(57,255,20,0.15)",
                display: "flex",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderColor: "rgba(57,255,20,0.3)",
                  color: "#fff",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": {
                    borderColor: "#39FF14",
                    bgcolor: "rgba(57,255,20,0.05)",
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setStatusDialogOpen(true)}
                sx={{
                  bgcolor: "#39FF14",
                  color: "#000",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#2dd610",
                  },
                }}
              >
                Update Status
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#111111",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
          Delete Order?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              bgcolor: "#EF4444",
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#dc2626",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#111111",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: 3,
          },
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
          Update Order Status
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#A0A0A0" }}>Order Status</InputLabel>
                <Select
                  defaultValue="Processing"
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
                    "& fieldset": {
                      borderColor: "rgba(57,255,20,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(57,255,20,0.4)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#39FF14",
                    },
                  }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Out For Delivery">Out For Delivery</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Returned">Returned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#A0A0A0" }}>Payment Status</InputLabel>
                <Select
                  defaultValue="Paid"
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
                    "& fieldset": {
                      borderColor: "rgba(57,255,20,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(57,255,20,0.4)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#39FF14",
                    },
                  }}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                  <MenuItem value="Refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#A0A0A0" }}>Delivery Status</InputLabel>
                <Select
                  defaultValue="Shipped"
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
                    "& fieldset": {
                      borderColor: "rgba(57,255,20,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(57,255,20,0.4)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#39FF14",
                    },
                  }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Out For Delivery">Out For Delivery</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Courier"
                placeholder="DHL, FedEx, UPS, etc."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
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
                    color: "#A0A0A0",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tracking Number"
                placeholder="Enter tracking number"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
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
                    color: "#A0A0A0",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Estimated Delivery Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "rgba(5,5,5,0.5)",
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
                    color: "#A0A0A0",
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setStatusDialogOpen(false)}
            sx={{
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setStatusDialogOpen(false)}
            sx={{
              bgcolor: "#39FF14",
              color: "#000",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#2dd610",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
