import { useTranslation } from "react-i18next";
import { useNotifications } from "@/app/providers/NotificationProvider";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/Button";

export function NotificationsPage() {
  const { t } = useTranslation("notifications");
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <section className="container notifications-page">
      <div className="vehicles-page__header notifications-page__header">
        <div>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="glass" onClick={() => void markAllRead()}>
            {t("markAllReadCount", { count: unreadCount })}
          </Button>
        )}
      </div>

      <div className="notifications-page__list">
        {notifications.length === 0 ? (
          <p className="vehicle-detail-section__text">{t("empty")}</p>
        ) : (
          notifications.map((n, i) => <NotificationItem key={n.id} notification={n} index={i} />)
        )}
      </div>
    </section>
  );
}
