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
  useMediaQuery,
  useTheme,
  Chip,
  Avatar,
  IconButton,
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
import { useState } from "react";

const orderTimeline = [
  {
    step: "Order Placed",
    date: "May 18, 2024",
    time: "10:30 AM",
    completed: true,
  },
  {
    step: "Order Confirmed",
    date: "May 18, 2024",
    time: "11:45 AM",
    completed: true,
  },
  {
    step: "Packed & Ready to Ship",
    date: "May 19, 2024",
    time: "09:15 AM",
    completed: true,
  },
  {
    step: "Shipped",
    date: "May 20, 2024",
    time: "02:30 PM",
    completed: true,
  },
  {
    step: "Out for Delivery",
    date: "May 24, 2024",
    time: "Expected",
    completed: false,
  },
  {
    step: "Delivered",
    date: "May 24, 2024",
    time: "Expected",
    completed: false,
  },
];

const orderItems = [
  {
    id: 1,
    name: "Ordah Signature Hoodie",
    size: "XL",
    color: "Black",
    price: "₦35,000",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Lamah Cargo Pants",
    size: "32",
    color: "Olive",
    price: "₦30,000",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Lamah Classic Cap",
    size: "One Size",
    color: "Black",
    price: "₦12,000",
    quantity: 2,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop",
  },
];

export default function TrackOrder() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [orderId, setOrderId] = useState("");

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
            borderRadius: 3,
            border: "1px solid rgba(57,255,20,0.1)",
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
                sx={{
                  flex: 1,
                  minWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#050505",
                    borderRadius: 2,
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
                startIcon={<Search size={18} />}
                sx={{
                  px: 4,
                  bgcolor: "#39FF14",
                  color: "#000",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#2dd610",
                  },
                }}
              >
                Track
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <Grid container spacing={3}>
        {/* Order Details */}
        <Grid item xs={12} lg={8}>
          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              sx={{
                bgcolor: "#111111",
                borderRadius: 3,
                border: "1px solid rgba(57,255,20,0.1)",
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
                      ORDER #LMH-2024-00058
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#fff",
                        fontFamily: "Bebas Neue, cursive",
                        letterSpacing: "0.1em",
                      }}
                    >
                      IN TRANSIT
                    </Typography>
                  </Box>
                  <Chip
                    label="In Transit"
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
                borderRadius: 3,
                border: "1px solid rgba(57,255,20,0.1)",
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
                  {orderItems.map((item, index) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        gap: 3,
                        p: 2,
                        bgcolor: "#050505",
                        borderRadius: 2,
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
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
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
                            {item.price}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 3, borderColor: "rgba(57,255,20,0.1)" }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                      Shipping
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                      Tax
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
                    <Typography variant="body2" sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                      ₦77,000
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                      ₦5,000
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                      ₦3,000
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2, borderColor: "rgba(57,255,20,0.1)" }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5" sx={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#39FF14", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                    ₦85,000
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Shipping & Payment Info */}
        <Grid item xs={12} lg={4} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              sx={{
                bgcolor: "#111111",
                borderRadius: 3,
                border: "1px solid rgba(57,255,20,0.1)",
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
                  Ganderlu Ricchi
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#A0A0A0",
                    fontFamily: "Poppins, sans-serif",
                    mb: 0.5,
                  }}
                >
                  123 Main Street, Victoria Island
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#A0A0A0",
                    fontFamily: "Poppins, sans-serif",
                    mb: 0.5,
                  }}
                >
                  Lagos, 100001
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#A0A0A0",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Nigeria
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card
              sx={{
                bgcolor: "#111111",
                borderRadius: 3,
                border: "1px solid rgba(57,255,20,0.1)",
                p: 3,
              }}
            >
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Package size={24} color="#39FF14" />
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Payment Method
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 32,
                      bgcolor: "#39FF14",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#000" }}>VISA</Typography>
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Visa •••• 4242
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#A0A0A0",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Expires 12/26
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card
              sx={{
                bgcolor: "#111111",
                borderRadius: 3,
                border: "1px solid rgba(57,255,20,0.1)",
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
    </DashboardLayout>
  );
}
