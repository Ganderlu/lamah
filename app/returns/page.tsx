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
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Package,
  RefreshCw,
  Clock,
  Mail,
} from "lucide-react";
import Link from "next/link";

const returnSteps = [
  { label: "Request Return", description: "Submit your return request within 30 days" },
  { label: "Get Approval", description: "Receive a return authorization within 24 hours" },
  { label: "Ship It Back", description: "Package items and send using the provided label" },
  { label: "Get Refund", description: "Refund processed within 5-7 days of receiving" },
];

export default function ReturnsPage() {
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
              "radial-gradient(circle at top left, rgba(57,255,20,0.12) 0%, transparent 28%), linear-gradient(180deg, #050505 0%, #0B0B0B 100%)",
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
                RETURNS
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
                & EXCHANGES
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
                We want you to love every LAMAH piece. If something doesn't work out, our simple 30-day return policy has you covered.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Policy Cards */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4}>
            {[
              {
                icon: <Calendar size={26} />,
                title: "30-DAY WINDOW",
                subtitle: "Risk-Free Returns",
                description: "Initiate returns within 30 days of delivery for a full refund",
              },
              {
                icon: <Package size={26} />,
                title: "CONDITIONS",
                subtitle: "Original State Required",
                description: "Items must be unworn, unwashed, with all tags still attached",
              },
              {
                icon: <RefreshCw size={26} />,
                title: "FAST REFUNDS",
                subtitle: "5-7 Day Processing",
                description: "Refunds issued to original payment method once return is inspected",
              },
              {
                icon: <Clock size={26} />,
                title: "SALE ITEMS",
                subtitle: "Final Sale Policy",
                description: "Items marked as sale or final sale cannot be returned or exchanged",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
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
                          width: 56,
                          height: 56,
                          margin: "0 auto 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          bgcolor: "rgba(57,255,20,0.1)",
                          color: "#39FF14",
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "1.25rem",
                          color: "#fff",
                          letterSpacing: "0.12em",
                          mb: 0.5,
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
                          fontSize: "0.95rem",
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

        {/* Return Process Stepper */}
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
                  borderBottom: "1px solid rgba(57,255,20,0.08)",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <RotateCcw size={28} style={{ color: "#39FF14" }} />
                  <Typography
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      fontSize: "2rem",
                      color: "#fff",
                      letterSpacing: "0.1em",
                    }}
                  >
                    HOW RETURNS WORK
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{ p: { xs: 3, md: 8 } }}>
                <Stepper
                  activeStep={-1}
                  orientation="vertical"
                  sx={{
                    "& .MuiStepLabel-root": {
                      py: 2,
                    },
                    "& .MuiStepIcon-root": {
                      color: "rgba(57,255,20,0.3)",
                      "&.Mui-active, &.Mui-completed": {
                        color: "#39FF14",
                      },
                    },
                    "& .MuiStepConnector-line": {
                      borderColor: "rgba(57,255,20,0.08)",
                      borderLeftWidth: 2,
                    },
                  }}
                >
                  {returnSteps.map((step, i) => (
                    <Step key={i} expanded>
                      <StepLabel>
                        <Box sx={{ ml: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              color: "#fff",
                              fontSize: "1.1rem",
                              mb: 0.5,
                            }}
                          >
                            Step {i + 1}: {step.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#A0A0A0",
                              fontSize: "0.95rem",
                            }}
                          >
                            {step.description}
                          </Typography>
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Card>
          </motion.div>
        </Container>

        {/* How to Section */}
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
                      <CheckCircle2 size={28} style={{ color: "#39FF14" }} />
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "2rem",
                          color: "#fff",
                          letterSpacing: "0.1em",
                        }}
                      >
                        ELIGIBLE RETURNS
                      </Typography>
                    </Stack>
                    <Stack spacing={3}>
                      {[
                        {
                          title: "Full-Priced Items",
                          text: "All regular-priced merchandise is fully returnable within 30 days",
                        },
                        {
                          title: "Damaged or Defective Items",
                          text: "We cover return shipping and offer a full refund or replacement at no cost",
                        },
                        {
                          title: "Wrong Items Received",
                          text: "Contact us immediately and we'll send the correct item with a prepaid label",
                        },
                      ].map((item, i) => (
                        <Stack direction="row" spacing={2.5} key={i}>
                          <Box
                            sx={{
                              mt: 0.5,
                              width: 8,
                              height: 8,
                              flexShrink: 0,
                              borderRadius: "50%",
                              bgcolor: "#39FF14",
                              boxShadow: "0 0 12px rgba(57,255,20,0.8)",
                            }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                mb: 0.5,
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                                lineHeight: 1.7,
                              }}
                            >
                              {item.text}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
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
                        NON-RETURNABLE
                      </Typography>
                    </Stack>
                    <Stack spacing={3}>
                      {[
                        {
                          title: "Sale & Final Sale Items",
                          text: "All merchandise marked down 30% or more is final sale — no returns or exchanges",
                        },
                        {
                          title: "Worn or Washed Items",
                          text: "Garments that show signs of wear, washing, alteration, or use cannot be returned",
                        },
                        {
                          title: "Missing Tags & Packaging",
                          text: "All items must include original tags, labels, and branded packaging to qualify",
                        },
                      ].map((item, i) => (
                        <Stack direction="row" spacing={2.5} key={i}>
                          <Box
                            sx={{
                              mt: 0.75,
                              width: 8,
                              height: 8,
                              flexShrink: 0,
                              borderRadius: "50%",
                              bgcolor: "#EF4444",
                              boxShadow: "0 0 12px rgba(239,68,68,0.8)",
                            }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                mb: 0.5,
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                                lineHeight: 1.7,
                              }}
                            >
                              {item.text}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Exchange & Shipping Info */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
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
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                    <Typography
                      sx={{
                        fontFamily: "Bebas Neue, cursive",
                        fontSize: "2rem",
                        color: "#fff",
                        letterSpacing: "0.1em",
                        mb: 4,
                      }}
                    >
                      EXCHANGES & RETURN SHIPPING
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                            mb: 2,
                            fontSize: "1.1rem",
                          }}
                        >
                          Exchanges
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                            mb: 2,
                          }}
                        >
                          Need a different size or color? We're happy to help with exchanges! Simply initiate a return and place a new order for the item you want. This ensures you get the correct item as quickly as possible without waiting for return processing.
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                          }}
                        >
                          For size exchanges due to sizing errors or manufacturing defects,
                          return shipping is covered by LAMAH and you won't be charged for
                          the new item's shipping either.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                            mb: 2,
                            fontSize: "1.1rem",
                          }}
                        >
                          Return Shipping
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                            mb: 2,
                          }}
                        >
                          For U.S. orders: We provide a prepaid return label and cover the cost of return shipping for all qualifying returns. A $7.95 return shipping fee will be deducted from your refund for returns due to customer preference.
                        </Typography>
                        <Typography
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: 1.8,
                          }}
                        >
                          For international orders: Customers are responsible for return shipping costs and any customs duties or import taxes. We recommend using a trackable shipping service for international returns.
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card
                  sx={{
                    position: "sticky",
                    top: 24,
                    bgcolor: "#0C0C0C",
                    borderRadius: 4,
                    border: "1px solid rgba(57,255,20,0.18)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 0 40px rgba(57,255,20,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      p: 4,
                      background:
                        "linear-gradient(135deg, rgba(57,255,20,0.15) 0%, transparent 100%)",
                      borderBottom: "1px solid rgba(57,255,20,0.08)",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Mail size={30} style={{ color: "#39FF14" }} />
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "1.75rem",
                          color: "#fff",
                          letterSpacing: "0.1em",
                        }}
                      >
                        START A RETURN
                      </Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#A0A0A0",
                        mb: 4,
                        lineHeight: 1.8,
                      }}
                    >
                      Ready to initiate a return or have questions about our policy? Reach out to our support team with your order number and we'll take care of the rest.
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        component={Link}
                        href="/contact"
                        variant="contained"
                        fullWidth
                        sx={{
                          bgcolor: "#39FF14",
                          color: "#000",
                          borderRadius: 3,
                          py: 1.75,
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          textTransform: "none",
                          boxShadow: "0 0 30px rgba(57,255,20,0.3)",
                          "&:hover": {
                            bgcolor: "#32e012",
                            boxShadow: "0 0 40px rgba(57,255,20,0.5)",
                          },
                        }}
                      >
                        Contact Support
                      </Button>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#A0A0A0",
                            fontFamily: "Poppins, sans-serif",
                            mb: 0.5,
                          }}
                        >
                          Email us directly
                        </Typography>
                        <Typography
                          sx={{
                            color: "#39FF14",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                          }}
                        >
                          support@lamahclothingco.com
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
