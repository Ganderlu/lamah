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
} from "@mui/material";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Eye,
  Edit,
  FileText,
  RefreshCw,
  Tags,
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/admin/StatCard";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/categories";
import { fetchNewArrivals } from "@/lib/newArrivals";
import { fetchProducts } from "@/lib/products";
import { fetchAllOrders } from "@/lib/orders";
import { fetchCustomers } from "@/lib/customers";
import { fetchCollections } from "@/lib/collections";
import type { Category } from "@/types/category";
import type { NewArrival } from "@/types/newArrival";
import type { Product } from "@/types/product";
import type { CustomerOrder } from "@/types/order";
import type { Customer } from "@/types/customer";
import type { Collection } from "@/types/collection";

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, arrivals, productsData, ordersData, customersData, collectionsData] = await Promise.all([
          fetchCategories(),
          fetchNewArrivals(),
          fetchProducts(),
          fetchAllOrders(),
          fetchCustomers(),
          fetchCollections(),
        ]);
        setCategories(cats);
        setNewArrivals(arrivals);
        setProducts(productsData);
        setOrders(ordersData);
        setCustomers(customersData);
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate dynamic stats from real data
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "Active").length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalCustomers = customers.length;
  const totalCollections = collections.length;

  // Create dynamic stats array
  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      change: activeProducts,
      changeLabel: "Active",
      showPercent: false,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      change: 0,
      changeLabel: "vs last week",
      showPercent: true,
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      change: 0,
      changeLabel: "vs last week",
      showPercent: true,
    },
    {
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: 0,
      changeLabel: "vs last week",
      showPercent: true,
    },
  ];

  // Recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
            <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Recent Orders */}
        <Grid item xs={12} lg={8}>
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

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: "#39FF14" }} />
                  </Box>
                ) : recentOrders.length === 0 ? (
                  <Typography sx={{ color: "#9E9E9E", textAlign: "center", py: 4 }}>
                    No orders yet
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "rgba(5,5,5,0.8)" }}>
                          <TableCell sx={{ color: "#9E9E9E" }}>Order ID</TableCell>
                          <TableCell sx={{ color: "#9E9E9E" }}>Customer</TableCell>
                          <TableCell sx={{ color: "#9E9E9E" }}>Date</TableCell>
                          <TableCell sx={{ color: "#9E9E9E" }}>Amount</TableCell>
                          <TableCell sx={{ color: "#9E9E9E" }}>Payment</TableCell>
                          <TableCell sx={{ color: "#9E9E9E" }}>Status</TableCell>
                          <TableCell sx={{ color: "#9E9E9E" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                              {order.orderNumber}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: "#39FF14", color: "#000" }}>
                                  {order.customerName.slice(0, 2).toUpperCase()}
                                </Avatar>
                                <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                                  {order.customerName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: "#9E9E9E" }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                              ₦{order.total.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.paymentStatus}
                                size="small"
                                sx={{
                                  bgcolor:
                                    order.paymentStatus === "Paid"
                                      ? "rgba(57,255,20,0.1)"
                                      : "rgba(245,166,35,0.1)",
                                  color:
                                    order.paymentStatus === "Paid" ? "#39FF14" : "#F5A623",
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
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Column - Quick Stats */}
        <Grid item xs={12} lg={4}>
          {/* Today's Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
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
                  Quick Overview
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    { label: "Active Products", value: activeProducts, icon: Package },
                    { label: "Total Collections", value: totalCollections, icon: Tags },
                    { label: "Pending Orders", value: orders.filter(o => o.paymentStatus === "Pending").length, icon: ShoppingCart },
                    { label: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign },
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
                        {typeof item.value === "number" ? item.value.toString() : item.value}
                      </Typography>
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
