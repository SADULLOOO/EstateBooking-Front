import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { ROUTES } from "@/app/router/routes";
import type { Vehicle } from "@/types/booking";

interface SimilarVehiclesProps {
  vehicles: Vehicle[];
}

export function SimilarVehicles({ vehicles }: SimilarVehiclesProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("vehicles");

  if (vehicles.length === 0) return null;

  return (
    <section className="vehicle-detail-section">
      <h2>{t("similar.title")}</h2>
      <div className="vehicle-grid">
        {vehicles.slice(0, 4).map((vehicle, index) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            index={index}
            onViewDetails={(v) => navigate(ROUTES.vehicleDetail(v.id))}
          />
        ))}
      </div>
    </section>
  );
}
