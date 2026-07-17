
"use client";

import { Box, Typography, Card, CardContent, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: number;
  changeLabel: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
}: StatCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          background: "linear-gradient(135deg, rgba(17,17,17,1) 0%, rgba(9,9,9,1) 100%)",
          border: "1px solid rgba(57,255,20,0.15)",
          boxShadow: "0 0 30px rgba(57,255,20,0.05)",
          "&:hover": {
            border: "1px solid rgba(57,255,20,0.3)",
            boxShadow: "0 0 40px rgba(57,255,20,0.1)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#9E9E9E",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  display: "block",
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  mb: 1,
                }}
              >
                {value}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: isPositive ? "#39FF14" : "#FF4D4F",
                    fontWeight: 700,
                    fontFamily: "Poppins, sans-serif",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isPositive ? "↑" : "↓"} {Math.abs(change)}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9E9E9E",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {changeLabel}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "rgba(57,255,20,0.1)",
                border: "1px solid rgba(57,255,20,0.2)",
              }}
            >
              <Icon color="#39FF14" size={28} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
