import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useTransmissionLabel } from "@/components/vehicles/vehicleLabels";
import { formatCurrency } from "@/utils/formatCurrency";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import { ROUTES } from "@/app/router/routes";
import type { Vehicle } from "@/types/booking";

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function VehicleDetailModal({ vehicle, onClose }: VehicleDetailModalProps) {
  const { t } = useTranslation(["vehicles", "common"]);
  const navigate = useNavigate();
  const transmissionLabel = useTransmissionLabel();
  const photoUrl = vehicle?.photo ? resolveMediaUrl(vehicle.photo) : null;

  const handleOpenFullPage = () => {
    if (!vehicle) return;
    onClose();
    navigate(ROUTES.vehicleDetail(vehicle.id));
  };

  return (
    <AnimatePresence>
      {vehicle && (
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

            {photoUrl ? (
              <img src={photoUrl} alt={vehicle.name} className="vehicle-detail-modal__image" />
            ) : (
              <div className="vehicle-card__media-fallback vehicle-detail-modal__image" aria-hidden="true" />
            )}

            <div className="vehicle-detail-modal__body">
              <div className="vehicle-card__top-row">
                {vehicle.category && <span className="vehicle-card__category">{vehicle.category.name}</span>}
                {vehicle.average_rating !== null && (
                  <span className="vehicle-card__rating">
                    ★ {vehicle.average_rating.toFixed(1)} ({vehicle.reviews_count})
                  </span>
                )}
              </div>
              <h2>{vehicle.brand ? `${vehicle.brand} ${vehicle.name}` : vehicle.name}</h2>

              <dl className="vehicle-detail-modal__specs">
                <div>
                  <dt>{t("specs.capacity")}</dt>
                  <dd>{t("card.seats", { count: vehicle.capacity })}</dd>
                </div>
                <div>
                  <dt>{t("specs.plateNumber")}</dt>
                  <dd>{vehicle.plate_number}</dd>
                </div>
                {vehicle.transmission && (
                  <div>
                    <dt>{t("specs.transmission")}</dt>
                    <dd>{transmissionLabel(vehicle.transmission as Exclude<typeof vehicle.transmission, "">)}</dd>
                  </div>
                )}
                {vehicle.location && (
                  <div>
                    <dt>{t("specs.location")}</dt>
                    <dd>{vehicle.location}</dd>
                  </div>
                )}
                <div>
                  <dt>{t("specs.pricePerHour")}</dt>
                  <dd>{formatCurrency(vehicle.price_per_hour)}</dd>
                </div>
                {vehicle.price_per_day && (
                  <div>
                    <dt>{t("specs.pricePerDay")}</dt>
                    <dd>{formatCurrency(vehicle.price_per_day)}</dd>
                  </div>
                )}
                <div>
                  <dt>{t("specs.status")}</dt>
                  <dd>{vehicle.booking_status === "available" ? t("status.available") : t("status.booked")}</dd>
                </div>
              </dl>

              {vehicle.category?.description && <p className="vehicle-detail-modal__description">{vehicle.category.description}</p>}

              <Button variant="primary" className="property-detail-modal__open-full" onClick={handleOpenFullPage}>
                {t("vehicles:detail.openFullPage")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
