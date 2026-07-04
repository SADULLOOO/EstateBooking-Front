import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { bookingsApi } from "@/api/bookings.api";
import { reviewsApi } from "@/api/reviews.api";
import { vehiclesApi } from "@/api/vehicles.api";
import { StatBar } from "@/components/admin/StatBar";
import type { Booking, Review, Vehicle, VehicleCategory } from "@/types/booking";

export function AdminAnalyticsPage() {
  const { t } = useTranslation(["admin", "common"]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookingsApi.all(), reviewsApi.listAll(), vehiclesApi.list(), vehiclesApi.listCategories()])
      .then(([bookingsRes, reviewsRes, vehiclesRes, categoriesRes]) => {
        setBookings(bookingsRes.data);
        setReviews(reviewsRes.data);
        setVehicles(vehiclesRes.data);
        setCategories(categoriesRes.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="vehicles-page__status">{t("common:loading")}</p>;

  const bookingStatuses: Booking["status"][] = ["active", "completed", "cancelled"];

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:analytics.title")}</h1>
        <p>{t("admin:analytics.subtitle")}</p>
      </div>

      <div className="admin-analytics-grid">
        <div className="settings-card glass-surface">
          <h2>{t("admin:analytics.bookingsByStatus")}</h2>
          {bookingStatuses.map((s) => (
            <StatBar
              key={s}
              label={t(`common:status.${s}`)}
              count={bookings.filter((b) => b.status === s).length}
              total={bookings.length}
            />
          ))}
        </div>

        <div className="settings-card glass-surface">
          <h2>{t("admin:analytics.reviewsRatingDistribution")}</h2>
          {ratingCounts.map(({ rating, count }) => (
            <StatBar key={rating} label={`★ ${rating}`} count={count} total={reviews.length} />
          ))}
        </div>

        <div className="settings-card glass-surface">
          <h2>{t("admin:analytics.vehiclesByCategory")}</h2>
          {categories.map((c) => (
            <StatBar
              key={c.id}
              label={c.name}
              count={vehicles.filter((v) => v.category?.id === c.id).length}
              total={vehicles.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
