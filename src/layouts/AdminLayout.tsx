import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminSidebar } from "@/layouts/AdminSidebar";

export function AdminLayout() {
  const { t } = useTranslation("admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="container admin-layout">
      <button type="button" className="admin-layout__menu-toggle" onClick={() => setIsSidebarOpen(true)}>
        ☰ {t("sidebar.menuToggle")}
      </button>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="admin-layout__content">
        <Outlet />
      </div>
    </div>
  );
}
