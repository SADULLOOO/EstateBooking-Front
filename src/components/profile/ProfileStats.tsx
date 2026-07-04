import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ProfileStatsProps {
  bookingsCount: number;
  activeBookingsCount: number;
  completedBookingsCount: number;
  cancelledBookingsCount: number;
  reviewsCount: number;
}

export function ProfileStats({
  bookingsCount,
  activeBookingsCount,
  completedBookingsCount,
  cancelledBookingsCount,
  reviewsCount,
}: ProfileStatsProps) {
  const { t } = useTranslation("profile");

  const items = [
    { label: t("stats.total"), value: bookingsCount },
    { label: t("stats.active"), value: activeBookingsCount },
    { label: t("stats.completed"), value: completedBookingsCount },
    { label: t("stats.cancelled"), value: cancelledBookingsCount },
    { label: t("stats.reviews"), value: reviewsCount },
  ];

  return (
    <section className="vehicle-detail-section">
      <h2>{t("stats.title")}</h2>
      <div className="vehicle-specs-grid">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            className="vehicle-specs-grid__item glass-surface"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
          >
            <span className="vehicle-specs-grid__value profile-stats__value">{item.value}</span>
            <span className="vehicle-specs-grid__label">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
