import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "tg", label: "ТҶ" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`lang-switcher__item ${i18n.language === lang.code ? "is-active" : ""}`}
          onClick={() => void i18n.changeLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
