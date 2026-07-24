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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  Sparkles,
  Users,
  Rocket,
  Heart,
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

const openPositions = [
  {
    title: "Senior Graphic Designer",
    department: "Creative",
    location: "Atlanta, GA (Hybrid)",
    type: "Full-Time",
    salary: "$75k - $100k",
    description: "Lead visual direction for collections, campaigns, and brand assets. Bring a distinct streetwear aesthetic and a portfolio that speaks for itself.",
    perks: ["Creative direction ownership", "Adobe Creative Suite budget", "Attend fashion events"],
  },
  {
    title: "E-Commerce Manager",
    department: "Operations",
    location: "Remote (US)",
    type: "Full-Time",
    salary: "$80k - $110k",
    description: "Own the Shopify/Firestore ecosystem, run campaigns, and optimize conversions. Track everything and ship improvements weekly.",
    perks: ["Full analytics stack access", "Performance bonus", "Flexible schedule"],
  },
  {
    title: "Social Media Content Creator",
    department: "Marketing",
    location: "Atlanta, GA (On-site preferred)",
    type: "Full-Time",
    salary: "$55k - $75k",
    description: "Shoot, edit, and post daily content across Instagram, TikTok, and YouTube Shorts. Live and breathe viral streetwear content.",
    perks: ["Equipment budget", "Free clothing allowance", "Creator collaboration trips"],
  },
  {
    title: "Full-Stack Developer (Next.js / Firebase)",
    department: "Engineering",
    location: "Remote",
    type: "Full-Time",
    salary: "$100k - $150k",
    description: "Build features on our Next.js + Firebase + MUI storefront. Ship the checkout flow, admin tools, and customer dashboards.",
    perks: ["Choose your equipment", "Stock options", "Unlimited PTO"],
  },
  {
    title: "Sales & Wholesale Associate",
    department: "Revenue",
    location: "Atlanta, GA + Travel",
    type: "Full-Time + Commission",
    salary: "$60k base + 5%",
    description: "Build partnerships with boutique retail stores and stockists. Travel to trade shows and represent LAMAH at pop-ups.",
    perks: ["Commission structure", "Travel budget", "Exclusive event access"],
  },
  {
    title: "Customer Experience Lead",
    department: "Customer Care",
    location: "Remote (US)",
    type: "Full-Time",
    salary: "$50k - $65k",
    description: "Own the post-purchase experience: returns, exchanges, reviews, and community. Make every customer feel like family.",
    perks: ["WFH stipend", "Health insurance", "Community event budget"],
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

        {/* Open Positions */}
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "start", md: "end" }} spacing={3} sx={{ mb: 6 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  color: "#fff",
                  letterSpacing: "0.15em",
                  mb: 1,
                }}
              >
                OPEN POSITIONS
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#A0A0A0",
                }}
              >
                {openPositions.length} roles across {new Set(openPositions.map(p => p.department)).size} departments
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/contact"
              variant="outlined"
              endIcon={<Send size={16} />}
              sx={{
                borderRadius: 3,
                color: "#fff",
                borderColor: "rgba(57,255,20,0.3)",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                px: 4,
                py: 1.25,
                "&:hover": {
                  borderColor: "#39FF14",
                  bgcolor: "rgba(57,255,20,0.06)",
                },
              }}
            >
              Don't see your role? Pitch us.
            </Button>
          </Stack>

          <Stack spacing={3}>
            {openPositions.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card
                  sx={{
                    bgcolor: "#0C0C0C",
                    borderRadius: 4,
                    border: "1px solid rgba(57,255,20,0.1)",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "rgba(57,255,20,0.25)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <Accordion disableGutters sx={{ bgcolor: "transparent", boxShadow: "none", "&:before": { display: "none" } }}>
                    <AccordionSummary
                      expandIcon={<ChevronDown size={22} style={{ color: "#39FF14" }} />}
                      sx={{
                        p: { xs: 2.5, md: 4 },
                        "& .MuiAccordionSummary-content": { alignItems: "center" },
                      }}
                    >
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={5}>
                          <Stack direction="row" spacing={2.5} alignItems="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 3,
                                bgcolor: "rgba(57,255,20,0.1)",
                                color: "#39FF14",
                                flexShrink: 0,
                              }}
                            >
                              <Briefcase size={22} />
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 700,
                                  color: "#fff",
                                  fontSize: "1.15rem",
                                  mb: 0.25,
                                }}
                              >
                                {job.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={job.department}
                                sx={{
                                  bgcolor: "rgba(57,255,20,0.1)",
                                  color: "#39FF14",
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 600,
                                  border: "1px solid rgba(57,255,20,0.2)",
                                  borderRadius: 999,
                                }}
                              />
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4} md={2.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <MapPin size={16} style={{ color: "#A0A0A0" }} />
                            <Typography variant="body2" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                              {job.location}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4} md={2}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Clock size={16} style={{ color: "#A0A0A0" }} />
                            <Typography variant="body2" sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif" }}>
                              {job.type}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <DollarSign size={16} style={{ color: "#39FF14" }} />
                            <Typography variant="body2" sx={{ color: "#39FF14", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                              {job.salary}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: { xs: 2.5, md: 4 }, pb: { xs: 3, md: 5 }, borderTop: "1px solid rgba(57,255,20,0.06)" }}>
                      <Divider sx={{ display: { md: "none" }, mb: 3, borderColor: "rgba(57,255,20,0.06)" }} />
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                              mb: 1.5,
                              fontSize: "1rem",
                            }}
                          >
                            About the role
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#A0A0A0",
                              lineHeight: 1.8,
                              mb: 3,
                            }}
                          >
                            {job.description}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                              mb: 1.5,
                              fontSize: "1rem",
                            }}
                          >
                            Perks
                          </Typography>
                          <Stack direction="row" useFlexGap spacing={1.5} flexWrap="wrap">
                            {job.perks.map((p, k) => (
                              <Chip
                                key={k}
                                label={p}
                                sx={{
                                  bgcolor: "rgba(255,255,255,0.04)",
                                  color: "#A0A0A0",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 500,
                                  borderRadius: 3,
                                  px: 0.5,
                                  py: 0.25,
                                  border: "1px solid rgba(255,255,255,0.06)",
                                }}
                              />
                            ))}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card
                            sx={{
                              bgcolor: "rgba(57,255,20,0.05)",
                              borderRadius: 4,
                              border: "1px solid rgba(57,255,20,0.2)",
                              height: "100%",
                            }}
                          >
                            <CardContent sx={{ p: 3, textAlign: "center" }}>
                              <Typography
                                sx={{
                                  fontFamily: "Bebas Neue, cursive",
                                  fontSize: "1.5rem",
                                  color: "#39FF14",
                                  letterSpacing: "0.12em",
                                  mb: 1.5,
                                }}
                              >
                                READY TO APPLY?
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: "Poppins, sans-serif",
                                  color: "#A0A0A0",
                                  mb: 3,
                                  lineHeight: 1.7,
                                }}
                              >
                                Email your résumé + portfolio (if applicable) with the role in the subject line.
                              </Typography>
                              <Button
                                component="a"
                                href="mailto:careers@lamahclothingco.com?subject=Application%20-%20"
                                variant="contained"
                                fullWidth
                                endIcon={<Send size={16} />}
                                sx={{
                                  bgcolor: "#39FF14",
                                  color: "#000",
                                  borderRadius: 3,
                                  py: 1.5,
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
                                careers@lamahclothingco.com
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Container>

        {/* CTA */}
        <Container maxWidth="xl" sx={{ pb: { xs: 10, md: 14 } }}>
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
                NOT HIRING BUT LOVE THE BRAND?
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
                Collaborations, ambassadors, creative partnerships, and sponsorships — reach out through our contact page and let's create something iconic together.
              </Typography>
              <Button
                component={Link}
                href="/contact"
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
                Pitch A Collaboration
              </Button>
            </Card>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
