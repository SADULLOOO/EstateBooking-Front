import i18n from "@/i18n";
import { toIntlLocale } from "@/utils/intlLocale";

const CURRENCY = "RUB";

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const locale = toIntlLocale(i18n.language);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  const locale = toIntlLocale(i18n.language);
  return new Intl.NumberFormat(locale).format(value);
}
