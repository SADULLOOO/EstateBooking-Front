import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/AuthProvider";
import { useWebSocketContext } from "@/app/providers/WebSocketProvider";
import type { ChatRoom } from "@/types/chat";

interface ChatSidebarProps {
  rooms: ChatRoom[];
  activeRoomId: number | null;
  onSelectRoom: (room: ChatRoom) => void;
  unreadCountFor: (roomId: number) => number;
}

export function ChatSidebar({ rooms, activeRoomId, onSelectRoom, unreadCountFor }: ChatSidebarProps) {
  const { t } = useTranslation("chat");
  const { user } = useAuth();
  const { isUserOnline } = useWebSocketContext();

  return (
    <aside className={`chat-sidebar glass-surface ${activeRoomId ? "chat-sidebar--hidden-mobile" : ""}`}>
      <div className="chat-sidebar__header">
        <h2>{t("title")}</h2>
      </div>

      <div className="chat-sidebar__list">
        {rooms.length === 0 && <p className="vehicle-detail-section__text">{t("noDialogs")}</p>}

        {rooms.map((room, index) => {
          const otherParticipant = room.participants.find((p) => p.id !== user?.id);
          const online = otherParticipant ? isUserOnline(otherParticipant.id) : false;
          const unread = unreadCountFor(room.id);

          return (
            <motion.button
              key={room.id}
              type="button"
              className={`chat-sidebar__item ${activeRoomId === room.id ? "is-active" : ""}`}
              onClick={() => onSelectRoom(room)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
            >
              <div className="chat-sidebar__avatar">
                {(otherParticipant?.username ?? room.participant_names[0] ?? "?")[0]?.toUpperCase()}
                {online && <span className="chat-sidebar__online-dot" />}
              </div>

              <div className="chat-sidebar__item-body">
                <div className="chat-sidebar__item-top">
                  <strong>{room.participant_names.join(", ") || t("roomFallback", { id: room.id })}</strong>
                  {unread > 0 && <span className="chat-sidebar__unread">{unread}</span>}
                </div>
                <p>{room.last_message?.content ?? t("noMessages")}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
