import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { chatApi } from "@/api/chat.api";
import { useAuth } from "@/app/providers/AuthProvider";
import { useWebSocketContext } from "@/app/providers/WebSocketProvider";
import { useChatSocket } from "@/hooks/useChatSocket";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { DateDivider } from "@/components/chat/DateDivider";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";
import type { ChatRoom, Message } from "@/types/chat";

const TYPING_IDLE_MS = 2000;

interface ChatWindowProps {
  room: ChatRoom;
  onBack: () => void;
}

export function ChatWindow({ room, onBack }: ChatWindowProps) {
  const { t } = useTranslation("chat");
  const { user } = useAuth();
  const { isUserOnline } = useWebSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [typingUserIds, setTypingUserIds] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const otherParticipant = room.participants.find((p) => p.id !== user?.id);

  const { sendMessage, sendTyping, status } = useChatSocket(room.id, (event) => {
    if (event.type === "chat_message") {
      setMessages((prev) => {
        if (prev.some((m) => m.id === event.id)) return prev;
        return [
          ...prev,
          {
            id: event.id,
            sender: event.sender,
            sender_name: event.sender_name,
            content: event.content,
            created_at: event.created_at,
          },
        ];
      });
      return;
    }

    if (event.type === "typing") {
      setTypingUserIds((prev) => {
        const next = new Set(prev);
        if (event.is_typing) next.add(event.sender);
        else next.delete(event.sender);
        return next;
      });
    }
  });

  useEffect(() => {
    setMessages([]);
    chatApi.roomMessages(room.id).then(({ data }) => setMessages(data));
  }, [room.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingUserIds]);

  const groups = useMemo(() => groupMessagesByDate(messages), [messages]);
  const isOtherTyping = otherParticipant ? typingUserIds.has(otherParticipant.id) : typingUserIds.size > 0;

  const handleChange = (value: string) => {
    setDraft(value);
    sendTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), TYPING_IDLE_MS);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    sendMessage(content);
    setDraft("");
    sendTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="chat-window glass-surface">
      <div className="chat-window__header">
        <button type="button" className="chat-window__back" onClick={onBack}>
          ←
        </button>
        <div>
          <strong>{room.participant_names.join(", ") || t("roomFallback", { id: room.id })}</strong>
          <span className="chat-window__status">
            {status !== "open"
              ? t("reconnecting")
              : isOtherTyping
                ? t("typing")
                : otherParticipant && isUserOnline(otherParticipant.id)
                  ? t("online")
                  : t("offline")}
          </span>
        </div>
      </div>

      <div className="chat-window__messages" ref={scrollRef}>
        {groups.map((group) => (
          <div key={group.dateLabel} className="chat-window__group">
            <DateDivider label={group.dateLabel} />
            <AnimatePresence initial={false}>
              {group.messages.map((message) => (
                <MessageBubble key={message.id} message={message} isOwn={message.sender === user?.id} />
              ))}
            </AnimatePresence>
          </div>
        ))}

        {isOtherTyping && (
          <motion.div className="typing-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span />
            <span />
            <span />
          </motion.div>
        )}
      </div>

      <form className="chat-window__input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("inputPlaceholder")}
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
        />
        <button type="submit" disabled={!draft.trim()}>
          {t("send")}
        </button>
      </form>
    </div>
  );
}
