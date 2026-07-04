export interface Message {
  id: number;
  sender: number;
  sender_name: string;
  content: string;
  created_at: string;
}

export interface ChatParticipant {
  id: number;
  username: string;
}

export interface ChatRoom {
  id: number;
  participants: ChatParticipant[];
  participant_names: string[];
  last_message: Message | null;
  created_at: string;
}

export type NotificationType = "message" | "booking_created" | "booking_cancelled";

export interface Notification {
  id: number;
  recipient: number;
  sender: number | null;
  sender_name: string | null;
  notification_type: NotificationType;
  message_preview: string;
  chat_room_id: number | null;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessageEvent {
  type: "chat_message";
  id: number;
  sender: number;
  sender_name: string;
  content: string;
  created_at: string;
}

export interface TypingEvent {
  type: "typing";
  sender: number;
  sender_name: string;
  is_typing: boolean;
}

export type ChatSocketEvent = ChatMessageEvent | TypingEvent;

export interface PresenceSnapshotEvent {
  type: "presence_snapshot";
  online_user_ids: number[];
}

export interface PresenceChangeEvent {
  type: "presence_change";
  user_id: number;
  is_online: boolean;
}
