import { useEffect, useState } from "react";
import { chatApi } from "@/api/chat.api";
import { useNotifications } from "@/app/providers/NotificationProvider";
import i18n from "@/i18n";
import type { ChatRoom } from "@/types/chat";

export function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notifications } = useNotifications();

  const load = () => {
    setIsLoading(true);
    chatApi
      .listRooms()
      .then(({ data }) => setRooms(data))
      .catch(() => setError(i18n.t("chat:loadError")))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCountFor = (roomId: number) =>
    notifications.filter((n) => n.chat_room_id === roomId && !n.is_read).length;

  return { rooms, isLoading, error, unreadCountFor, reload: load };
}
