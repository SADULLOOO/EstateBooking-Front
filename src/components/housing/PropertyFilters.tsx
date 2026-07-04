import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

interface PropertyFiltersProps {
  roomTypeOptions: string[];
  selectedRoomTypes: string[];
  onRoomTypeToggle: (name: string) => void;
  priceBounds: { min: number; max: number };
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  minRooms: number | null;
  onMinRoomsChange: (value: number | null) => void;
  projectorOnly: boolean;
  onProjectorOnlyChange: (value: boolean) => void;
  onReset: () => void;
}

export function PropertyFilters({
  roomTypeOptions,
  selectedRoomTypes,
  onRoomTypeToggle,
  priceBounds,
  minPrice,
  maxPrice,
  onPriceChange,
  minRooms,
  onMinRoomsChange,
  projectorOnly,
  onProjectorOnlyChange,
  onReset,
}: PropertyFiltersProps) {
  const { t } = useTranslation("housing");

  return (
    <aside className="vehicle-filters glass-surface">
      <div className="vehicle-filters__section">
        <h3>{t("filters.price")}</h3>
        <div className="vehicle-filters__price-row">
          <input
            type="number"
            placeholder={String(priceBounds.min)}
            value={minPrice ?? ""}
            onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : null, maxPrice)}
          />
          <span>—</span>
          <input
            type="number"
            placeholder={String(priceBounds.max)}
            value={maxPrice ?? ""}
            onChange={(e) => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>

      {roomTypeOptions.length > 0 && (
        <div className="vehicle-filters__section">
          <h3>{t("filters.roomType")}</h3>
          <div className="vehicle-filters__list">
            {roomTypeOptions.map((name) => (
              <label key={name} className="vehicle-filters__checkbox">
                <input
                  type="checkbox"
                  checked={selectedRoomTypes.includes(name)}
                  onChange={() => onRoomTypeToggle(name)}
                />
                {name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="vehicle-filters__section">
        <h3>{t("filters.roomsCount")}</h3>
        <input
          type="number"
          min={0}
          placeholder={t("filters.from")}
          value={minRooms ?? ""}
          onChange={(e) => onMinRoomsChange(e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div className="vehicle-filters__section">
        <h3>{t("filters.amenities")}</h3>
        <label className="vehicle-filters__checkbox">
          <input
            type="checkbox"
            checked={projectorOnly}
            onChange={(e) => onProjectorOnlyChange(e.target.checked)}
          />
          {t("filters.projector")}
        </label>
      </div>

      <Button variant="glass" onClick={onReset} className="vehicle-filters__reset">
        {t("filters.reset")}
      </Button>
    </aside>
  );
}
