import { useEffect, useRef, useState } from "react";
import { WS_BASE_URL } from "@/config/env";
import { tokenStorage } from "@/api/tokenStorage";
import type { ChatSocketEvent } from "@/types/chat";

export type ChatSocketStatus = "connecting" | "open" | "closed" | "error";

const MAX_RECONNECT_DELAY_MS = 10_000;

export function useChatSocket(roomId: number | null, onMessage: (event: ChatSocketEvent) => void) {
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const attemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedByCleanupRef = useRef(false);
  const [status, setStatus] = useState<ChatSocketStatus>("connecting");

  onMessageRef.current = onMessage;

  useEffect(() => {
    if (roomId === null) return;

    closedByCleanupRef.current = false;
    attemptRef.current = 0;

    const connect = () => {
      setStatus("connecting");
      const token = tokenStorage.getAccess();
      const socket = new WebSocket(`${WS_BASE_URL}/ws/chat/${roomId}/?token=${token}`);
      const previous = socketRef.current;
      socketRef.current = socket;
      // A previous socket can still be mid-close (async) when a reconnect fires;
      // without this it keeps delivering the same broadcast, duplicating messages.
      if (previous) {
        previous.onmessage = null;
        previous.onclose = null;
        previous.onerror = null;
        previous.close();
      }

      socket.onopen = () => {
        if (socketRef.current !== socket) return;
        attemptRef.current = 0;
        setStatus("open");
      };

      socket.onmessage = (event) => {
        if (socketRef.current !== socket) return;
        onMessageRef.current(JSON.parse(event.data) as ChatSocketEvent);
      };

      socket.onerror = () => {
        if (socketRef.current !== socket) return;
        setStatus("error");
      };

      socket.onclose = () => {
        if (socketRef.current !== socket || closedByCleanupRef.current) return;
        setStatus("closed");
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
  }, [roomId]);

  const sendMessage = (content: string) => {
    socketRef.current?.send(JSON.stringify({ content }));
  };

  const sendTyping = (isTyping: boolean) => {
    socketRef.current?.send(JSON.stringify({ type: "typing", is_typing: isTyping }));
  };

  return { sendMessage, sendTyping, status };
}
