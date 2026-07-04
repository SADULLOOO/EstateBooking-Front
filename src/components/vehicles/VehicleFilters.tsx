import { useTranslation } from "react-i18next";
import type { Transmission, VehicleCategory } from "@/types/booking";
import { Button } from "@/components/ui/Button";
import { useTransmissionLabel } from "@/components/vehicles/vehicleLabels";

const RATING_OPTIONS = [4.5, 4, 3];

interface VehicleFiltersProps {
  categories: VehicleCategory[];
  selectedCategoryIds: number[];
  onCategoryToggle: (id: number) => void;
  brandOptions: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  transmissionOptions: Transmission[];
  selectedTransmissions: Transmission[];
  onTransmissionToggle: (transmission: Transmission) => void;
  minRating: number | null;
  onMinRatingChange: (value: number | null) => void;
  priceBounds: { min: number; max: number };
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  onReset: () => void;
}

export function VehicleFilters({
  categories,
  selectedCategoryIds,
  onCategoryToggle,
  brandOptions,
  selectedBrands,
  onBrandToggle,
  transmissionOptions,
  selectedTransmissions,
  onTransmissionToggle,
  minRating,
  onMinRatingChange,
  priceBounds,
  minPrice,
  maxPrice,
  onPriceChange,
  onReset,
}: VehicleFiltersProps) {
  const { t } = useTranslation("vehicles");
  const transmissionLabel = useTransmissionLabel();

  return (
    <aside className="vehicle-filters glass-surface">
      <div className="vehicle-filters__section">
        <h3>{t("vehicles:filters.price")}</h3>
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

      {brandOptions.length > 0 && (
        <div className="vehicle-filters__section">
          <h3>{t("vehicles:filters.brand")}</h3>
          <div className="vehicle-filters__list">
            {brandOptions.map((brand) => (
              <label key={brand} className="vehicle-filters__checkbox">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandToggle(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="vehicle-filters__section">
        <h3>{t("vehicles:filters.category")}</h3>
        <div className="vehicle-filters__list">
          {categories.map((category) => (
            <label key={category.id} className="vehicle-filters__checkbox">
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(category.id)}
                onChange={() => onCategoryToggle(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="vehicle-filters__section">
        <h3>{t("vehicles:filters.rating")}</h3>
        <div className="vehicle-filters__list">
          <label className="vehicle-filters__checkbox">
            <input type="radio" checked={minRating === null} onChange={() => onMinRatingChange(null)} />
            {t("vehicles:filters.ratingAny")}
          </label>
          {RATING_OPTIONS.map((rating) => (
            <label key={rating} className="vehicle-filters__checkbox">
              <input
                type="radio"
                checked={minRating === rating}
                onChange={() => onMinRatingChange(rating)}
              />
              ★ {rating}+
            </label>
          ))}
        </div>
      </div>

      {transmissionOptions.length > 0 && (
        <div className="vehicle-filters__section">
          <h3>{t("vehicles:filters.transmission")}</h3>
          <div className="vehicle-filters__list">
            {transmissionOptions.map((transmission) => (
              <label key={transmission} className="vehicle-filters__checkbox">
                <input
                  type="checkbox"
                  checked={selectedTransmissions.includes(transmission)}
                  onChange={() => onTransmissionToggle(transmission)}
                />
                {transmissionLabel(transmission as Exclude<Transmission, "">)}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button variant="glass" onClick={onReset} className="vehicle-filters__reset">
        {t("vehicles:filters.reset")}
      </Button>
    </aside>
  );
}
