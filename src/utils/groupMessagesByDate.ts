import i18n from "@/i18n";
import { formatDate } from "@/utils/formatDate";
import type { Message } from "@/types/chat";

export interface MessageGroup {
  dateLabel: string;
  messages: Message[];
}

function dateLabelFor(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return i18n.t("chat:dateToday");
  if (isSameDay(date, yesterday)) return i18n.t("chat:dateYesterday");
  return formatDate(date);
}

export function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  messages.forEach((message) => {
    const label = dateLabelFor(message.created_at);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.dateLabel === label) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ dateLabel: label, messages: [message] });
    }
  });

  return groups;
}
