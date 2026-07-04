import { motion } from "framer-motion";
import { NOTIFICATION_ICONS, useNotificationTypeLabel, formatRelativeTime } from "@/components/notifications/notificationLabels";
import type { Notification } from "@/types/chat";

interface NotificationItemProps {
  notification: Notification;
  index?: number;
}

export function NotificationItem({ notification, index = 0 }: NotificationItemProps) {
  const typeLabel = useNotificationTypeLabel();

  return (
    <motion.div
      className={`notification-item ${notification.is_read ? "" : "notification-item--unread"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease: "easeOut" }}
    >
      <span className="notification-item__icon">{NOTIFICATION_ICONS[notification.notification_type]}</span>
      <div className="notification-item__body">
        <div className="notification-item__top">
          <span className="notification-item__type">{typeLabel(notification.notification_type)}</span>
          <span className="notification-item__time">{formatRelativeTime(notification.created_at)}</span>
        </div>
        <p>{notification.message_preview}</p>
      </div>
      {!notification.is_read && <span className="notification-item__dot" />}
    </motion.div>
  );
}
