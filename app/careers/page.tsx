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
} from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Heart,
  Users,
  Rocket,
  Sparkles,
  Send,
  Building2,
  Target,
  Globe,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: <Heart size={28} />,
    title: "PASSION FIRST",
    description: "We eat, sleep, and breathe streetwear culture. Authenticity over everything.",
  },
  {
    icon: <Rocket size={28} />,
    title: "MOVE FAST",
    description: "Trends change overnight. We move faster — no corporate red tape.",
  },
  {
    icon: <Users size={28} />,
    title: "FAMILY VIBE",
    description: "We're a tight-knit crew that celebrates wins and lifts each other up.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "NO BORING IDEAS",
    description: "Safe is boring. Wild ideas, bold experiments, and creative chaos encouraged.",
  },
];

export default function CareersPage() {
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
                label="COMPANY"
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
                JOIN THE
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
                LAMAH MOVEMENT
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
                We're building a brand that means something. We don't hire for résumés — we hire for energy, taste, and the hunger to move the culture forward.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Values */}
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={2} sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: "Bebas Neue, cursive",
                fontSize: { xs: "2rem", md: "3.5rem" },
                color: "#fff",
                letterSpacing: "0.15em",
              }}
            >
              WHAT WE STAND FOR
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "#A0A0A0",
                maxWidth: 620,
                mx: "auto",
                fontSize: "1.05rem",
              }}
            >
              If these resonate, we should talk.
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {values.map((v, i) => (
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
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: "rgba(57,255,20,0.28)",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.25), 0 0 40px rgba(57,255,20,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 3,
                          bgcolor: "rgba(57,255,20,0.1)",
                          color: "#39FF14",
                          mb: 3,
                        }}
                      >
                        {v.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "1.35rem",
                          color: "#fff",
                          letterSpacing: "0.12em",
                          mb: 1.5,
                        }}
                      >
                        {v.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "#A0A0A0",
                          lineHeight: 1.75,
                        }}
                      >
                        {v.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Stats Row */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "rgba(57,255,20,0.03)", borderTop: "1px solid rgba(57,255,20,0.08)", borderBottom: "1px solid rgba(57,255,20,0.08)" }}>
          <Container maxWidth="xl">
            <Grid container spacing={4}>
              {[
                { n: "2024", l: "Founded", icon: <Building2 size={26} /> },
                { n: "180+", l: "Countries Shipped To", icon: <Globe size={26} /> },
                { n: "12", l: "Team Members", icon: <Users size={26} /> },
                { n: "∞", l: "Drops Planned", icon: <Target size={26} /> },
              ].map((s, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          margin: "0 auto 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          bgcolor: "rgba(57,255,20,0.1)",
                          color: "#39FF14",
                        }}
                      >
                        {s.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: { xs: "2.5rem", md: "3.5rem" },
                          color: "#39FF14",
                          letterSpacing: "0.12em",
                          lineHeight: 1,
                          mb: 1,
                        }}
                      >
                        {s.n}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "#A0A0A0",
                          fontWeight: 500,
                        }}
                      >
                        {s.l}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA */}
        <Container maxWidth="xl" sx={{ py: { xs: 10, md: 14 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                bgcolor: "rgba(57,255,20,0.04)",
                borderRadius: 5,
                border: "1px solid rgba(57,255,20,0.2)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 60px rgba(57,255,20,0.08)",
                p: { xs: 5, md: 10 },
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
                WANT TO JOIN THE MOVEMENT?
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                  fontSize: "1.1rem",
                  mb: 5,
                  maxWidth: 640,
                  mx: "auto",
                }}
              >
                We're always scouting talent, creators, collaborators, and ambassadors who live the culture. Pitch yourself, your work, or your idea — we read every message.
              </Typography>
              <Button
                component={Link}
                href="/contact"
                variant="contained"
                endIcon={<Send size={18} />}
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
                Reach Out To Us
              </Button>
            </Card>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
