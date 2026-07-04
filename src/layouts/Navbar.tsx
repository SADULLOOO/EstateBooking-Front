import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { ROUTES } from "@/app/router/routes";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { AuthModal } from "@/components/auth/AuthModal";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { BrandMark } from "@/components/ui/BrandMark";

const NAV_LINKS = [
  { to: ROUTES.vehicles, key: "links.vehicles" },
  { to: ROUTES.housing, key: "links.housing" },
  { to: ROUTES.bookings, key: "links.bookings" },
  { to: ROUTES.chat, key: "links.chat" },
];

export function Navbar() {
  const { t } = useTranslation("navbar");
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`navbar glass-surface ${isScrolled ? "navbar--scrolled" : ""}`}
      >
        <div className="container navbar__inner">
          <Link to={ROUTES.home} className="navbar__brand">
            <BrandMark size={30} />
            HousingBook
          </Link>

          <nav className="navbar__links navbar__links--desktop">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `navbar__link ${isActive ? "is-active" : ""}`}
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__actions">
            <button
              type="button"
              className="navbar__theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="navbar__user">
                {user?.is_staff && (
                  <Link to={ROUTES.admin} className="navbar__link navbar__admin-link">
                    {t("admin")}
                  </Link>
                )}
                <NotificationBell />
                <Link to={ROUTES.profile} className="navbar__avatar">
                  {user?.username?.[0]?.toUpperCase() ?? "U"}
                </Link>
                <button type="button" className="navbar__logout" onClick={() => void logout()}>
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Button variant="glass" onClick={() => setIsAuthOpen(true)}>
                {t("login")}
              </Button>
            )}

            <button
              type="button"
              className="navbar__burger"
              aria-label={t("menu")}
              onClick={() => setIsMobileOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="navbar__links navbar__links--mobile"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="navbar__link"
                onClick={() => setIsMobileOpen(false)}
              >
                {t(link.key)}
              </NavLink>
            ))}
            <NavLink to={ROUTES.profile} className="navbar__link" onClick={() => setIsMobileOpen(false)}>
              {t("links.profile")}
            </NavLink>
          </motion.nav>
        )}
      </motion.header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
