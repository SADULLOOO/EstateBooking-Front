import { useTranslation } from "react-i18next";

const RULE_KEYS = ["checkin", "cancellation", "order", "smoking"] as const;

export function PropertyHouseRules() {
  const { t } = useTranslation("housing");

  return (
    <section className="vehicle-detail-section">
      <h2>{t("houseRules.title")}</h2>
      <div className="rental-terms-grid">
        {RULE_KEYS.map((key) => (
          <div key={key} className="rental-terms-grid__item glass-surface">
            <h3>{t(`houseRules.${key}Title`)}</h3>
            <p>{t(`houseRules.${key}Text`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
