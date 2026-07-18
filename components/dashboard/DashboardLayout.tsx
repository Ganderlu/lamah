"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import UserSidebar from "./UserSidebar";
import UserTopNavbar from "./UserTopNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#050505" }}>
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <UserTopNavbar />
        <Box sx={{ flex: 1, p: { xs: 2, md: 4, lg: 6 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
