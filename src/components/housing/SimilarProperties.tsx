import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PropertyCard } from "@/components/housing/PropertyCard";
import { ROUTES } from "@/app/router/routes";
import type { Building } from "@/types/booking";

interface SimilarPropertiesProps {
  buildings: Building[];
}

export function SimilarProperties({ buildings }: SimilarPropertiesProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("housing");

  if (buildings.length === 0) return null;

  return (
    <section className="vehicle-detail-section">
      <h2>{t("similar.title")}</h2>
      <div className="vehicle-grid">
        {buildings.slice(0, 4).map((building, index) => (
          <PropertyCard
            key={building.id}
            building={building}
            index={index}
            onViewDetails={(b) => navigate(ROUTES.propertyDetail(b.id))}
          />
        ))}
      </div>
    </section>
  );
}
