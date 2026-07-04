import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { minRoomPrice } from "@/hooks/useHousingCatalog";
import { formatCurrency } from "@/utils/formatCurrency";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import type { Building } from "@/types/booking";

interface PropertyCardProps {
  building: Building;
  onViewDetails: (building: Building) => void;
  index: number;
}

export function PropertyCard({ building, onViewDetails, index }: PropertyCardProps) {
  const { t } = useTranslation(["housing", "common"]);
  const price = minRoomPrice(building);
  const imageUrl = building.cover_image ? resolveMediaUrl(building.cover_image) : null;

  return (
    <motion.article
      className="vehicle-card vehicle-card--property glass-surface"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <div className="vehicle-card__media">
        {imageUrl ? (
          <img src={imageUrl} alt={building.name} loading="lazy" />
        ) : (
          <div className="vehicle-card__media-fallback" aria-hidden="true" />
        )}
        <span className="vehicle-card__status vehicle-card__status--available">
          {t("housing:card.rooms", { count: building.rooms_count })}
        </span>
      </div>

      <div className="vehicle-card__body">
        <span className="vehicle-card__category">{building.city}</span>
        <h3 className="vehicle-card__title">{building.name}</h3>

        <div className="vehicle-card__specs">
          <span>{building.address}</span>
        </div>

        {building.description && <p className="property-card__description">{building.description}</p>}

        <div className="vehicle-card__footer">
          <div className="vehicle-card__price">
            {price !== null ? (
              <>
                <strong>{t("housing:card.fromPrice", { price: formatCurrency(price) })}</strong>
                <span>{t("housing:card.perNight")}</span>
              </>
            ) : (
              <span>{t("housing:card.priceUnknown")}</span>
            )}
          </div>
          <Button variant="glass" onClick={() => onViewDetails(building)}>
            {t("common:actions.viewDetails")}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
