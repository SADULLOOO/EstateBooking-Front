import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWebSocketContext } from "@/app/providers/WebSocketProvider";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { NOTIFICATION_ICONS, useNotificationTypeLabel } from "@/components/notifications/notificationLabels";
import type { Notification } from "@/types/chat";

const TOAST_DURATION_MS = 5000;

interface ToastEntry extends Notification {
  toastId: number;
}

export function NotificationToastContainer() {
  const { subscribeToNotifications } = useWebSocketContext();
  const { toastsEnabled } = useNotificationPreferences();
  const typeLabel = useNotificationTypeLabel();
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  useEffect(() => {
    return subscribeToNotifications((notification) => {
      if (!toastsEnabled) return;
      const toastId = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...notification, toastId }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
      }, TOAST_DURATION_MS);
    });
  }, [subscribeToNotifications, toastsEnabled]);

  return (
    <div className="notification-toasts">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.toastId}
            className="notification-toast glass-surface"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <span className="notification-item__icon">{NOTIFICATION_ICONS[toast.notification_type]}</span>
            <div>
              <strong>{typeLabel(toast.notification_type)}</strong>
              <p>{toast.message_preview}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
