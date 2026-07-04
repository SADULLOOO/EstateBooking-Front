import { useEffect, useState } from "react";
import { vehiclesApi } from "@/api/vehicles.api";
import { reviewsApi } from "@/api/reviews.api";
import i18n from "@/i18n";
import type { Review, Vehicle } from "@/types/booking";

export function useVehicleDetail(id: number) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    vehiclesApi
      .detail(id)
      .then(async ({ data: vehicleData }) => {
        if (cancelled) return;
        setVehicle(vehicleData);

        const [reviewsRes, similarRes] = await Promise.all([
          reviewsApi.list("vehicle", id),
          vehicleData.category
            ? vehiclesApi.list({ category: vehicleData.category.id })
            : Promise.resolve({ data: [] as Vehicle[] }),
        ]);

        if (cancelled) return;
        setReviews(reviewsRes.data);
        setSimilarVehicles(similarRes.data.filter((v) => v.id !== id));
      })
      .catch(() => {
        if (!cancelled) setError(i18n.t("vehicles:detail.notFound"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { vehicle, reviews, averageRating: vehicle?.average_rating ?? null, similarVehicles, isLoading, error };
}
