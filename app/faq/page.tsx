"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What is your shipping policy?",
    answer:
      "We offer free standard shipping on all orders over $75 within the United States. Standard shipping typically takes 3-5 business days, while expedited shipping (available at checkout) takes 1-2 business days. International shipping is available with rates calculated at checkout based on your location.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery for a full refund, provided the items are unworn, unwashed, and in original condition with all tags attached. Sale items are final sale and cannot be returned. Please visit our Returns page to initiate a return request.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a shipping confirmation email with a tracking number. You can also track your order at any time by logging into your account and visiting the Orders section, or by using the Track Order page.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All transactions are secured with industry-standard SSL encryption.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes! We ship worldwide to most countries. International shipping rates and delivery times vary by location and are calculated at checkout. Please note that customers are responsible for any customs duties or import taxes that may apply.",
  },
  {
    question: "How do I know what size to order?",
    answer:
      "Each product page includes a detailed size guide with measurements in both inches and centimeters. We recommend measuring yourself and comparing to our size chart for the best fit. If you're between sizes, we recommend sizing up for a comfortable fit.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be cancelled or modified within 2 hours of purchase if they haven't yet entered the fulfillment process. Please contact our customer support team immediately with your order number if you need to make changes.",
  },
  {
    question: "How do I care for my LAMAH products?",
    answer:
      "We recommend washing all garments in cold water on a gentle cycle, inside out. Hang dry or tumble dry on low heat to preserve fabric quality and print longevity. Avoid bleaching, ironing directly on prints, or dry cleaning unless specified on the garment tag.",
  },
  {
    question: "Do you restock sold-out items?",
    answer:
      "Yes! We frequently restock popular items. The best way to get notified about restocks is to subscribe to our newsletter or click the 'Notify Me' button on the product page of the sold-out item you're interested in.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support team via email at support@lamahclothingco.com, through our Contact page, or by phone at +1 (555) 123-4567. Our support hours are Monday through Friday, 9AM-6PM EST. We respond to all inquiries within 24 hours.",
  },
];

export default function FAQPage() {
  const [expanded, setExpanded] = useState<number | null>(0);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : null);
  };

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
                FREQUENTLY ASKED
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
                QUESTIONS
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
                Find answers to the most common questions about ordering, shipping, returns, and our products. If you can't find what you're looking for, our team is here to help.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Accordion
                      expanded={expanded === i}
                      onChange={handleChange(i)}
                      disableGutters
                      sx={{
                        bgcolor: "#0C0C0C",
                        borderRadius: 4,
                        border: "1px solid rgba(57,255,20,0.12)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        "&:before": { display: "none" },
                        mb: 2,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ChevronDown
                            size={22}
                            style={{ color: expanded === i ? "#39FF14" : "#A0A0A0" }}
                          />
                        }
                        sx={{
                          p: 3,
                          borderRadius: 4,
                          ...(expanded === i && {
                            borderBottom: "1px solid rgba(57,255,20,0.08)",
                          }),
                          "& .MuiAccordionSummary-content": {
                            alignItems: "center",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <HelpCircle
                            size={22}
                            style={{ color: expanded === i ? "#39FF14" : "#A0A0A0", flexShrink: 0 }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 600,
                              color: expanded === i ? "#39FF14" : "#fff",
                              fontSize: "1.05rem",
                            }}
                          >
                            {faq.question}
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3, pt: 2 }}>
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "#A0A0A0",
                            lineHeight: 1.8,
                            pl: 7.5,
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                ))}
              </Stack>
            </Grid>

            {/* Sidebar CTA */}
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
                      <MessageCircle size={32} style={{ color: "#39FF14" }} />
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "1.75rem",
                          color: "#fff",
                          letterSpacing: "0.1em",
                        }}
                      >
                        STILL NEED HELP?
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
                      Can't find the answer you're looking for? Our customer support team is available Monday through Friday to answer any questions you may have.
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
                        Contact Us
                      </Button>
                      <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
                        <Typography
                          variant="body2"
                          sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}
                        >
                          Email: support@lamahclothingco.com
                        </Typography>
                      </Stack>
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
