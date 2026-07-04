import { useTranslation } from "react-i18next";
import { useNotifications } from "@/app/providers/NotificationProvider";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/Button";

export function AdminNotificationsPage() {
  const { t } = useTranslation(["admin", "notifications"]);
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <div>
          <h1>{t("admin:notifications.title")}</h1>
          <p>{t("admin:notifications.subtitle")}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="glass" onClick={() => void markAllRead()}>
            {t("admin:notifications.markAllRead", { count: unreadCount })}
          </Button>
        )}
      </div>

      <div className="notifications-page__list">
        {notifications.length === 0 ? (
          <p className="vehicle-detail-section__text">{t("notifications:empty")}</p>
        ) : (
          notifications.map((n, i) => <NotificationItem key={n.id} notification={n} index={i} />)
        )}
      </div>
    </section>
  );
}
