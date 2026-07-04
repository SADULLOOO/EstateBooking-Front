import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/utils/formatDate";
import type { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  index: number;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}

export function BookingCard({ booking, index, onCancel, isCancelling }: BookingCardProps) {
  const { t } = useTranslation(["bookings", "common"]);

  return (
    <motion.article
      className="vehicle-card glass-surface booking-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: (index % 8) * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <div className="vehicle-card__body">
        <div className="vehicle-card__top-row">
          <span className="vehicle-card__category">
            {booking.booked_object_type === "room" ? t("bookings:objectType.room") : t("bookings:objectType.vehicle")}
          </span>
          <span className={`booking-card__status booking-card__status--${booking.status}`}>
            {t(`common:status.${booking.status}`)}
          </span>
        </div>

        <h3 className="vehicle-card__title">{booking.booked_object_repr}</h3>

        <div className="booking-card__dates">
          <div>
            <span>{t("bookings:card.start")}</span>
            <strong>{formatDateTime(booking.start_time)}</strong>
          </div>
          <div>
            <span>{t("bookings:card.end")}</span>
            <strong>{formatDateTime(booking.end_time)}</strong>
          </div>
        </div>

        {booking.status === "active" && (
          <Button variant="glass" disabled={isCancelling} onClick={() => onCancel(booking.id)}>
            {isCancelling ? t("bookings:card.cancelling") : t("bookings:card.cancel")}
          </Button>
        )}
      </div>
    </motion.article>
  );
}
