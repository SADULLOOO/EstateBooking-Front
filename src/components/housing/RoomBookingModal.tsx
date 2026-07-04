import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { bookingsApi } from "@/api/bookings.api";
import { Button } from "@/components/ui/Button";
import { estimateRoomPrice } from "@/utils/bookingPrice";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Building, Room } from "@/types/booking";

interface RoomBookingModalProps {
  building: Building | null;
  onClose: () => void;
}

export function RoomBookingModal({ building, onClose }: RoomBookingModalProps) {
  const { t } = useTranslation(["bookings", "housing"]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableRooms = building?.rooms.filter((r) => r.booking_status === "available") ?? [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;

    setStatus("loading");
    setErrorMessage(null);
    try {
      await bookingsApi.create({
        object_type: "room",
        object_id: selectedRoomId,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });
      setStatus("success");
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        t("bookings:modal.defaultError");
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setSelectedRoomId(null);
    setStartTime("");
    setEndTime("");
    onClose();
  };

  const selectedRoom = availableRooms.find((r) => r.id === selectedRoomId) ?? null;
  const estimate = selectedRoom ? estimateRoomPrice(selectedRoom, startTime, endTime) : null;

  return (
    <AnimatePresence>
      {building && (
        <motion.div
          className="auth-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="auth-modal glass-surface"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="auth-modal__title">{t("bookings:modal.title", { name: building.name })}</h3>

            {status === "success" ? (
              <p className="auth-modal__success">{t("bookings:modal.success")}</p>
            ) : availableRooms.length === 0 ? (
              <p className="auth-modal__error">{t("bookings:modal.noRoomsAvailable")}</p>
            ) : (
              <form onSubmit={handleSubmit} className="auth-modal__form">
                <label className="auth-modal__label">
                  {t("bookings:modal.room")}
                  <select
                    value={selectedRoomId ?? ""}
                    onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                    required
                  >
                    <option value="" disabled>
                      {t("bookings:modal.chooseRoom")}
                    </option>
                    {availableRooms.map((room: Room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} · {t("housing:card.seats", { count: room.capacity })}
                        {room.price_per_night
                          ? ` · ${formatCurrency(room.price_per_night)}${t("housing:card.perNight")}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="auth-modal__label">
                  {t("bookings:modal.start")}
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </label>
                <label className="auth-modal__label">
                  {t("bookings:modal.end")}
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </label>

                {estimate && (
                  <div className="booking-modal__estimate">
                    <span>{t(`bookings:estimate.${estimate.unit}`, { count: estimate.unitCount })}</span>
                    <strong>{formatCurrency(estimate.amount)}</strong>
                  </div>
                )}

                {errorMessage && <p className="auth-modal__error">{errorMessage}</p>}

                <Button type="submit" disabled={status === "loading"} className={status === "loading" ? "is-loading" : ""}>
                  {status === "loading" ? t("bookings:modal.submitting") : t("bookings:modal.submit")}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
