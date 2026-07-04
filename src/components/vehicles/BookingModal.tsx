import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { bookingsApi } from "@/api/bookings.api";
import { Button } from "@/components/ui/Button";
import { estimateVehiclePrice } from "@/utils/bookingPrice";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Vehicle } from "@/types/booking";

interface BookingModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function BookingModal({ vehicle, onClose }: BookingModalProps) {
  const { t } = useTranslation("bookings");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    setStatus("loading");
    setErrorMessage(null);
    try {
      await bookingsApi.create({
        object_type: "vehicle",
        object_id: vehicle.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });
      setStatus("success");
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        t("modal.defaultError");
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  const estimate = vehicle ? estimateVehiclePrice(vehicle, startTime, endTime) : null;

  return (
    <AnimatePresence>
      {vehicle && (
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
            <h3 className="auth-modal__title">{t("modal.title", { name: vehicle.name })}</h3>

            {status === "success" ? (
              <p className="auth-modal__success">{t("modal.success")}</p>
            ) : (
              <form onSubmit={handleSubmit} className="auth-modal__form">
                <label className="auth-modal__label">
                  {t("modal.start")}
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </label>
                <label className="auth-modal__label">
                  {t("modal.end")}
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </label>

                {estimate && (
                  <div className="booking-modal__estimate">
                    <span>{t(`estimate.${estimate.unit}`, { count: estimate.unitCount })}</span>
                    <strong>{formatCurrency(estimate.amount)}</strong>
                  </div>
                )}

                {errorMessage && <p className="auth-modal__error">{errorMessage}</p>}

                <Button type="submit" disabled={status === "loading"} className={status === "loading" ? "is-loading" : ""}>
                  {status === "loading" ? t("modal.submitting") : t("modal.submit")}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
