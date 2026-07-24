"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  Button,
  Divider,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Newspaper,
  Download,
  Mail,
  ExternalLink,
  Image,
  FileText,
  Calendar,
  Hash,
  Tag,
  FileDown,
  Copy,
  Check,
  Mic2,
  Award,
  Globe,
} from "lucide-react";
import Link from "next/link";

const pressTabs = ["Press Kit", "In The News", "Brand Assets", "Contact"];

const newsArticles = [
  {
    title: "LAMAH Drops SS Collection 'Rising Son'",
    outlet: "Complex Style",
    date: "May 14, 2026",
    excerpt: "Atlanta-based streetwear imprint LAMAH continues its rapid ascent with a 32-piece summer drop featuring premium heavyweight fleece and hand-dyed tees.",
    link: "#",
    category: "Collection Drop",
  },
  {
    title: "10 Emerging Streetwear Brands To Watch This Year",
    outlet: "Highsnobiety",
    date: "April 2, 2026",
    excerpt: "From Atlanta's underground to the closets of pro athletes — LAMAH's 'Wear The Mindset' ethos is resonating with a new generation of consumers.",
    link: "#",
    category: "Feature",
  },
  {
    title: "LAMAH & NotLamarama Collab Drops On Twitch",
    outlet: "Hypebeast",
    date: "March 19, 2026",
    excerpt: "The live-stream exclusive release drew 110,000 concurrent viewers and sold out in under 7 minutes. Here's what went down.",
    link: "#",
    category: "Collaboration",
  },
  {
    title: "Made In Atlanta: Inside LAMAH's New Studio",
    outlet: "Vogue Runway",
    date: "February 8, 2026",
    excerpt: "A behind-the-scenes look at the 12,000 sq ft creative compound where every LAMAH piece is conceptualized, sampled, and photographed.",
    link: "#",
    category: "Behind The Scenes",
  },
  {
    title: "Pro Athletes Are Spotted In LAMAH Courtside",
    outlet: "ESPN Fashion",
    date: "January 22, 2026",
    excerpt: "Three NBA all-stars, two MLS captains, and a UFC champ — a single drop traveled across three different pro leagues this month.",
    link: "#",
    category: "Celebrity Wear",
  },
  {
    title: "LAMAH Launches 'Movement' Community Program",
    outlet: "Forbes",
    date: "December 9, 2025",
    excerpt: "The brand's non-profit arm commits 5% of annual revenue to youth mental health programs and creative arts scholarships.",
    link: "#",
    category: "Press Release",
  },
];

const brandAssets = [
  {
    title: "Primary Logo (Dark Backgrounds)",
    description: "Horizontal wordmark + mark — use on dark backgrounds",
    type: "PNG / SVG",
    file: "/images/lamahhlogo.png",
    size: "1200 × 480",
  },
  {
    title: "Primary Logo (Light Backgrounds)",
    description: "Dark wordmark — use on light backgrounds",
    type: "PNG / SVG",
    file: "/images/lamahwhiteb.png",
    size: "1200 × 480",
  },
  {
    title: "Brand Lookbook SS26",
    description: "Complete 48-page lookbook from the 'Rising Son' collection",
    type: "PDF",
    file: "#",
    size: "24.6 MB",
  },
  {
    title: "Press Imagery Pack",
    description: "Curated hi-res editorial and product photos (52 images)",
    type: "ZIP",
    file: "#",
    size: "418 MB",
  },
  {
    title: "Brand Guideline Deck",
    description: "Logo usage, typography system, color palettes, voice & tone",
    type: "PDF",
    file: "#",
    size: "8.2 MB",
  },
  {
    title: "Company Fact Sheet",
    description: "One-pager: founding, leadership, metrics, contact info",
    type: "PDF",
    file: "#",
    size: "320 KB",
  },
];

const brandFacts = [
  { icon: <Globe size={24} />, label: "Founded", value: "2024" },
  { icon: <Award size={24} />, label: "Headquarters", value: "Atlanta, GA" },
  { icon: <Mic2 size={24} />, label: "Founder", value: "NotLamarama" },
  { icon: <FileText size={24} />, label: "Category", value: "Luxury Streetwear" },
];

export default function PressPage() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar(true);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#050505", minHeight: "100vh", flex: 1 }}>
        {/* Hero */}
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
                PRESS &
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
                MEDIA
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
                Everything journalists, editors, and creative partners need to cover LAMAH. Press kits, brand assets, editorial history, and direct press inquiries.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ py: 6, bgcolor: "rgba(57,255,20,0.03)", borderBottom: "1px solid rgba(57,255,20,0.08)" }}>
          <Container maxWidth="xl">
            <Grid container spacing={4}>
              {brandFacts.map((f, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
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
                        {f.icon}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "#A0A0A0",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            mb: 0.5,
                          }}
                        >
                          {f.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          {f.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Tabs */}
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 } }}>
          <Box
            sx={{
              mb: 6,
              borderBottom: "1px solid rgba(57,255,20,0.08)",
              overflowX: "auto",
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 0,
                "& .MuiTab-root": {
                  fontFamily: "Bebas Neue, cursive",
                  fontSize: "1.1rem",
                  letterSpacing: "0.12em",
                  color: "#A0A0A0",
                  textTransform: "none",
                  py: 2.5,
                  px: 2,
                  minHeight: 0,
                  "&.Mui-selected": {
                    color: "#39FF14",
                  },
                },
                "& .MuiTabs-indicator": {
                  bgcolor: "#39FF14",
                  height: 3,
                  borderRadius: 3,
                  boxShadow: "0 0 16px rgba(57,255,20,0.6)",
                },
              }}
            >
              {pressTabs.map((t, i) => (
                <Tab label={t} key={i} />
              ))}
            </Tabs>
          </Box>

          {/* TAB 0 - Press Kit */}
          {tab === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={6}>
                <Grid item xs={12} md={8}>
                  <Card
                    sx={{
                      bgcolor: "#0C0C0C",
                      borderRadius: 4,
                      border: "1px solid rgba(57,255,20,0.12)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
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
                      <Stack direction="row" spacing={2} alignItems="center">
                        <FileDown size={26} style={{ color: "#39FF14" }} />
                        <Typography
                          sx={{
                            fontFamily: "Bebas Neue, cursive",
                            fontSize: "2rem",
                            color: "#fff",
                            letterSpacing: "0.1em",
                          }}
                        >
                          OFFICIAL PRESS KIT
                        </Typography>
                      </Stack>
                    </Box>
                    <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "#A0A0A0",
                          lineHeight: 1.85,
                          fontSize: "1rem",
                          mb: 4,
                        }}
                      >
                        <strong style={{ color: "#fff" }}>LAMAH CLOTHING CO.</strong> is a luxury streetwear house founded in Atlanta in 2024 under the mantra <em>"Wear the mindset. Live the movement."</em> The brand operates at the intersection of music, sports, streaming culture, and thoughtful design — producing limited-run collections of premium fleece, heavyweight graphic tees, and cut & sew outerwear. LAMAH has been featured by Complex, Highsnobiety, Hypebeast, Vogue Runway, and ESPN Fashion, and is worn by dozens of professional athletes and creators across the U.S.
                      </Typography>
                      <Divider sx={{ borderColor: "rgba(57,255,20,0.08)", mb: 4 }} />
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                              mb: 2,
                              fontSize: "1.05rem",
                            }}
                          >
                            What's Included
                          </Typography>
                          <Stack spacing={2}>
                            {[
                              "Brand overview & key facts",
                              "Hi-res product & editorial imagery",
                              "Founder bios & approved headshots",
                              "Collection lookbooks (SS24 — SS26)",
                              "Press releases from all major drops",
                              "Brand guideline PDF & logos",
                            ].map((item, k) => (
                              <Stack direction="row" spacing={2} key={k}>
                                <Check size={20} style={{ color: "#39FF14", flexShrink: 0, marginTop: 2 }} />
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    color: "#A0A0A0",
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {item}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card
                            sx={{
                              bgcolor: "rgba(57,255,20,0.04)",
                              borderRadius: 4,
                              border: "1px solid rgba(57,255,20,0.2)",
                              height: "100%",
                            }}
                          >
                            <CardContent sx={{ p: 4, textAlign: "center" }}>
                              <FileText size={44} style={{ color: "#39FF14", marginBottom: 16 }} />
                              <Typography
                                sx={{
                                  fontFamily: "Bebas Neue, cursive",
                                  fontSize: "1.75rem",
                                  color: "#fff",
                                  letterSpacing: "0.1em",
                                  mb: 1,
                                }}
                              >
                                FULL PRESS KIT
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: "Poppins, sans-serif",
                                  color: "#A0A0A0",
                                  mb: 3,
                                }}
                              >
                                ZIP · 442 MB · Updated May 2026
                              </Typography>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Download size={18} />}
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
                                Download Press Kit
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={3}>
                    <Card
                      sx={{
                        bgcolor: "#0C0C0C",
                        borderRadius: 4,
                        border: "1px solid rgba(57,255,20,0.12)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Typography
                          sx={{
                            fontFamily: "Bebas Neue, cursive",
                            fontSize: "1.5rem",
                            color: "#fff",
                            letterSpacing: "0.1em",
                            mb: 3,
                          }}
                        >
                          KEY FACTS
                        </Typography>
                        <Stack spacing={2.5}>
                          {[
                            { k: "Full Name", v: "LAMAH CLOTHING CO." },
                            { k: "Founded", v: "2024" },
                            { k: "Founder", v: "NotLamarama" },
                            { k: "Headquarters", v: "Atlanta, Georgia, USA" },
                            { k: "Category", v: "Luxury Streetwear" },
                            { k: "Distribution", v: "DTC + Select Stockists" },
                            { k: "Press Inquiries", v: "press@lamahclothingco.com" },
                          ].map((r, i) => (
                            <Stack
                              key={i}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              spacing={2}
                              sx={{ borderBottom: i < 6 ? "1px dashed rgba(57,255,20,0.08)" : 0, pb: i < 6 ? 2 : 0 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: "#A0A0A0", fontFamily: "Poppins, sans-serif", flexShrink: 0, width: 130 }}
                              >
                                {r.k}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#fff",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 500,
                                  textAlign: "right",
                                }}
                              >
                                {r.v}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* TAB 1 - In The News */}
          {tab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={4}>
                {newsArticles.map((a, i) => (
                  <Grid item xs={12} md={6} key={i}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Card
                        sx={{
                          bgcolor: "#0C0C0C",
                          borderRadius: 4,
                          border: "1px solid rgba(57,255,20,0.1)",
                          boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                          height: "100%",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            borderColor: "rgba(57,255,20,0.26)",
                            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                          },
                        }}
                      >
                        <CardActionArea
                          sx={{ borderRadius: 4, height: "100%" }}
                          href={a.link}
                          target="_blank"
                        >
                          <CardContent sx={{ p: 4, height: "100%" }}>
                            <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: "wrap" }}>
                              <Chip
                                size="small"
                                label={a.category}
                                icon={<Tag size={12} style={{ color: "#39FF14" }} />}
                                sx={{
                                  bgcolor: "rgba(57,255,20,0.1)",
                                  color: "#39FF14",
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 600,
                                  borderRadius: 999,
                                  border: "1px solid rgba(57,255,20,0.2)",
                                  "& .MuiChip-icon": { color: "#39FF14" },
                                }}
                              />
                              <Chip
                                size="small"
                                icon={<Calendar size={12} style={{ color: "#A0A0A0" }} />}
                                label={a.date}
                                sx={{
                                  bgcolor: "rgba(255,255,255,0.04)",
                                  color: "#A0A0A0",
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 500,
                                  borderRadius: 999,
                                  border: "1px solid rgba(255,255,255,0.06)",
                                }}
                              />
                            </Stack>
                            <Typography
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                color: "#A0A0A0",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontSize: "0.8rem",
                                mb: 1,
                              }}
                            >
                              {a.outlet}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "1.35rem",
                                mb: 2,
                                lineHeight: 1.3,
                              }}
                            >
                              {a.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "Poppins, sans-serif",
                                color: "#A0A0A0",
                                lineHeight: 1.8,
                                mb: 3,
                              }}
                            >
                              {a.excerpt}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins, sans-serif",
                                  color: "#39FF14",
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                }}
                              >
                                Read article
                              </Typography>
                              <ExternalLink size={16} style={{ color: "#39FF14" }} />
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* TAB 2 - Brand Assets */}
          {tab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Stack spacing={3} sx={{ mb: 5 }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#A0A0A0",
                    lineHeight: 1.8,
                  }}
                >
                  Please use these approved assets when referencing LAMAH editorially. If you require alternate formats, resolutions, or specific imagery, reach out to press@lamahclothingco.com.
                </Typography>
              </Stack>

              <Grid container spacing={4}>
                {brandAssets.map((a, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Card
                        sx={{
                          bgcolor: "#0C0C0C",
                          borderRadius: 4,
                          border: "1px solid rgba(57,255,20,0.1)",
                          height: "100%",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "rgba(57,255,20,0.24)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: { xs: 3, md: 4 },
                            borderBottom: "1px solid rgba(57,255,20,0.06)",
                            minHeight: 160,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(255,255,255,0.015)",
                          }}
                        >
                          {a.type.includes("PNG") ? (
                            <Box
                              sx={{
                                position: "relative",
                                width: 180,
                                height: 72,
                              }}
                            >
                              <Image
                                src={a.file}
                                alt={a.title}
                                fill
                                sizes="180px"
                                style={{ objectFit: "contain" }}
                              />
                            </Box>
                          ) : a.type === "PDF" ? (
                            <Box sx={{ textAlign: "center" }}>
                              <FileText size={48} style={{ color: "#EF4444", marginBottom: 8 }} />
                              <Typography
                                sx={{
                                  fontFamily: "Inter, sans-serif",
                                  color: "#EF4444",
                                  fontWeight: 700,
                                  letterSpacing: "0.08em",
                                }}
                              >
                                PDF
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ textAlign: "center" }}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 3,
                                  bgcolor: "rgba(59,130,246,0.12)",
                                  color: "#3B82F6",
                                  display: "inline-block",
                                  mb: 1.5,
                                }}
                              >
                                <FileDown size={36} />
                              </Box>
                              <Typography
                                sx={{
                                  fontFamily: "Inter, sans-serif",
                                  color: "#3B82F6",
                                  fontWeight: 700,
                                  letterSpacing: "0.08em",
                                }}
                              >
                                {a.type}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                            <Chip
                              size="small"
                              label={a.type}
                              sx={{
                                bgcolor: "rgba(57,255,20,0.08)",
                                color: "#39FF14",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                borderRadius: 999,
                              }}
                            />
                            <Chip
                              size="small"
                              icon={<Hash size={11} />}
                              label={a.size}
                              sx={{
                                bgcolor: "rgba(255,255,255,0.03)",
                                color: "#A0A0A0",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 500,
                                borderRadius: 999,
                              }}
                            />
                          </Stack>
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "1.05rem",
                              mb: 1,
                            }}
                          >
                            {a.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "#A0A0A0",
                              lineHeight: 1.7,
                              mb: 3,
                            }}
                          >
                            {a.description}
                          </Typography>
                          <Button
                            fullWidth
                            startIcon={<Download size={16} />}
                            variant="outlined"
                            href={a.file}
                            download
                            sx={{
                              borderRadius: 3,
                              color: "#fff",
                              borderColor: "rgba(57,255,20,0.22)",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 600,
                              textTransform: "none",
                              py: 1.2,
                              "&:hover": {
                                borderColor: "#39FF14",
                                bgcolor: "rgba(57,255,20,0.06)",
                              },
                            }}
                          >
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* TAB 3 - Contact */}
          {tab === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      bgcolor: "#0C0C0C",
                      borderRadius: 4,
                      border: "1px solid rgba(57,255,20,0.12)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        px: { xs: 3, md: 5 },
                        py: 4,
                        bgcolor: "rgba(57,255,20,0.05)",
                        borderBottom: "1px solid rgba(57,255,20,0.08)",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Mail size={26} style={{ color: "#39FF14" }} />
                        <Typography
                          sx={{
                            fontFamily: "Bebas Neue, cursive",
                            fontSize: "2rem",
                            color: "#fff",
                            letterSpacing: "0.1em",
                          }}
                        >
                          PRESS INQUIRIES
                        </Typography>
                      </Stack>
                    </Box>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                      <Stack spacing={3.5}>
                        <Card
                          sx={{
                            bgcolor: "rgba(57,255,20,0.04)",
                            borderRadius: 3,
                            border: "1px solid rgba(57,255,20,0.16)",
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                              <Box>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    color: "#A0A0A0",
                                    fontWeight: 500,
                                    fontSize: "0.85rem",
                                    mb: 0.5,
                                  }}
                                >
                                  Press & Editorial
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "1.05rem",
                                  }}
                                >
                                  press@lamahclothingco.com
                                </Typography>
                              </Box>
                              <Button
                                onClick={() => handleCopy("press@lamahclothingco.com")}
                                variant="outlined"
                                startIcon={<Copy size={14} />}
                                sx={{
                                  borderRadius: 3,
                                  color: "#39FF14",
                                  borderColor: "rgba(57,255,20,0.3)",
                                  flexShrink: 0,
                                  "&:hover": {
                                    bgcolor: "rgba(57,255,20,0.08)",
                                    borderColor: "#39FF14",
                                  },
                                }}
                              >
                                Copy
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card
                          sx={{
                            bgcolor: "rgba(255,255,255,0.02)",
                            borderRadius: 3,
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                              <Box>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    color: "#A0A0A0",
                                    fontWeight: 500,
                                    fontSize: "0.85rem",
                                    mb: 0.5,
                                  }}
                                >
                                  Collabs, Partnerships, PR
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins, sans-serif",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "1.05rem",
                                  }}
                                >
                                  partners@lamahclothingco.com
                                </Typography>
                              </Box>
                              <Button
                                onClick={() => handleCopy("partners@lamahclothingco.com")}
                                variant="outlined"
                                startIcon={<Copy size={14} />}
                                sx={{
                                  borderRadius: 3,
                                  color: "#fff",
                                  borderColor: "rgba(255,255,255,0.15)",
                                  flexShrink: 0,
                                  "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.05)",
                                    borderColor: "rgba(255,255,255,0.3)",
                                  },
                                }}
                              >
                                Copy
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Divider sx={{ borderColor: "rgba(57,255,20,0.06)", my: 1 }} />

                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "#A0A0A0",
                            lineHeight: 1.8,
                          }}
                        >
                          <strong style={{ color: "#fff" }}>Response time:</strong> 24–48 hours for press requests (M–F EST). Include publication name, deadline, and specific needs (images, samples, interviews, statement) for the fastest reply.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      bgcolor: "rgba(57,255,20,0.04)",
                      borderRadius: 4,
                      border: "1px solid rgba(57,255,20,0.2)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 0 50px rgba(57,255,20,0.08)",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
                      <Newspaper size={52} style={{ color: "#39FF14", marginBottom: 20 }} />
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          fontSize: "2.25rem",
                          color: "#fff",
                          letterSpacing: "0.12em",
                          mb: 2,
                        }}
                      >
                        WANT TO COVER LAMAH?
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "#A0A0A0",
                          lineHeight: 1.8,
                          mb: 4,
                          maxWidth: 440,
                          mx: "auto",
                        }}
                      >
                        Drop us an email, or use the general contact form and select "Press / Media" as your subject. Our PR team sends press samples to approved editorial outlets.
                      </Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                        <Button
                          component="a"
                          href="mailto:press@lamahclothingco.com"
                          variant="contained"
                          startIcon={<Mail size={16} />}
                          sx={{
                            bgcolor: "#39FF14",
                            color: "#000",
                            borderRadius: 3,
                            px: 6,
                            py: 1.75,
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "0 0 35px rgba(57,255,20,0.35)",
                            "&:hover": {
                              bgcolor: "#32e012",
                              boxShadow: "0 0 50px rgba(57,255,20,0.55)",
                            },
                          }}
                        >
                          Email Press
                        </Button>
                        <Button
                          component={Link}
                          href="/contact"
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            px: 6,
                            py: 1.75,
                            color: "#fff",
                            borderColor: "rgba(57,255,20,0.3)",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": {
                              borderColor: "#39FF14",
                              bgcolor: "rgba(57,255,20,0.06)",
                            },
                          }}
                        >
                          Contact Page
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Container>
      </Box>
      <Footer />

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbar(false)}
          sx={{
            fontFamily: "Poppins, sans-serif",
            bgcolor: "rgba(57,255,20,0.1)",
            color: "#39FF14",
            border: "1px solid rgba(57,255,20,0.3)",
          }}
          icon={<Check size={20} style={{ color: "#39FF14" }} />}
        >
          Email copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
