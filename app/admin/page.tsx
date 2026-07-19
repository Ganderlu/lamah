
"use client";

import {
  Box,
  Container,
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
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  FileText,
  Plus,
  RefreshCw,
  MessageSquare,
  Tags,
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/admin/StatCard";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/categories";
import { fetchNewArrivals } from "@/lib/newArrivals";
import type { Category } from "@/types/category";
import type { NewArrival } from "@/types/newArrival";

// Sample data for other sections that don't have real data yet
const recentOrders = [
  {
    id: "#LO8721",
    customer: "Michael Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&auto=format&fit=crop&q=60",
    products: "Lamah Signature Hoodie, Oversized Tee",
    date: "May 21, 2024",
    amount: "$245.99",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#LO8720",
    customer: "Sarah Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&auto=format&fit=crop&q=60",
    products: "Cargo Pants, Street Jacket",
    date: "May 21, 2024",
    amount: "$389.98",
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "#LO8719",
    customer: "David Brown",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=60",
    products: "Minimal Sweatshirt",
    date: "May 20, 2024",
    amount: "$99.99",
    payment: "Pending",
    status: "Shipped",
  },
];

const customerActivity = [
  {
    type: "New Customer",
    user: "Emily Anderson",
    time: "2 min ago",
  },
  {
    type: "Review Added",
    user: "James Rodriguez",
    time: "15 min ago",
  },
  {
    type: "New Order",
    user: "Olivia Martinez",
    time: "28 min ago",
  },
];

const latestReviews = [
  {
    user: "Amanda Green",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&auto=format&fit=crop&q=60",
    product: "Lamah Signature Hoodie",
    productImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=64&auto=format&fit=crop&q=60",
    rating: 5,
    review: "Amazing quality! The hoodie is super comfortable and fits perfectly. Definitely worth the price.",
    date: "May 20, 2024",
  },
];

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, arrivals] = await Promise.all([
          fetchCategories(),
          fetchNewArrivals(),
        ]);
        setCategories(cats);
        setNewArrivals(arrivals);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === "Active").length;
  const totalNewArrivals = newArrivals.length;
  const activeNewArrivals = newArrivals.filter(a => a.status === "Active").length;
  const featuredNewArrivals = newArrivals.filter(a => a.featured).length;

  // Create dynamic stats array
  const stats = [
    {
      title: "Total Categories",
      value: totalCategories.toString(),
      icon: Tags,
      change: activeCategories,
      changeLabel: "Active",
      showPercent: false,
    },
    {
      title: "New Arrivals",
      value: totalNewArrivals.toString(),
      icon: Package,
      change: activeNewArrivals,
      changeLabel: "Active",
      showPercent: false,
    },
    {
      title: "Featured Products",
      value: featuredNewArrivals.toString(),
      icon: TrendingUp,
      change: 0,
      changeLabel: "vs last week",
      showPercent: true,
    },
  ];

  // Top products (use new arrivals sorted by views or orders)
  const topProducts = [...newArrivals]
    .sort((a, b) => (b.orders || 0) - (a.orders || 0))
    .slice(0, 5);

  // Low stock products (use new arrivals with stock < 10)
  const lowStockProducts = [...newArrivals]
    .filter(p => p.stock < 10)
    .slice(0, 3);

  return (
    <Box sx={{ maxWidth: "1800px", mx: "auto", width: "100%" }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Bebas Neue, cursive",
              color: "#fff",
              letterSpacing: "0.1em",
              mb: 1,
            }}
          >
            Welcome back, Admin 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#9E9E9E",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Here's what's happening with your store today.
          </Typography>
        </Box>
      </motion.div>

      {/* Statistics Cards */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#39FF14" }} />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Sales Analytics, Recent Orders */}
        <Grid item xs={12} lg={8}>
          {/* Sales Analytics Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Sales Analytics
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9E9E9E",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Weekly overview
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip label="Revenue" size="small" sx={{ bgcolor: "rgba(57,255,20,0.1)", color: "#39FF14" }} />
                    <Chip label="Orders" size="small" sx={{ bgcolor: "rgba(158,158,158,0.1)", color: "#9E9E9E" }} />
                    <Chip label="Profit" size="small" sx={{ bgcolor: "rgba(158,158,158,0.1)", color: "#9E9E9E" }} />
                  </Box>
                </Box>

                {/* Sales Chart Placeholder */}
                <Box
                  sx={{
                    height: 280,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    background: "linear-gradient(135deg, rgba(57,255,20,0.05) 0%, rgba(5,5,5,1) 100%)",
                    border: "1px dashed rgba(57,255,20,0.2)",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9E9E9E",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Sales Chart will be here using Recharts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
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
                    Recent Orders
                  </Typography>
                  <Link href="/admin/orders" passHref style={{ textDecoration: "none" }}>
                    <Button
                      variant="text"
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      View All
                    </Button>
                  </Link>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order, index) => (
                        <TableRow key={order.id}>
                          <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar src={order.avatar} />
                              <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                                {order.customer}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#9E9E9E" }}>
                            {order.date}
                          </TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                            {order.amount}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.payment}
                              size="small"
                              sx={{
                                bgcolor:
                                  order.payment === "Paid"
                                    ? "rgba(57,255,20,0.1)"
                                    : "rgba(245,166,35,0.1)",
                                color:
                                  order.payment === "Paid" ? "#39FF14" : "#F5A623",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              size="small"
                              sx={{
                                bgcolor:
                                  order.status === "Delivered"
                                    ? "rgba(57,255,20,0.1)"
                                    : order.status === "Shipped"
                                    ? "rgba(245,166,35,0.1)"
                                    : "rgba(158,158,158,0.1)",
                                color:
                                  order.status === "Delivered"
                                    ? "#39FF14"
                                    : order.status === "Shipped"
                                    ? "#F5A623"
                                    : "#9E9E9E",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton size="small" sx={{ color: "#9E9E9E" }}>
                                <Eye size={16} />
                              </IconButton>
                              <IconButton size="small" sx={{ color: "#9E9E9E" }}>
                                <Edit size={16} />
                              </IconButton>
                              <IconButton size="small" sx={{ color: "#9E9E9E" }}>
                                <FileText size={16} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Column - Revenue Summary, Today's Summary, Top Products, Low Stock, etc */}
        <Grid item xs={12} lg={4}>
          {/* Revenue Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card sx={{ mb: 3 }}>
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
                  Revenue Statistics
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    { label: "Total Revenue", value: "$2,456,000", color: "#39FF14" },
                    { label: "Net Revenue", value: "$1,245,000", color: "#fff" },
                    { label: "Total Cost", value: "$1,211,000", color: "#FF4D4F" },
                    { label: "Profit Margin", value: "50.7%", color: "#39FF14" },
                  ].map((item, index) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                      }}
                    >
                      <Typography sx={{ color: "#9E9E9E" }}>
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: item.color,
                          fontWeight: 700,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
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
                  Today's Summary
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    { label: "Today's Sales", value: "$45,600", icon: DollarSign },
                    { label: "Pending Orders", value: "32", icon: ShoppingCart },
                    { label: "Active Users", value: "287", icon: Users },
                    { label: "Refund Requests", value: "2", icon: RefreshCw },
                  ].map((item, index) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: "rgba(57,255,20,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <item.icon size={18} color="#39FF14" />
                        </Box>
                        <Typography sx={{ color: "#9E9E9E" }}>
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Selling Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
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
                    Top Selling Products
                  </Typography>
                  <Link href="/admin/products" passHref style={{ textDecoration: "none" }}>
                    <Button
                      variant="text"
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      View All
                    </Button>
                  </Link>
                </Box>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: "#39FF14" }} />
                  </Box>
                ) : topProducts.length === 0 ? (
                  <Typography sx={{ color: "#9E9E9E", textAlign: "center", py: 4 }}>
                    No new arrivals yet
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {topProducts.map((product) => (
                      <Box
                        key={product.id}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1.5,
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.productName}
                              width={60}
                              height={60}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Box sx={{ width: 60, height: 60, bgcolor: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Package size={24} color="#9E9E9E" />
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 500,
                              mb: 0.5,
                            }}
                          >
                            {product.productName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              color: "#9E9E9E",
                              fontSize: "0.75rem",
                            }}
                          >
                            <Typography>{product.orders || 0} units sold</Typography>
                            <Typography>•</Typography>
                            <Typography>${(product.discountPrice || product.price).toFixed(2)}</Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" sx={{ color: "#39FF14" }}>
                          <Edit size={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Low Stock Alert */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
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
                    Low Stock Alert
                  </Typography>
                  <Link href="/admin/inventory" passHref style={{ textDecoration: "none" }}>
                    <Button
                      variant="text"
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      View All
                    </Button>
                  </Link>
                </Box>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: "#39FF14" }} />
                  </Box>
                ) : lowStockProducts.length === 0 ? (
                  <Typography sx={{ color: "#9E9E9E", textAlign: "center", py: 4 }}>
                    All products are in stock
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {lowStockProducts.map((product) => (
                      <Box
                        key={product.id}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1.5,
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.productName}
                              width={60}
                              height={60}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Box sx={{ width: 60, height: 60, bgcolor: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Package size={24} color="#9E9E9E" />
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 500,
                              mb: 0.5,
                            }}
                          >
                            {product.productName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={`Stock: ${product.stock}`}
                              size="small"
                              sx={{
                                bgcolor:
                                  product.stock < 5
                                    ? "rgba(255,77,79,0.1)"
                                    : "rgba(245,166,35,0.1)",
                                color:
                                  product.stock < 5 ? "#FF4D4F" : "#F5A623",
                              }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Plus size={14} />}
                              sx={{
                                bgcolor: "#39FF14",
                                color: "#000",
                                textTransform: "none",
                                fontFamily: "Poppins, sans-serif",
                                "&:hover": {
                                  bgcolor: "#2dd610",
                                },
                              }}
                            >
                              Restock
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
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
                    Customer Activity
                  </Typography>
                  <Link href="/admin/customers" passHref style={{ textDecoration: "none" }}>
                    <Button
                      variant="text"
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      View All
                    </Button>
                  </Link>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {customerActivity.map((activity, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#39FF14",
                          mt: 1.5,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                          <Typography
                            sx={{
                              color: "#39FF14",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                            }}
                          >
                            {activity.type}
                          </Typography>
                          <Typography sx={{ color: "#9E9E9E", fontSize: "0.875rem" }}>
                            •
                          </Typography>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "0.875rem",
                            }}
                          >
                            {activity.user}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: "#9E9E9E",
                            fontSize: "0.75rem",
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

          {/* Latest Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
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
                    Latest Reviews
                  </Typography>
                  <Link href="/admin/reviews" passHref style={{ textDecoration: "none" }}>
                    <Button
                      variant="text"
                      sx={{
                        color: "#39FF14",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      View All
                    </Button>
                  </Link>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {latestReviews.map((review, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Avatar src={review.avatar} sx={{ width: 40, height: 40 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontWeight: 500,
                              }}
                            >
                              {review.user}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#F5A623",
                                fontSize: "0.875rem",
                              }}
                            >
                              ★★★★★
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              color: "#9E9E9E",
                              fontSize: "0.75rem",
                            }}
                          >
                            {review.date}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                          <Image
                            src={review.productImage}
                            alt={review.product}
                            width={32}
                            height={32}
                            style={{ borderRadius: 4, objectFit: "cover" }}
                          />
                          <Typography
                            sx={{
                              color: "#9E9E9E",
                              fontSize: "0.875rem",
                            }}
                          >
                            {review.product}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.875rem",
                            lineHeight: 1.5,
                            mb: 1,
                          }}
                        >
                          "{review.review}"
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<MessageSquare size={14} />}
                          sx={{
                            color: "#39FF14",
                            textTransform: "none",
                            fontFamily: "Poppins, sans-serif",
                            p: 0,
                            minWidth: "auto",
                          }}
                        >
                          Reply
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

        </Grid>
      </Grid>
    </Box>
  );
}

// Fix: Add missing IconButton import
import { IconButton } from "@mui/material";
