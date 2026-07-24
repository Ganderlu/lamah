"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Truck, Clock, Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            px: { xs: 3, md: 6 },
            py: { xs: 14, md: 18 },
            background:
              "radial-gradient(circle at top right, rgba(57,255,20,0.12) 0%, transparent 28%), linear-gradient(180deg, #050505 0%, #0B0B0B 100%)",
            borderBottom: "1px solid rgba(57,255,20,0.08)",
          }}
        >
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chip
                label="CUSTOMER CARE"
                sx={{
                  mb: 3,
                  bgcolor: "rgba(57,255,20,0.12)",
                  color: "#39FF14",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(57,255,20,0.2)",
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "3rem", md: "5.5rem" },
                  color: "#fff",
                  letterSpacing: "0.18em",
                  mb: 2,
                  lineHeight: 0.95,
                }}
              >
                SHIPPING
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "3rem", md: "5.5rem" },
                  color: "#39FF14",
                  letterSpacing: "0.18em",
                  mb: 3,
                  lineHeight: 0.95,
                  textShadow: "0 0 40px rgba(57,255,20,0.4)",
                }}
              >
                INFORMATION
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 760,
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  mb: 4,
                }}
              >
                Transparent shipping rates, fast delivery times, and worldwide delivery for every LAMAH order.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Highlight Cards */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={3}>
            {[
              {
                icon: <CheckCircle2 size={28} />,
                title: "FREE SHIPPING",
                subtitle: "On All U.S. Orders Over $75",
                description: "Domestic orders qualify automatically at checkout",
              },
              {
                icon: <Truck size={28} />,
                title: "FAST FULFILLMENT",
                subtitle: "Orders Ship Within 1-2 Days",
                description: "Weekday processing for all in-stock items",
              },
              {
                icon: <Clock size={28} />,
                title: "QUICK DELIVERY",
                subtitle: "U.S. Delivery in 3-5 Days",
                description: "Expedited options available at checkout",
              },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card
                    sx={{
                      bgcolor: "#0C0C0C",
                      borderRadius: 4,
                      border: "1px solid rgba(57,255,20,0.12)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          margin: "0 auto 24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          bgcolor: "rgba(57,255,20,0.1)",
                          color: "#39FF14",
                          boxShadow: "0 0 40px rgba(57,255,20,0.2)",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "1.5rem",
                          color: "#fff",
                          letterSpacing: "0.12em",
                          mb: 1,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          color: "#39FF14",
                          mb: 2,
                        }}
                      >
                        {item.subtitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "#A0A0A0",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Shipping Rates Table */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                bgcolor: "#0C0C0C",
                borderRadius: 4,
                border: "1px solid rgba(57,255,20,0.12)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: { xs: 3, md: 6 },
                  py: 4,
                  bgcolor: "rgba(57,255,20,0.05)",
                  borderBottom: "1px solid rgba(57,255,20,0.08)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Bebas Neue, cursive",
                    fontSize: "2rem",
                    color: "#fff",
                    letterSpacing: "0.1em",
                  }}
                >
                  UNITED STATES SHIPPING RATES
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {["Shipping Method", "Delivery Time", "Order Value", "Cost"].map((h, i) => (
                        <TableCell
                          key={i}
                          sx={{
                            borderBottom: "1px solid rgba(57,255,20,0.08)",
                            color: "#39FF14",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            fontSize: "0.85rem",
                            py: 3,
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        method: "Standard Shipping",
                        time: "3-5 Business Days",
                        value: "Orders under $75",
                        cost: "$7.99",
                      },
                      {
                        method: "Standard Shipping",
                        time: "3-5 Business Days",
                        value: "Orders $75+",
                        cost: "FREE",
                        free: true,
                      },
                      {
                        method: "Expedited Shipping",
                        time: "2 Business Days",
                        value: "All Orders",
                        cost: "$14.99",
                      },
                      {
                        method: "Overnight Shipping",
                        time: "1 Business Day",
                        value: "All Orders",
                        cost: "$29.99",
                      },
                    ].map((row, i) => (
                      <TableRow key={i} sx={{ "&:hover": { bgcolor: "rgba(57,255,20,0.02)" } }}>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(57,255,20,0.04)",
                            py: 3,
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {row.method}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(57,255,20,0.04)",
                            py: 3,
                            color: "#A0A0A0",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {row.time}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(57,255,20,0.04)",
                            py: 3,
                            color: "#A0A0A0",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {row.value}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(57,255,20,0.04)",
                            py: 3,
                            color: row.free ? "#39FF14" : "#fff",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                          }}
                        >
                          {row.cost}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </motion.div>
        </Container>

        {/* International Shipping */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card
                  sx={{
                    bgcolor: "#0C0C0C",
                    borderRadius: 4,
                    border: "1px solid rgba(57,255,20,0.12)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                      <Package size={28} style={{ color: "#39FF14" }} />
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "2rem",
                          color: "#fff",
                          letterSpacing: "0.1em",
                        }}
                      >
                        INTERNATIONAL
                      </Typography>
                    </Stack>
                    <Stack spacing={3}>
                      <Box>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Worldwide Delivery
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                          }}
                        >
                          We ship to over 100 countries worldwide! International shipping rates and delivery times are calculated at checkout based on your destination country.
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Estimated Delivery
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                          }}
                        >
                          <strong style={{ color: "#fff" }}>Canada & Mexico:</strong> 5-10 business days<br />
                          <strong style={{ color: "#fff" }}>Europe & UK:</strong> 7-14 business days<br />
                          <strong style={{ color: "#fff" }}>Asia & Oceania:</strong> 10-21 business days<br />
                          <strong style={{ color: "#fff" }}>South America & Africa:</strong> 14-28 business days
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card
                  sx={{
                    bgcolor: "#0C0C0C",
                    borderRadius: 4,
                    border: "1px solid rgba(239,68,68,0.15)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                      <AlertTriangle size={28} style={{ color: "#F59E0B" }} />
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "2rem",
                          color: "#fff",
                          letterSpacing: "0.1em",
                        }}
                      >
                        CUSTOMS & DUTIES
                      </Typography>
                    </Stack>
                    <Stack spacing={3}>
                      <Box>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Important Information
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                          }}
                        >
                          International orders may be subject to import duties, customs taxes, and brokerage fees that are levied once your package reaches your country. These additional charges for customs clearance are the responsibility of the recipient.
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          Customs Delays
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                          }}
                        >
                          Please note that customs processing can sometimes cause delays beyond our original delivery estimates. We recommend contacting your local customs office for more information about applicable fees and processing times for your location.
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Order Processing & CTA */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                bgcolor: "rgba(57,255,20,0.04)",
                borderRadius: 4,
                border: "1px solid rgba(57,255,20,0.2)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 60px rgba(57,255,20,0.08)",
                p: { xs: 4, md: 8 },
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  color: "#fff",
                  letterSpacing: "0.15em",
                  mb: 2,
                }}
              >
                READY TO PLACE YOUR ORDER?
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  fontSize: "1.1rem",
                  mb: 5,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Have questions about shipping? Our team is happy to help you out. Or start shopping now and get free shipping on all U.S. orders over $75!
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                  component={Link}
                  href="/shop"
                  variant="contained"
                  sx={{
                    bgcolor: "#39FF14",
                    color: "#000",
                    borderRadius: 3,
                    px: 8,
                    py: 2,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 0 40px rgba(57,255,20,0.35)",
                    "&:hover": {
                      bgcolor: "#32e012",
                      boxShadow: "0 0 50px rgba(57,255,20,0.55)",
                    },
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    px: 8,
                    py: 2,
                    color: "#fff",
                    borderColor: "rgba(57,255,20,0.3)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#39FF14",
                      bgcolor: "rgba(57,255,20,0.06)",
                    },
                  }}
                >
                  Contact Support
                </Button>
              </Stack>
            </Card>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
