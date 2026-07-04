import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { chatApi } from "@/api/chat.api";
import { useAuth } from "@/app/providers/AuthProvider";
import { useWebSocketContext } from "@/app/providers/WebSocketProvider";
import type { Notification } from "@/types/chat";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { subscribeToNotifications } = useWebSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    chatApi.listNotifications().then(({ data }) => setNotifications(data));
  }, [isAuthenticated]);

  useEffect(() => {
    return subscribeToNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
  }, [subscribeToNotifications]);

  const markAllRead = async () => {
    await chatApi.markNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
      markAllRead,
    }),
    [notifications],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
