import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/app/providers/NotificationProvider";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { ROUTES } from "@/app/router/routes";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { t } = useTranslation("notifications");
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const recent = notifications.slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="notification-dropdown__backdrop" onClick={onClose} />
          <motion.div
            className="notification-dropdown glass-surface"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="notification-dropdown__header">
              <h3>{t("title")}</h3>
              {unreadCount > 0 && (
                <button type="button" onClick={() => void markAllRead()}>
                  {t("markAllRead")}
                </button>
              )}
            </div>

            <div className="notification-dropdown__list">
              {recent.length === 0 ? (
                <p className="vehicle-detail-section__text">{t("empty")}</p>
              ) : (
                recent.map((n, i) => <NotificationItem key={n.id} notification={n} index={i} />)
              )}
            </div>

            <Link to={ROUTES.notifications} className="notification-dropdown__footer" onClick={onClose}>
              {t("viewAll")}
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
