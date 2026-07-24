"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", success: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Message sent! We'll get back to you within 24 hours.",
        success: true,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
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
                GET IN TOUCH
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
                Have questions, concerns, or want to collaborate? We'd love to hear from you. Reach out and our team will respond within 24 hours.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Content Section */}
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6}>
            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {[
                  {
                    icon: <Mail size={24} />,
                    title: "Email",
                    info: "support@lamahclothingco.com",
                    description: "For all order and product inquiries",
                  },
                  {
                    icon: <Phone size={24} />,
                    title: "Phone",
                    info: "+1 (555) 123-4567",
                    description: "Mon-Fri, 9AM-6PM EST",
                  },
                  {
                    icon: <MapPin size={24} />,
                    title: "Headquarters",
                    info: "Atlanta, Georgia",
                    description: "United States",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
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
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" spacing={3} alignItems="flex-start">
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              bgcolor: "rgba(57,255,20,0.1)",
                              color: "#39FF14",
                              flexShrink: 0,
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 700,
                                mb: 0.5,
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 500,
                                mb: 0.5,
                              }}
                            >
                              {item.info}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#A0A0A0",
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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
                      SEND A MESSAGE
                    </Typography>
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            name="name"
                            label="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ sx: { color: "#A0A0A0", fontFamily: "Poppins, sans-serif" } }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "rgba(255,255,255,0.03)",
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                borderRadius: 3,
                                "& fieldset": { borderColor: "rgba(57,255,20,0.12)" },
                                "&:hover fieldset": { borderColor: "rgba(57,255,20,0.3)" },
                                "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ sx: { color: "#A0A0A0", fontFamily: "Poppins, sans-serif" } }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "rgba(255,255,255,0.03)",
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                borderRadius: 3,
                                "& fieldset": { borderColor: "rgba(57,255,20,0.12)" },
                                "&:hover fieldset": { borderColor: "rgba(57,255,20,0.3)" },
                                "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="subject"
                            label="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ sx: { color: "#A0A0A0", fontFamily: "Poppins, sans-serif" } }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "rgba(255,255,255,0.03)",
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                borderRadius: 3,
                                "& fieldset": { borderColor: "rgba(57,255,20,0.12)" },
                                "&:hover fieldset": { borderColor: "rgba(57,255,20,0.3)" },
                                "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="message"
                            label="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            multiline
                            rows={6}
                            InputLabelProps={{ sx: { color: "#A0A0A0", fontFamily: "Poppins, sans-serif" } }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "rgba(255,255,255,0.03)",
                                color: "#fff",
                                fontFamily: "Poppins, sans-serif",
                                borderRadius: 3,
                                "& fieldset": { borderColor: "rgba(57,255,20,0.12)" },
                                "&:hover fieldset": { borderColor: "rgba(57,255,20,0.3)" },
                                "&.Mui-focused fieldset": { borderColor: "#39FF14" },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            disabled={loading}
                            variant="contained"
                            endIcon={<Send size={18} />}
                            sx={{
                              bgcolor: "#39FF14",
                              color: "#000",
                              borderRadius: 3,
                              px: 6,
                              py: 1.75,
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              textTransform: "none",
                              boxShadow: "0 0 30px rgba(57,255,20,0.3)",
                              "&:hover": {
                                bgcolor: "#32e012",
                                boxShadow: "0 0 40px rgba(57,255,20,0.5)",
                              },
                              "&:disabled": {
                                bgcolor: "rgba(57,255,20,0.3)",
                                color: "#000",
                              },
                            }}
                          >
                            {loading ? "Sending..." : "Send Message"}
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.success ? "success" : "error"}
            sx={{
              fontFamily: "Poppins, sans-serif",
              bgcolor: snackbar.success ? "rgba(57,255,20,0.1)" : "rgba(239,68,68,0.1)",
              color: snackbar.success ? "#39FF14" : "#EF4444",
              border: `1px solid ${snackbar.success ? "rgba(57,255,20,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </>
  );
}
