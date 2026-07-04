import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/app/providers/NotificationProvider";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export function NotificationBell() {
  const { t } = useTranslation("notifications");
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-bell">
      <button
        type="button"
        className="notification-bell__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("ariaLabel")}
      >
        🔔
        {unreadCount > 0 && <span className="notification-bell__badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
