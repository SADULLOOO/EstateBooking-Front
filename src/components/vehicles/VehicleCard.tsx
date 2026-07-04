import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import type { Vehicle } from "@/types/booking";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
  index: number;
}

export function VehicleCard({ vehicle, onViewDetails, index }: VehicleCardProps) {
  const { t } = useTranslation(["vehicles", "common"]);
  const price = vehicle.price_per_day ?? vehicle.price_per_hour;
  const photoUrl = vehicle.photo ? resolveMediaUrl(vehicle.photo) : null;

  return (
    <motion.article
      className="vehicle-card glass-surface"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <div className="vehicle-card__media">
        {photoUrl ? (
          <img src={photoUrl} alt={vehicle.name} loading="lazy" />
        ) : (
          <div className="vehicle-card__media-fallback" aria-hidden="true" />
        )}
        <span className={`vehicle-card__status vehicle-card__status--${vehicle.booking_status}`}>
          {vehicle.booking_status === "available" ? t("vehicles:status.available") : t("vehicles:status.booked")}
        </span>
      </div>

      <div className="vehicle-card__body">
        <div className="vehicle-card__top-row">
          {vehicle.category && <span className="vehicle-card__category">{vehicle.category.name}</span>}
          {vehicle.average_rating !== null && (
            <span className="vehicle-card__rating">
              ★ {vehicle.average_rating.toFixed(1)} ({vehicle.reviews_count})
            </span>
          )}
        </div>
        <h3 className="vehicle-card__title">
          {vehicle.brand ? `${vehicle.brand} ${vehicle.name}` : vehicle.name}
        </h3>

        <div className="vehicle-card__specs">
          <span>{t("vehicles:card.seats", { count: vehicle.capacity })}</span>
          <span>{vehicle.plate_number}</span>
          {vehicle.location && <span>{vehicle.location}</span>}
        </div>

        <div className="vehicle-card__footer">
          <div className="vehicle-card__price">
            <strong>{formatCurrency(price)}</strong>
            <span>{t("vehicles:card.perDay")}</span>
          </div>
          <Button variant="glass" onClick={() => onViewDetails(vehicle)}>
            {t("common:actions.viewDetails")}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
