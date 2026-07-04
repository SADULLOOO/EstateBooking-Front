import { motion } from "framer-motion";
import { formatTime } from "@/utils/formatDate";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <motion.div
      className={`message-bubble ${isOwn ? "message-bubble--own" : ""}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {!isOwn && <span className="message-bubble__sender">{message.sender_name}</span>}
      <p>{message.content}</p>
      <span className="message-bubble__time">{formatTime(message.created_at)}</span>
    </motion.div>
  );
}
