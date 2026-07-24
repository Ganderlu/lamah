"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopNavbar from "@/components/admin/TopNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AdminAuthGuard>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <AdminTopNavbar />
          <Box
            sx={{
              flex: 1,
              bgcolor: "#050505",
              p: { xs: 2, lg: 4 },
              overflowY: "auto",
              width: "100%",
              maxWidth: "100vw",
              overflowX: "hidden",
            }}
          >
            {children}
            <AdminFooter />
          </Box>
        </Box>
      </Box>
    </AdminAuthGuard>
  );
}
