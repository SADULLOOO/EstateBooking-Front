import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/app/router/routes";
import { BrandMark } from "@/components/ui/BrandMark";

const NAV_ITEMS = [
  { to: ROUTES.admin, labelKey: "sidebar.overview", icon: "📊", end: true },
  { to: ROUTES.adminVehicles, labelKey: "sidebar.vehicles", icon: "🚗" },
  { to: ROUTES.adminVehicleCategories, labelKey: "sidebar.vehicleCategories", icon: "🏷️" },
  { to: ROUTES.adminProperties, labelKey: "sidebar.properties", icon: "🏢" },
  { to: ROUTES.adminBookings, labelKey: "sidebar.bookings", icon: "📅" },
  { to: ROUTES.adminReviews, labelKey: "sidebar.reviews", icon: "⭐" },
  { to: ROUTES.adminUsers, labelKey: "sidebar.users", icon: "👥" },
  { to: ROUTES.adminNotifications, labelKey: "sidebar.notifications", icon: "🔔" },
  { to: ROUTES.adminAnalytics, labelKey: "sidebar.analytics", icon: "📈" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { t } = useTranslation("admin");

  return (
    <>
      {isOpen && <div className="admin-sidebar__backdrop" onClick={onClose} />}
      <motion.aside
        className={`admin-sidebar glass-surface ${isOpen ? "admin-sidebar--open" : ""}`}
        initial={false}
      >
        <div className="admin-sidebar__header">
          <BrandMark size={28} />
          <strong>{t("sidebar.panelTitle")}</strong>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? "is-active" : ""}`}
            >
              <span>{item.icon}</span>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <Link to={ROUTES.home} className="admin-sidebar__link" onClick={onClose}>
            <span>🏠</span>
            {t("sidebar.backToSite")}
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
