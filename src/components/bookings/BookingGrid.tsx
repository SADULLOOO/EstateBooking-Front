import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookingCard } from "@/components/bookings/BookingCard";
import type { Booking } from "@/types/booking";

interface BookingGridProps {
  bookings: Booking[];
  onCancel: (id: number) => void;
  cancellingId: number | null;
}

export function BookingGrid({ bookings, onCancel, cancellingId }: BookingGridProps) {
  const { t } = useTranslation("bookings");

  if (bookings.length === 0) {
    return <p className="vehicle-grid__empty">{t("grid.empty")}</p>;
  }

  return (
    <div className="vehicle-grid">
      <AnimatePresence>
        {bookings.map((booking, index) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            index={index}
            onCancel={onCancel}
            isCancelling={cancellingId === booking.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
