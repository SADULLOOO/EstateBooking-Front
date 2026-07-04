import i18n from "@/i18n";
import { toIntlLocale } from "@/utils/intlLocale";

export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const locale = toIntlLocale(i18n.language);
  return new Intl.DateTimeFormat(
    locale,
    options ?? { day: "2-digit", month: "long", year: "numeric" },
  ).format(date);
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(value: string | Date): string {
  return formatDate(value, { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatTime(value: string | Date): string {
  return formatDate(value, { hour: "2-digit", minute: "2-digit" });
}
