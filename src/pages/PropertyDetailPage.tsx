import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePropertyDetail } from "@/hooks/usePropertyDetail";
import { useAuth } from "@/app/providers/AuthProvider";
import { chatApi } from "@/api/chat.api";
import { Button } from "@/components/ui/Button";
import { PropertyGallery } from "@/components/housing/PropertyGallery";
import { PropertyAmenities } from "@/components/housing/PropertyAmenities";
import { PropertyHouseRules } from "@/components/housing/PropertyHouseRules";
import { PropertyReviews } from "@/components/housing/PropertyReviews";
import { SimilarProperties } from "@/components/housing/SimilarProperties";
import { PropertyOwnerInfo } from "@/components/housing/PropertyOwnerInfo";
import { RoomBookingModal } from "@/components/housing/RoomBookingModal";
import { minRoomPrice } from "@/hooks/useHousingCatalog";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/app/router/routes";

export function PropertyDetailPage() {
  const { t } = useTranslation(["housing", "common"]);
  const { id } = useParams<{ id: string }>();
  const buildingId = Number(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { building, reviews, averageRating, totalCapacity, similarBuildings, isLoading, error } =
    usePropertyDetail(buildingId);

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

  if (error || !building) {
    return (
      <section className="container vehicle-detail-page__status vehicle-detail-page__status--error">
        {error ?? t("housing:detail.notFound")}
      </section>
    );
  }

  const price = minRoomPrice(building);
  const hasAvailableRoom = building.rooms.some((r) => r.booking_status === "available");

  return (
    <section className="container vehicle-detail-page">
      <div className="vehicle-detail-page__top">
        <PropertyGallery building={building} />

        <motion.div
          className="vehicle-detail-page__info"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <span className="vehicle-card__category">{building.city}</span>
          <h1 className="vehicle-detail-page__title">{building.name}</h1>

          {averageRating !== null && (
            <span className="vehicle-detail-page__rating">
              ★ {averageRating.toFixed(1)} ({t("housing:detail.reviewsCount", { count: reviews.length })})
            </span>
          )}

          <div className="vehicle-detail-page__price">
            {price !== null ? (
              <>
                <strong>{t("housing:card.fromPrice", { price: formatCurrency(price) })}</strong>
                <span>{t("housing:card.perNight")}</span>
              </>
            ) : (
              <span>{t("housing:card.priceUnknown")}</span>
            )}
          </div>

          <div className="vehicle-detail-page__quick-specs">
            <span>{building.address}</span>
            <span>{t("housing:card.rooms", { count: building.rooms_count })}</span>
            <span>{t("housing:card.totalSeats", { count: totalCapacity })}</span>
          </div>

          <div className="vehicle-detail-page__actions">
            <Button variant="primary" disabled={!hasAvailableRoom} onClick={() => setIsBookingOpen(true)}>
              {t("housing:detail.book")}
            </Button>
            <Button variant="glass" onClick={() => void handleContact()}>
              {t("housing:detail.contact")}
            </Button>
          </div>
        </motion.div>
      </div>

      {building.description && (
        <section className="vehicle-detail-section">
          <h2>{t("housing:detail.description")}</h2>
          <p className="vehicle-detail-section__text">{building.description}</p>
        </section>
      )}

      <PropertyAmenities building={building} />
      <PropertyHouseRules />
      <PropertyReviews reviews={reviews} averageRating={averageRating} />
      <PropertyOwnerInfo owner={building.owner} />
      <SimilarProperties buildings={similarBuildings} />

      <RoomBookingModal building={isBookingOpen ? building : null} onClose={() => setIsBookingOpen(false)} />
    </section>
  );
}
