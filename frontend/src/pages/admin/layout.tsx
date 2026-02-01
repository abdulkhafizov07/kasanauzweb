import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useUserContext } from "../../context/user";
import AdminAsideComponent from "@/components/web/admin/aside";
import AdminNavbarComponent from "@/components/web/admin/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, loading, user } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/auth/sign-in/");
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <SidebarProvider>
      <AdminAsideComponent />

      <div className="admin-body w-full bg-bg-placeholder">
        <AdminNavbarComponent />

        <Outlet />
      </div>
    </SidebarProvider>
  );
};
