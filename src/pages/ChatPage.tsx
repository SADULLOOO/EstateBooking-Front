import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useNotifications } from "@/app/providers/NotificationProvider";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { ChatRoom } from "@/types/chat";

export function ChatPage() {
  const { t } = useTranslation(["chat", "common"]);
  const { rooms, isLoading, error, unreadCountFor } = useChatRooms();
  const { markAllRead } = useNotifications();
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);

  const handleSelectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    if (unreadCountFor(room.id) > 0) {
      void markAllRead();
    }
  };

  if (isLoading) {
    return <section className="container vehicle-detail-page__status">{t("common:loading")}</section>;
  }

  if (error) {
    return (
      <section className="container vehicle-detail-page__status vehicle-detail-page__status--error">
        {error}
      </section>
    );
  }

  return (
    <section className="container chat-page">
      <div className="chat-page__layout">
        <ChatSidebar
          rooms={rooms}
          activeRoomId={activeRoom?.id ?? null}
          onSelectRoom={handleSelectRoom}
          unreadCountFor={unreadCountFor}
        />

        {activeRoom ? (
          <ChatWindow room={activeRoom} onBack={() => setActiveRoom(null)} />
        ) : (
          <div className="chat-window glass-surface chat-window--empty">
            <p>{t("chat:selectDialog")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
