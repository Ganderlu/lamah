"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Skeleton,
  Link as MuiLink,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { fetchSettings } from "@/lib/settings";
import type { Settings } from "@/types/settings";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const hasFirebaseConfig = Boolean(
        typeof process !== "undefined" &&
          (process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      );

      try {
        setLoading(true);
        if (hasFirebaseConfig) {
          const data = await fetchSettings();
          if (!cancelled) setSettings(data);
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[ContactPage] Could not load store settings:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const contactCards = useMemo(() => {
    const email =
      (settings?.supportEmail || settings?.storeEmail || "").trim() ||
      "lamahclothing@gmail.com";
    const phone = (settings?.phone || "").trim() || "+1 (650) 773-7186";
    const country = (settings?.country || "").trim() || "United States";
    const state = (settings?.state || "").trim() || "Georgia";
    const city = (settings?.city || "").trim() || "Atlanta";

    const mailto = email ? `mailto:${email}` : undefined;
    const tel = phone
      ? `tel:${phone.replace(/[^+\d]/g, "")}`
      : undefined;

    const infoLine = [city, state].filter(Boolean).join(", ");

    return [
      {
        icon: <Mail size={28} />,
        title: "Email",
        info: email,
        href: mailto,
        description: "For all order and product inquiries",
      },
      {
        icon: <Phone size={28} />,
        title: "Phone",
        info: phone,
        href: tel,
        description: "Mon-Fri, 9AM-6PM EST",
      },
      {
        icon: <MapPin size={28} />,
        title: "Headquarters",
        info: infoLine,
        href: undefined,
        description: country,
      },
    ] as const;
  }, [settings]);

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
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 14 } }}>
          <Grid container spacing={4} justifyContent="center">
            {/* Contact Info */}
            <Grid item xs={12} md={10}>
              <Grid container spacing={4}>
                {(loading ? [0, 1, 2] : contactCards.map((_, i) => i)).map(
                  (i) => {
                    const item = !loading ? contactCards[i] : null;
                    const renderInfo = () => {
                      if (loading) return null;
                      if (item!.href) {
                        return (
                          <MuiLink
                            href={item!.href}
                            underline="none"
                            sx={{
                              color: "#fff",
                              "&:hover": { color: "#39FF14" },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "inherit",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                fontSize: "1.05rem",
                                mb: 1,
                                wordBreak: "break-word",
                              }}
                            >
                              {item!.info}
                            </Typography>
                          </MuiLink>
                        );
                      }
                      return (
                        <Typography
                          sx={{
                            color: "#fff",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "1.05rem",
                            mb: 1,
                            wordBreak: "break-word",
                          }}
                        >
                          {item!.info}
                        </Typography>
                      );
                    };

                    return (
                      <Grid item xs={12} md={4} key={i}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                          <Card
                            sx={{
                              bgcolor: "#0C0C0C",
                              borderRadius: "24px",
                              border:
                                i === 1
                                  ? "1px solid rgba(57,255,20,0.5)"
                                  : "1px solid rgba(57,255,20,0.12)",
                              boxShadow:
                                i === 1
                                  ? "0 0 40px rgba(57,255,20,0.18), 0 20px 40px rgba(0,0,0,0.25)"
                                  : "0 20px 40px rgba(0,0,0,0.2)",
                              height: "100%",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: "rgba(57,255,20,0.5)",
                                transform: "translateY(-6px)",
                                boxShadow:
                                  "0 30px 60px rgba(0,0,0,0.4), 0 0 30px rgba(57,255,20,0.12)",
                              },
                            }}
                          >
                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  p: 2,
                                  borderRadius: "18px",
                                  bgcolor: "rgba(57,255,20,0.1)",
                                  color: "#39FF14",
                                  mb: 3,
                                  boxShadow: "0 0 20px rgba(57,255,20,0.15)",
                                }}
                              >
                                {loading ? (
                                  <Skeleton
                                    variant="circular"
                                    width={28}
                                    height={28}
                                    sx={{ bgcolor: "rgba(57,255,20,0.2)" }}
                                  />
                                ) : (
                                  item!.icon
                                )}
                              </Box>
                              {loading ? (
                                <Stack spacing={1.5}>
                                  <Skeleton
                                    variant="text"
                                    width="55%"
                                    height={36}
                                    sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width="85%"
                                    height={26}
                                    sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width="70%"
                                    height={22}
                                    sx={{ bgcolor: "rgba(255,255,255,0.05)" }}
                                  />
                                </Stack>
                              ) : (
                                <>
                                  <Typography
                                    sx={{
                                      color: "#fff",
                                      fontFamily: "Bebas Neue, cursive",
                                      fontSize: "1.8rem",
                                      letterSpacing: "0.1em",
                                      mb: 1.5,
                                    }}
                                  >
                                    {item!.title.toUpperCase()}
                                  </Typography>
                                  {renderInfo()}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#A0A0A0",
                                      fontFamily: "Poppins, sans-serif",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {item!.description}
                                  </Typography>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
