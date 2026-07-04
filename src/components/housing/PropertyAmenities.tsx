import { useTranslation } from "react-i18next";
import type { Building } from "@/types/booking";

interface PropertyAmenitiesProps {
  building: Building;
}

export function PropertyAmenities({ building }: PropertyAmenitiesProps) {
  const { t } = useTranslation("housing");

  const roomTypes = Array.from(
    new Set(building.rooms.map((r) => r.category?.name).filter((n): n is string => Boolean(n))),
  );
  const hasProjector = building.rooms.some((r) => r.has_projector);

  const amenities = [
    ...(hasProjector ? [t("amenities.projector")] : []),
    ...roomTypes.map((name) => t("amenities.roomType", { name })),
    t("amenities.roomsAvailable", { count: building.rooms_count }),
  ];

  if (amenities.length === 0) return null;

  return (
    <section className="vehicle-detail-section">
      <h2>{t("amenities.title")}</h2>
      <div className="rental-terms-grid">
        {amenities.map((item) => (
          <div key={item} className="rental-terms-grid__item glass-surface">
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
