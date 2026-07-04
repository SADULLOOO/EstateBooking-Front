import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ChatRoom, Message, Notification } from "@/types/chat";

export const chatApi = {
  listRooms: () => apiClient.get<ChatRoom[]>(ENDPOINTS.chat.rooms),
  createRoom: () => apiClient.post<ChatRoom>(ENDPOINTS.chat.rooms),
  roomMessages: (roomId: number) => apiClient.get<Message[]>(ENDPOINTS.chat.messages(roomId)),

  listNotifications: () => apiClient.get<Notification[]>(ENDPOINTS.chat.notifications),
  markNotificationsRead: () =>
    apiClient.post<{ status: string }>(ENDPOINTS.chat.notificationsMarkRead),
};
