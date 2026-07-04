import { useEffect, useState } from "react";
import { buildingsApi } from "@/api/buildings.api";
import { reviewsApi } from "@/api/reviews.api";
import i18n from "@/i18n";
import type { Building, Review } from "@/types/booking";

export function usePropertyDetail(id: number) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarBuildings, setSimilarBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    buildingsApi
      .detail(id)
      .then(async ({ data: buildingData }) => {
        if (cancelled) return;
        setBuilding(buildingData);

        const [reviewsRes, allBuildingsRes] = await Promise.all([
          reviewsApi.list("building", id),
          buildingsApi.list(),
        ]);

        if (cancelled) return;
        setReviews(reviewsRes.data);
        setSimilarBuildings(
          allBuildingsRes.data.filter((b) => b.id !== id && b.city === buildingData.city),
        );
      })
      .catch(() => {
        if (!cancelled) setError(i18n.t("housing:detail.notFound"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const totalCapacity = building?.rooms.reduce((sum, r) => sum + r.capacity, 0) ?? 0;

  return {
    building,
    reviews,
    averageRating: building?.average_rating ?? null,
    totalCapacity,
    similarBuildings,
    isLoading,
    error,
  };
}
