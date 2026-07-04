import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import { ROUTES } from "@/app/router/routes";
import type { Building } from "@/types/booking";

interface PropertyDetailModalProps {
  building: Building | null;
  onClose: () => void;
}

export function PropertyDetailModal({ building, onClose }: PropertyDetailModalProps) {
  const { t } = useTranslation(["housing", "common"]);
  const navigate = useNavigate();
  const imageUrl = building?.cover_image ? resolveMediaUrl(building.cover_image) : null;

  const handleOpenFullPage = () => {
    if (!building) return;
    onClose();
    navigate(ROUTES.propertyDetail(building.id));
  };

  return (
    <AnimatePresence>
      {building && (
        <motion.div
          className="auth-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="vehicle-detail-modal glass-surface"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="detail-modal__close" onClick={onClose} aria-label={t("common:actions.close")}>
              ✕
            </button>

            {imageUrl ? (
              <img src={imageUrl} alt={building.name} className="vehicle-detail-modal__image" />
            ) : (
              <div className="vehicle-card__media-fallback vehicle-detail-modal__image" aria-hidden="true" />
            )}

            <div className="vehicle-detail-modal__body">
              <span className="vehicle-card__category">{building.city}</span>
              <h2>{building.name}</h2>
              <p className="vehicle-detail-modal__description">{building.address}</p>
              {building.description && (
                <p className="vehicle-detail-modal__description">{building.description}</p>
              )}

              <h3 className="property-detail-modal__rooms-title">
                {t("card.rooms", { count: building.rooms_count })}
              </h3>
              <div className="property-detail-modal__rooms">
                {building.rooms.map((room) => (
                  <div key={room.id} className="property-detail-modal__room">
                    <span>{room.name}</span>
                    <span>{t("card.seats", { count: room.capacity })}</span>
                    <span>
                      {room.price_per_night
                        ? `${formatCurrency(room.price_per_night)}${t("card.perNight")}`
                        : t("card.priceUnknown")}
                    </span>
                    <span>{room.booking_status === "available" ? t("status.roomAvailable") : t("status.roomBooked")}</span>
                  </div>
                ))}
              </div>

              <Button variant="primary" className="property-detail-modal__open-full" onClick={handleOpenFullPage}>
                {t("housing:gallery.openFullPage")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
