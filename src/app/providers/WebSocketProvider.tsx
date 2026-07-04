import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { WS_BASE_URL } from "@/config/env";
import { tokenStorage } from "@/api/tokenStorage";
import { useAuth } from "@/app/providers/AuthProvider";
import type { Notification, PresenceChangeEvent, PresenceSnapshotEvent } from "@/types/chat";

type NotificationListener = (notification: Notification) => void;

interface WebSocketContextValue {
  subscribeToNotifications: (listener: NotificationListener) => () => void;
  onlineUserIds: Set<number>;
  isUserOnline: (userId: number) => boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

const MAX_RECONNECT_DELAY_MS = 10_000;

type IncomingMessage = Notification | PresenceSnapshotEvent | PresenceChangeEvent;

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const listenersRef = useRef(new Set<NotificationListener>());
  const socketRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedByCleanupRef = useRef(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      closedByCleanupRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
      socketRef.current = null;
      setOnlineUserIds(new Set());
      return;
    }

    closedByCleanupRef.current = false;
    attemptRef.current = 0;

    const connect = () => {
      const token = tokenStorage.getAccess();
      const socket = new WebSocket(`${WS_BASE_URL}/ws/notifications/?token=${token}`);
      socketRef.current = socket;

      socket.onopen = () => {
        attemptRef.current = 0;
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as IncomingMessage;

        if ("type" in data && data.type === "presence_snapshot") {
          setOnlineUserIds(new Set(data.online_user_ids));
          return;
        }

        if ("type" in data && data.type === "presence_change") {
          setOnlineUserIds((prev) => {
            const next = new Set(prev);
            if (data.is_online) next.add(data.user_id);
            else next.delete(data.user_id);
            return next;
          });
          return;
        }

        listenersRef.current.forEach((listener) => listener(data as Notification));
      };

      socket.onclose = () => {
        if (closedByCleanupRef.current) return;
        const delay = Math.min(1000 * 2 ** attemptRef.current, MAX_RECONNECT_DELAY_MS);
        attemptRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      closedByCleanupRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  const value = useMemo<WebSocketContextValue>(
    () => ({
      subscribeToNotifications: (listener) => {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
      },
      onlineUserIds,
      isUserOnline: (userId) => onlineUserIds.has(userId),
    }),
    [onlineUserIds],
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useWebSocketContext(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocketContext must be used within WebSocketProvider");
  return ctx;
}
