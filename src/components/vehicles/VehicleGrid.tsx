import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import type { Vehicle } from "@/types/booking";

interface VehicleGridProps {
  vehicles: Vehicle[];
  hasMore: boolean;
  onLoadMore: () => void;
  onViewDetails: (vehicle: Vehicle) => void;
}

export function VehicleGrid({ vehicles, hasMore, onLoadMore, onViewDetails }: VehicleGridProps) {
  const { t } = useTranslation(["vehicles", "common"]);

  if (vehicles.length === 0) {
    return <p className="vehicle-grid__empty">{t("vehicles:grid.empty")}</p>;
  }

  return (
    <div>
      <div className="vehicle-grid">
        <AnimatePresence>
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} onViewDetails={onViewDetails} />
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.div className="vehicle-grid__load-more" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button variant="glass" onClick={onLoadMore}>
            {t("common:actions.showMore")}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
