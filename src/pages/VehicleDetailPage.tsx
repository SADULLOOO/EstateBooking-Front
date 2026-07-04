import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useVehicleDetail } from "@/hooks/useVehicleDetail";
import { useAuth } from "@/app/providers/AuthProvider";
import { chatApi } from "@/api/chat.api";
import { Button } from "@/components/ui/Button";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { VehicleSpecs } from "@/components/vehicles/VehicleSpecs";
import { VehicleReviews } from "@/components/vehicles/VehicleReviews";
import { SimilarVehicles } from "@/components/vehicles/SimilarVehicles";
import { RentalTerms } from "@/components/vehicles/RentalTerms";
import { BookingModal } from "@/components/vehicles/BookingModal";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/app/router/routes";

export function VehicleDetailPage() {
  const { t } = useTranslation(["vehicles", "common"]);
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { vehicle, reviews, averageRating, similarVehicles, isLoading, error } =
    useVehicleDetail(vehicleId);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleContact = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.home);
      return;
    }
    await chatApi.createRoom();
    navigate(ROUTES.chat);
  };

  if (isLoading) {
    return <section className="container vehicle-detail-page__status">{t("common:loading")}</section>;
  }

  if (error || !vehicle) {
    return (
      <section className="container vehicle-detail-page__status vehicle-detail-page__status--error">
        {error ?? t("vehicles:detail.notFound")}
      </section>
    );
  }

  const price = vehicle.price_per_day ?? vehicle.price_per_hour;

  return (
    <section className="container vehicle-detail-page">
      <div className="vehicle-detail-page__top">
        <VehicleGallery name={vehicle.name} photo={vehicle.photo} />

        <motion.div
          className="vehicle-detail-page__info"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          {vehicle.category && <span className="vehicle-card__category">{vehicle.category.name}</span>}
          <h1 className="vehicle-detail-page__title">{vehicle.name}</h1>

          {averageRating !== null && (
            <span className="vehicle-detail-page__rating">
              ★ {averageRating.toFixed(1)} ({t("vehicles:detail.reviewsCount", { count: reviews.length })})
            </span>
          )}

          <div className="vehicle-detail-page__price">
            <strong>{formatCurrency(price)}</strong>
            <span>{t("vehicles:card.perDay")}</span>
          </div>

          <div className="vehicle-detail-page__quick-specs">
            <span>{t("vehicles:card.seats", { count: vehicle.capacity })}</span>
            <span>{vehicle.plate_number}</span>
            <span>
              {vehicle.booking_status === "available"
                ? t("vehicles:status.availableNow")
                : t("vehicles:status.booked")}
            </span>
          </div>

          <div className="vehicle-detail-page__actions">
            <Button
              variant="primary"
              disabled={vehicle.booking_status !== "available"}
              onClick={() => setIsBookingOpen(true)}
            >
              {t("vehicles:detail.book")}
            </Button>
            <Button variant="glass" onClick={() => void handleContact()}>
              {t("vehicles:detail.contact")}
            </Button>
          </div>
        </motion.div>
      </div>

      <VehicleSpecs vehicle={vehicle} />
      <RentalTerms />
      <VehicleReviews reviews={reviews} averageRating={averageRating} />
      <SimilarVehicles vehicles={similarVehicles} />

      <BookingModal vehicle={isBookingOpen ? vehicle : null} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
}
