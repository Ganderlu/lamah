"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/client";
import { fetchOrderByOrderId } from "@/lib/orders";
import type { CustomerOrder } from "@/types/order";

// Generate timeline based on order status
const generateTimeline = (status: string, createdAt: string) => {
  const createdDate = new Date(createdAt);
  const steps = [
    { step: "Order Placed", completed: true },
    { step: "Order Confirmed", completed: status !== "Processing" },
    { step: "Packed & Ready to Ship", completed: ["Shipped", "Out for Delivery", "Delivered"].includes(status) },
    { step: "Shipped", completed: ["Out for Delivery", "Delivered"].includes(status) },
    { step: "Out for Delivery", completed: status === "Delivered" },
    { step: "Delivered", completed: status === "Delivered" },
  ];
  
  return steps.map((item, index) => {
    const date = new Date(createdDate);
    date.setDate(date.getDate() + index);
    return {
      ...item,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: index < 2 ? "10:30 AM" : index < 4 ? "02:30 PM" : "Expected",
    };
  });
};

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const userId = auth.currentUser?.uid;
      const fetchedOrder = await fetchOrderByOrderId(orderId.trim(), userId);
      setOrder(fetchedOrder);
      if (!fetchedOrder) setError("Order not found. Please check your order ID.");
    } catch (err) {
      setError("Failed to fetch order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const orderTimeline = order ? generateTimeline(order.status, order.createdAt) : [];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Track Your Order
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#A0A0A0",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Enter your order ID to track your delivery.
          </Typography>
        </motion.div>
      </Box>

      {/* Order Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card
          sx={{
            bgcolor: "#111111",
            borderRadius: "18px",
            border: "1px solid rgba(57,255,20,0.15)",
            p: 3,
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                fullWidth
                placeholder="Enter Order ID (e.g. LMH-2024-00058)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                sx={{
                  flex: 1,
                  minWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#050505",
                    borderRadius: "12px",
                    "& fieldset": { borderColor: "rgba(57,255,20,0.2)" },
                    "&:hover fieldset": { borderColor: "rgba(57,255,20,0.4)" },
                    "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                  },
                  "& .MuiInputLabel-root": { color: "#A0A0A0" },
                  "& .MuiInputBase-input": { color: "#fff" },
                }}
              />
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} sx={{ color: "#000" }} /> : <Search size={18} />}
                onClick={handleTrack}
                disabled={loading}
                sx={{
                  px: 4,
                  bgcolor: "#39FF14",
                  color: "#000",
                  fontWeight: 700,
                  borderRadius: "12px",
                  "&:hover": {
                    bgcolor: "#2dd610",
                  },
                }}
              >
                {loading ? "Tracking..." : "Track"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity="error"
            sx={{
              mb: 4,
              bgcolor: "rgba(244,67,54,0.1)",
              color: "#EF4444",
              border: "1px solid rgba(244,67,54,0.3)",
              borderRadius: "12px",
            }}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Order Details */}
      {searched && order && !loading && (
        <Grid container spacing={3}>
          {/* Order Timeline & Items */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                sx={{
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                  p: 3,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#A0A0A0",
                          fontFamily: "Poppins, sans-serif",
                          mb: 0.5,
                          fontWeight: 600,
                        }}
                      >
                        ORDER #{order.orderId}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#fff",
                          fontFamily: "Bebas Neue, cursive",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {order.status.toUpperCase()}
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status}
                      sx={{
                        bgcolor: "rgba(57,255,20,0.1)",
                        color: "#39FF14",
                        fontWeight: 600,
                        px: 2,
                        py: 1,
                      }}
                      icon={<Truck size={16} color="#39FF14" />}
                    />
                  </Box>

                  {/* Timeline */}
                  <Box sx={{ mt: 3, position: "relative" }}>
                    {orderTimeline.map((item, index) => {
                      const isCompleted = item.completed;
                      const isLast = index === orderTimeline.length - 1;
                      return (
                        <Box
                          key={item.step}
                          sx={{
                            display: "flex",
                            gap: 3,
                            mb: isLast ? 0 : 4,
                            position: "relative",
                          }}
                        >
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                bgcolor: isCompleted ? "#39FF14" : "rgba(57,255,20,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: isCompleted ? "none" : "2px solid rgba(57,255,20,0.3)",
                                boxShadow: isCompleted ? "0 0 20px rgba(57,255,20,0.5)" : "none",
                                zIndex: 1,
                              }}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={18} color="#000" />
                              ) : (
                                <Clock size={18} color="#A0A0A0" />
                              )}
                            </Box>
                            {!isLast && (
                              <Box
                                sx={{
                                  width: 4,
                                  flex: 1,
                                  mt: 1,
                                  bgcolor: isCompleted ? "#39FF14" : "rgba(57,255,20,0.2)",
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: isCompleted ? "#39FF14" : "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 700,
                                mb: 0.5,
                              }}
                            >
                              {item.step}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              {item.date} at {item.time}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                sx={{
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                  p: 3,
                }}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    Order Items
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {order.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          gap: 3,
                          p: 2,
                          bgcolor: "#050505",
                          borderRadius: "12px",
                          border: "1px solid rgba(57,255,20,0.05)",
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          style={{ borderRadius: 12, objectFit: "cover" }}
                        />
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#fff",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 600,
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#A0A0A0",
                                  fontFamily: "Poppins, sans-serif",
                                }}
                              >
                                Qty: {item.quantity}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#39FF14",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 700,
                              }}
                            >
                              ₦{item.price.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 3, borderColor: "rgba(57,255,20,0.1)" }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5" sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#39FF14", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                      ₦{order.total.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Shipping & Payment Info */}
          <Grid size={{ xs: 12, lg: 4 }} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                sx={{
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                  p: 3,
                }}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <MapPin size={24} color="#39FF14" />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Shipping Address
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Customer Name
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#A0A0A0",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Address will be shown here
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card
                sx={{
                  bgcolor: "#111111",
                  borderRadius: "18px",
                  border: "1px solid rgba(57,255,20,0.15)",
                  p: 3,
                }}
              >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Need Help?
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Phone size={18} />}
                      sx={{
                        borderColor: "rgba(57,255,20,0.3)",
                        color: "#39FF14",
                        borderRadius: "12px",
                        "&:hover": {
                          borderColor: "#39FF14",
                          bgcolor: "rgba(57,255,20,0.05)",
                        },
                      }}
                    >
                      Call Support
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MessageSquare size={18} />}
                      sx={{
                        borderColor: "rgba(57,255,20,0.3)",
                        color: "#39FF14",
                        borderRadius: "12px",
                        "&:hover": {
                          borderColor: "#39FF14",
                          bgcolor: "rgba(57,255,20,0.05)",
                        },
                      }}
                      component={Link}
                      href="/contact"
                    >
                      Chat with Us
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
}
