import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/AuthProvider";
import { aiApi } from "@/api/ai.api";
import { RobotIcon } from "@/components/ai/RobotIcon";

interface ConsultantMessage {
  id: number;
  role: "bot" | "user";
  text: string;
}

const IDLE_LOOP_INTERVAL = 6000;
// A closed loop (starts and ends at 0,0) tracing a circle of radius 26,
// centered above the resting spot — the drone pops up, circles once, docks.
const ORBIT_X = [0, 13, 22.5, 26, 22.5, 13, 0, -13, -22.5, -26, -22.5, -13, 0];
const ORBIT_Y = [0, -3.5, -13, -26, -39, -48.5, -52, -48.5, -39, -26, -13, -3.5, 0];

export function AIConsultantWidget() {
  const { t } = useTranslation("aiConsultant");
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ConsultantMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const nextId = useRef(1);
  const spinControls = useAnimationControls();

  const displayName = user?.first_name || user?.username || "";

  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      void spinControls
        .start({ x: ORBIT_X, y: ORBIT_Y, transition: { duration: 1.8, ease: "easeInOut" } })
        .then(() => {
          spinControls.set({ x: 0, y: 0 });
        });
    }, IDLE_LOOP_INTERVAL);
    return () => clearInterval(interval);
  }, [isOpen, spinControls]);

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          id: nextId.current++,
          role: "bot",
          text: displayName ? t("greeting", { name: displayName }) : t("greetingGuest"),
        },
      ]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const query = draft.trim();
    if (!query || isSending) return;

    setMessages((prev) => [...prev, { id: nextId.current++, role: "user", text: query }]);
    setDraft("");

    if (!isAuthenticated) {
      setMessages((prev) => [...prev, { id: nextId.current++, role: "bot", text: t("loginRequired") }]);
      return;
    }

    setIsSending(true);
    try {
      const { data } = await aiApi.ask(query);
      setMessages((prev) => [...prev, { id: nextId.current++, role: "bot", text: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { id: nextId.current++, role: "bot", text: t("error") }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="ai-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-widget__panel glass-surface"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="ai-widget__header">
              <span className="ai-widget__avatar" aria-hidden="true">
                🤖
              </span>
              <div className="ai-widget__heading">
                <strong>{t("title")}</strong>
                <span className="ai-widget__status">
                  <i className="ai-widget__status-dot" /> {t("status")}
                </span>
              </div>
              <button type="button" className="ai-widget__close" onClick={() => setIsOpen(false)} aria-label={t("openLabel")}>
                ✕
              </button>
            </div>

            <div className="ai-widget__messages chat-window__messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${message.role === "user" ? "message-bubble--own" : ""}`}
                >
                  <p>{message.text}</p>
                </div>
              ))}
              {isSending && (
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            <form className="chat-window__input" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={t("placeholder")}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="submit" disabled={!draft.trim() || isSending}>
                {t("send")}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="ai-widget__trigger glass-surface"
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        aria-label={t("openLabel")}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <motion.span animate={spinControls} className="ai-widget__trigger-icon">
          <RobotIcon size={34} />
        </motion.span>
      </motion.button>
    </div>
  );
}
