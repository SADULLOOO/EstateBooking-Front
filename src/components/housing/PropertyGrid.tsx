import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/housing/PropertyCard";
import type { Building } from "@/types/booking";

interface PropertyGridProps {
  buildings: Building[];
  hasMore: boolean;
  onLoadMore: () => void;
  onViewDetails: (building: Building) => void;
}

export function PropertyGrid({ buildings, hasMore, onLoadMore, onViewDetails }: PropertyGridProps) {
  const { t } = useTranslation(["housing", "common"]);

  if (buildings.length === 0) {
    return <p className="vehicle-grid__empty">{t("housing:grid.empty")}</p>;
  }

  return (
    <div>
      <div className="vehicle-grid">
        <AnimatePresence>
          {buildings.map((building, index) => (
            <PropertyCard key={building.id} building={building} index={index} onViewDetails={onViewDetails} />
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
