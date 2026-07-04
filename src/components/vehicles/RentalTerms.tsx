import { useTranslation } from "react-i18next";

const TERM_KEYS = ["driverAge", "deposit", "fuel", "cancellation"] as const;

export function RentalTerms() {
  const { t } = useTranslation("vehicles");

  return (
    <section className="vehicle-detail-section">
      <h2>{t("rentalTerms.title")}</h2>
      <div className="rental-terms-grid">
        {TERM_KEYS.map((key) => (
          <div key={key} className="rental-terms-grid__item glass-surface">
            <h3>{t(`rentalTerms.${key}Title`)}</h3>
            <p>{t(`rentalTerms.${key}Text`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
