
"use client";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Badge,
  CircularProgress,
} from "@mui/material";
import {
  Bell,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUnreadNotificationsCount } from "@/lib/notifications";
import { fetchUnreadMessagesCount } from "@/lib/messages";
import { fetchAdminProfile } from "@/lib/admin";
import type { Admin } from "@/types/admin";

export default function AdminTopNavbar() {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [adminProfile, setAdminProfile] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [notificationsCount, messagesCount, admin] = await Promise.all([
          fetchUnreadNotificationsCount(),
          fetchUnreadMessagesCount(),
          fetchAdminProfile(),
        ]);
        
        setUnreadNotifications(notificationsCount);
        setUnreadMessages(messagesCount);
        setAdminProfile(admin);
      } catch (error) {
        console.error("Error loading top navbar data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fallback to sample data if loading or no data
  const displayNotifications = loading ? 3 : unreadNotifications;
  const displayMessages = loading ? 5 : unreadMessages;
  const displayName = loading ? "Admin" : adminProfile?.name || "Admin";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarSrc = !loading && adminProfile?.avatar ? adminProfile.avatar : undefined;

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
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#39FF14" }} />
            ) : (
              <Badge
                badgeContent={displayNotifications}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#EF4444",
                    color: "#fff",
                  },
                }}
              >
                <Bell size={20} />
              </Badge>
            )}
          </IconButton>

          <IconButton sx={{ color: "#fff" }}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#39FF14" }} />
            ) : (
              <Badge
                badgeContent={displayMessages}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#39FF14",
                    color: "#000",
                    fontWeight: 700,
                  },
                }}
              >
                <MessageSquare size={20} />
              </Badge>
            )}
          </IconButton>

          {loading ? (
            <CircularProgress size={48} sx={{ color: "#39FF14" }} />
          ) : (
            <Avatar
              src={avatarSrc}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#39FF14",
                color: "#000",
                fontWeight: 700,
                fontSize: "1.25rem",
              }}
            >
              {avatarInitial}
            </Avatar>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
