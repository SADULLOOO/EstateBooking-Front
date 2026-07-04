const LOCALE_MAP: Record<string, string> = {
  ru: "ru-RU",
  en: "en-US",
  tg: "tg-TJ",
};

export function toIntlLocale(language: string): string {
  return LOCALE_MAP[language] ?? "ru-RU";
}
