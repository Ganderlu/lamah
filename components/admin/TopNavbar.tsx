
"use client";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search,
  Bell,
  MessageSquare,
  Moon,
  Globe,
  Plus,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminTopNavbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "rgba(5,5,5,0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(57,255,20,0.1)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1, px: { xs: 2, lg: 4 } }}>
        {/* Left Side - Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 12,
            bgcolor: alpha("#111111", 0.8),
            px: 2,
            py: 0.75,
            flex: 1,
            maxWidth: 400,
            mr: 2,
            border: "1px solid rgba(57,255,20,0.1)",
          }}
        >
          <Search size={18} color="#9E9E9E" />
          <InputBase
            placeholder="Search anything..."
            sx={{
              ml: 2,
              flex: 1,
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              "& ::placeholder": {
                color: "#9E9E9E",
              },
            }}
          />
          <Chip
            label="⌘K"
            size="small"
            sx={{
              bgcolor: "rgba(57,255,20,0.1)",
              color: "#39FF14",
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Right Side - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
          {!isMobile && (
            <>
              <Button
                size="small"
                startIcon={<Calendar size={16} />}
                sx={{
                  color: "#9E9E9E",
                  textTransform: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.875rem",
                  "&:hover": {
                    bgcolor: "rgba(57,255,20,0.05)",
                    color: "#fff",
                  },
                }}
              >
                May 15 - May 21, 2024
              </Button>

              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{
                  bgcolor: "#39FF14",
                  color: "#000",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#2dd610",
                  },
                }}
              >
                Add Product
              </Button>
            </>
          )}

          <IconButton sx={{ color: "#fff" }}>
            <Badge badgeContent={3} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          <IconButton sx={{ color: "#fff" }}>
            <Badge badgeContent={5} color="primary">
              <MessageSquare size={20} />
            </Badge>
          </IconButton>

          {!isMobile && (
            <>
              <IconButton sx={{ color: "#fff" }}>
                <Moon size={20} />
              </IconButton>

              <IconButton sx={{ color: "#fff" }}>
                <Globe size={20} />
              </IconButton>
            </>
          )}

          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#39FF14",
              color: "#000",
              fontWeight: 700,
            }}
          >
            A
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
