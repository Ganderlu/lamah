
"use client";

import { Box, Container, Typography, TextField, Button, Paper, Grid } from "@mui/material";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1, py: 12 }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "3rem", md: "5rem" },
                color: "#fff",
                letterSpacing: "0.2em",
                mb: 8,
                textAlign: "center",
              }}
            >
              CONTACT US
            </Typography>

            <Grid container spacing={6}>
              <Grid item xs={12} lg={5}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "Bebas Neue, cursive",
                      color: "#39FF14",
                      letterSpacing: "0.1em",
                      mb: 4,
                    }}
                  >
                    GET IN TOUCH
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "#A0A0A0",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      mb: 6,
                    }}
                  >
                    Have questions about your order? Want to collaborate? Or just want to say hi?
                    We'd love to hear from you.
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#fff",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      EMAIL
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#39FF14",
                      }}
                    >
                      hello@lamahclothing.com
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#fff",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      LOCATION
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "#A0A0A0",
                      }}
                    >
                      Los Angeles, CA
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} lg={7}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Paper
                    sx={{
                      bgcolor: "#111",
                      p: 6,
                      borderRadius: "16px",
                      border: "1px solid rgba(57,255,20,0.2)",
                    }}
                  >
                    <form onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        sx={{
                          mb: 3,
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(57,255,20,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#39FF14",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#A0A0A0",
                            "&.Mui-focused": {
                              color: "#39FF14",
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        sx={{
                          mb: 3,
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(57,255,20,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#39FF14",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#A0A0A0",
                            "&.Mui-focused": {
                              color: "#39FF14",
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Message"
                        variant="outlined"
                        multiline
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        sx={{
                          mb: 4,
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(57,255,20,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#39FF14",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#A0A0A0",
                            "&.Mui-focused": {
                              color: "#39FF14",
                            },
                          },
                        }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                          bgcolor: "#39FF14",
                          color: "#000",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          py: 2,
                          textTransform: "uppercase",
                          "&:hover": {
                            bgcolor: "#2dd610",
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </form>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
