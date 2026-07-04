import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import type { NotificationType } from "@/types/chat";

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  message: "💬",
  booking_created: "📅",
  booking_cancelled: "❌",
};

export function useNotificationTypeLabel() {
  const { t } = useTranslation("notifications");
  return (type: NotificationType) => t(`types.${type}`);
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return i18n.t("notifications:relativeTime.justNow");
  if (minutes < 60) return i18n.t("notifications:relativeTime.minutesAgo", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return i18n.t("notifications:relativeTime.hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return i18n.t("notifications:relativeTime.daysAgo", { count: days });
}
