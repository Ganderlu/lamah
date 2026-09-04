"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Box, Container, Typography, Button, Stack, Chip } from "@mui/material";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <Box
      ref={heroRef}
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#040404",
      }}
    >
      {/* Animated Background Image with parallax */}
      <motion.div
        style={{
          y: bgY,
          scale: 1.08,
          position: "absolute",
          inset: "0",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2400&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.28,
          }}
        />
      </motion.div>

      {/* Multi-layer Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4,4,4,0.2) 0%, rgba(4,4,4,0.65) 45%, rgba(4,4,4,0.95) 100%), linear-gradient(90deg, rgba(4,4,4,0.98) 0%, rgba(4,4,4,0.85) 25%, rgba(4,4,4,0.55) 50%, rgba(4,4,4,0.2) 75%, rgba(4,4,4,0.7) 100%)",
        }}
      />

      {/* Animated Grid Lines */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(57,255,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 0%, transparent 70%)",
        }}
      />

      {/* Floating glow blobs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "18%",
          right: "10%",
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, rgba(57,255,20,0.18) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 25, 0],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle noise texture overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
          scale,
          position: "relative",
          zIndex: 10,
          width: "100%",
          padding: "0 16px",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ px: { xs: 2, md: 4, lg: 6 } }}
        >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.15fr 1fr" },
            gap: { xs: 10, lg: 14 },
            alignItems: "center",
            py: { xs: 12, md: 14, lg: 16 },
            minHeight: "100vh",
            alignContent: "center",
          }}
        >
          {/* Left Content */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <Chip
                icon={<Sparkles size={14} style={{ color: "#39FF14" }} />}
                label="NEW SEASON · FW 25/26"
                sx={{
                  mb: { xs: 4, md: 5 },
                  bgcolor: "rgba(57,255,20,0.07)",
                  color: "#39FF14",
                  border: "1px solid rgba(57,255,20,0.25)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  fontSize: "0.72rem",
                  py: 0.9,
                  px: 0.5,
                  borderRadius: "999px",
                  backdropFilter: "blur(8px)",
                  "& .MuiChip-icon": { ml: 1.2, mr: 0.3 },
                  "& .MuiChip-label": { px: 2 },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <Typography
                component={motion.div}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                sx={{
                  color: "#fff",
                  fontFamily: "Bebas Neue, cursive",
                  lineHeight: 0.88,
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: "3.2rem", sm: "4.8rem", md: "6.4rem", lg: "7.6rem", xl: "8.4rem" },
                  fontWeight: 400,
                  letterSpacing: "0.015em",
                }}
              >
                <Box component="span" sx={{ display: "block" }}>
                  WE CREATE
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#39FF14",
                    background:
                      "linear-gradient(135deg, #39FF14 0%, #6CFF52 50%, #39FF14 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 60px rgba(57,255,20,0.35)",
                    filter: "drop-shadow(0 0 30px rgba(57,255,20,0.25))",
                  }}
                >
                  MOVEMENT
                </Box>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.55,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#CFCFCF",
                  maxWidth: "560px",
                  mb: { xs: 5, md: 7 },
                  fontSize: { xs: "0.98rem", md: "1.08rem" },
                  lineHeight: 1.85,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.005em",
                }}
              >
                Every piece we design carries a purpose. Crafted for those who move with
                intention — wear the mindset, live the movement, own the culture.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.75,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 3 }}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 18px 50px rgba(57,255,20,0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%" }}
                >
                  <Button
                    component={Link}
                    href="/men"
                    variant="contained"
                    endIcon={<ArrowRight size={18} />}
                    sx={{
                      width: "100%",
                      bgcolor: "#39FF14",
                      color: "#050505",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.96rem",
                      letterSpacing: "0.01em",
                      "&:hover": { bgcolor: "#2FD10F" },
                      px: { xs: 3, sm: 4.5, md: 5.5 },
                      py: { xs: 1.7, md: 1.85 },
                      borderRadius: "14px",
                      boxShadow: "0 10px 30px rgba(57,255,20,0.22)",
                      textTransform: "none",
                    }}
                  >
                    Shop Men
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%" }}
                >
                  <Button
                    component={Link}
                    href="/women"
                    variant="outlined"
                    endIcon={<ArrowRight size={18} />}
                    sx={{
                      width: "100%",
                      borderColor: "rgba(57,255,20,0.4)",
                      color: "#39FF14",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.96rem",
                      letterSpacing: "0.01em",
                      backdropFilter: "blur(8px)",
                      "&:hover": {
                        borderColor: "#39FF14",
                        bgcolor: "rgba(57,255,20,0.08)",
                      },
                      px: { xs: 3, sm: 4.5, md: 5.5 },
                      py: { xs: 1.7, md: 1.85 },
                      borderRadius: "14px",
                      textTransform: "none",
                    }}
                  >
                    Shop Women
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.95,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <Box
                sx={{
                  mt: { xs: 7, md: 9 },
                  pt: { xs: 4, md: 5 },
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: { xs: 2, md: 4 },
                  maxWidth: 560,
                }}
              >
                {[
                  { v: "250+", l: "Curated Pieces" },
                  { v: "50K", l: "Movement Members" },
                  { v: "4.9★", l: "Customer Love" },
                ].map((stat, i) => (
                  <Box key={i}>
                    <Typography
                      sx={{
                        fontFamily: "Bebas Neue, cursive",
                        fontSize: { xs: "1.9rem", md: "2.3rem" },
                        color: "#fff",
                        letterSpacing: "0.03em",
                        lineHeight: 1,
                        mb: 0.7,
                      }}
                    >
                      {stat.v}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: { xs: "0.7rem", md: "0.76rem" },
                        color: "#8A8A8A",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {stat.l}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>

          {/* Right Hero Visual */}
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "flex-end" },
              width: "100%",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: 1,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              style={{ width: "100%" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: 420, sm: 460, md: 500 },
                }}
              >
              {/* Outer aura glow */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.6, 0.85, 0.6],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  inset: "-30px",
                  borderRadius: "36px",
                  background:
                    "conic-gradient(from 140deg at 50% 50%, rgba(57,255,20,0.22), rgba(0,229,255,0.1), rgba(57,255,20,0.22))",
                  filter: "blur(40px)",
                  zIndex: 0,
                }}
              />

              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, rotateY: -15 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.1, delay: 0.55, ease: "easeOut" }}
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    aspectRatio: { xs: "4/5", md: "1/1.15" },
                    width: "100%",
                    bgcolor: "linear-gradient(160deg, rgba(12,12,12,0.85) 0%, rgba(6,6,6,0.95) 100%)",
                    background:
                      "linear-gradient(160deg, rgba(12,12,12,0.85) 0%, rgba(6,6,6,0.95) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: { xs: "24px", md: "30px" },
                    border: "1px solid rgba(57,255,20,0.16)",
                    boxShadow:
                      "0 30px 80px rgba(0,0,0,0.55), 0 0 80px rgba(57,255,20,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: { xs: "1rem", md: "1.35rem" },
                    p: { xs: "2.25rem 1.75rem", md: "3rem 2.5rem" },
                    overflow: "hidden",
                  }}
                >
                  {/* Inner accent line */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "40%",
                      height: 1,
                      background:
                        "linear-gradient(90deg, transparent, rgba(57,255,20,0.5), transparent)",
                    }}
                  />

                  {[
                    { word: "LOVE", delay: 0.85 },
                    { word: "ACCEPT", delay: 0.95 },
                    { word: "MOTIVATE", delay: 1.05 },
                    { word: "ASPIRE", delay: 1.15 },
                    { word: "HEAL", delay: 1.25 },
                  ].map(({ word, delay }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.8,
                        delay,
                        ease: [0.22, 1, 0.36, 1] as const,
                      }}
                      style={{ width: "100%" }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Bebas Neue, cursive",
                          color: i === 2 ? "#39FF14" : "#fff",
                          fontSize: {
                            xs: i === 2 ? "2.2rem" : "1.95rem",
                            md: i === 2 ? "2.75rem" : "2.4rem",
                          },
                          letterSpacing: "0.22em",
                          fontWeight: 400,
                          textAlign: "center",
                          lineHeight: 1,
                          opacity: i === 2 ? 1 : 0.88,
                          textShadow:
                            i === 2
                              ? "0 0 30px rgba(57,255,20,0.55)"
                              : "0 0 15px rgba(255,255,255,0.1)",
                          background:
                            i === 2
                              ? "linear-gradient(135deg, #39FF14 0%, #6CFF52 100%)"
                              : "none",
                          WebkitBackgroundClip: i === 2 ? "text" : "border-box",
                          backgroundClip: i === 2 ? "text" : "border-box",
                          WebkitTextFillColor: i === 2 ? "transparent" : "inherit",
                        }}
                      >
                        {word}
                      </Typography>
                      {i < 4 && (
                        <Box
                          sx={{
                            mx: "auto",
                            my: "0.5rem",
                            width: 28,
                            height: 1,
                            bgcolor: "rgba(57,255,20,0.18)",
                          }}
                        />
                      )}
                    </motion.div>
                  ))}

                  {/* Corner accents */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 22,
                      left: 22,
                      width: 18,
                      height: 18,
                      borderTop: "1.5px solid rgba(57,255,20,0.5)",
                      borderLeft: "1.5px solid rgba(57,255,20,0.5)",
                      borderRadius: "4px 0 0 0",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 22,
                      right: 22,
                      width: 18,
                      height: 18,
                      borderBottom: "1.5px solid rgba(57,255,20,0.5)",
                      borderRight: "1.5px solid rgba(57,255,20,0.5)",
                      borderRadius: "0 0 4px 0",
                    }}
                  />
                </Box>
              </motion.div>

              {/* Floating mini badges */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: "-18px", md: "-22px" },
                  left: { xs: "-10px", md: "-24px" },
                  zIndex: 5,
                }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                <Chip
                  label="LIMITED"
                  sx={{
                    bgcolor: "#39FF14",
                    color: "#050505",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.16em",
                    px: 0.5,
                    py: 0.4,
                    borderRadius: "999px",
                    boxShadow: "0 10px 30px rgba(57,255,20,0.35)",
                    "& .MuiChip-label": { px: 1.8 },
                  }}
                />
                </motion.div>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: "-14px", md: "-18px" },
                  right: { xs: "-6px", md: "-16px" },
                  zIndex: 5,
                }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                <Box
                  sx={{
                    px: 2.2,
                    py: 1.3,
                    borderRadius: "14px",
                    bgcolor: "rgba(12,12,12,0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#39FF14",
                      boxShadow: "0 0 10px #39FF14",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "0.04em",
                    }}
                  >
                    LIVE DROP · 48 LEFT
                  </Typography>
                </Box>
                </motion.div>
              </Box>
            </Box>
            </motion.div>
          </Box>
        </Box>
        </Container>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: "easeOut" }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)" }}
      >
        <Box
          component="a"
          href="#categories-section"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#8A8A8A",
            cursor: "pointer",
            textDecoration: "none",
            transition: "color 0.3s ease",
            "&:hover": { color: "#39FF14" },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              letterSpacing: "0.26em",
              mb: 1.2,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "0.68rem",
            }}
          >
            EXPLORE
          </Typography>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={22} strokeWidth={1.75} />
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
