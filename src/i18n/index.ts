import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

const STORAGE_KEY = "housingbook_locale";

export const SUPPORTED_LANGUAGES = ["ru", "en", "tg"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

void i18n
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES,
    lng: localStorage.getItem(STORAGE_KEY) ?? "ru",
    fallbackLng: "ru",
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
