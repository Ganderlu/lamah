
"use client";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Bell,
  MessageSquare,
} from "lucide-react";

export default function AdminTopNavbar() {
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
      <Toolbar sx={{ justifyContent: "flex-end", py: 1, px: { xs: 2, lg: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
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
