import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useVehiclesCatalog } from "@/hooks/useVehiclesCatalog";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehicleToolbar } from "@/components/vehicles/VehicleToolbar";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import { VehicleDetailModal } from "@/components/vehicles/VehicleDetailModal";
import type { Transmission, Vehicle } from "@/types/booking";

export function VehiclesPage() {
  const { t } = useTranslation(["vehicles", "common"]);
  const {
    isLoading,
    error,
    categories,
    brandOptions,
    transmissionOptions,
    priceBounds,
    filters,
    visibleVehicles,
    totalCount,
    hasMore,
    setCategoryIds,
    setBrands,
    setTransmissions,
    setMinRating,
    setPriceRange,
    setSearch,
    setSort,
    resetFilters,
    loadMore,
  } = useVehiclesCatalog();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const toggleCategory = (id: number) => {
    const next = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((c) => c !== id)
      : [...filters.categoryIds, id];
    setCategoryIds(next);
  };

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setBrands(next);
  };

  const toggleTransmission = (transmission: Transmission) => {
    const next = filters.transmissions.includes(transmission)
      ? filters.transmissions.filter((t) => t !== transmission)
      : [...filters.transmissions, transmission];
    setTransmissions(next);
  };

  return (
    <section className="container vehicles-page">
      <div className="vehicles-page__header">
        <h1>{t("vehicles:page.title")}</h1>
        <p>{t("vehicles:page.subtitle")}</p>
      </div>

      <div className="vehicles-page__layout">
        <VehicleFilters
          categories={categories}
          selectedCategoryIds={filters.categoryIds}
          onCategoryToggle={toggleCategory}
          brandOptions={brandOptions}
          selectedBrands={filters.brands}
          onBrandToggle={toggleBrand}
          transmissionOptions={transmissionOptions}
          selectedTransmissions={filters.transmissions}
          onTransmissionToggle={toggleTransmission}
          minRating={filters.minRating}
          onMinRatingChange={setMinRating}
          priceBounds={priceBounds}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onPriceChange={setPriceRange}
          onReset={resetFilters}
        />

        <div className="vehicles-page__main">
          <VehicleToolbar
            search={filters.search}
            onSearchChange={setSearch}
            sort={filters.sort}
            onSortChange={setSort}
            totalCount={totalCount}
          />

          {isLoading && <p className="vehicles-page__status">{t("common:loading")}</p>}
          {error && <p className="vehicles-page__status vehicles-page__status--error">{error}</p>}

          {!isLoading && !error && (
            <VehicleGrid
              vehicles={visibleVehicles}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onViewDetails={setSelectedVehicle}
            />
          )}
        </div>
      </div>

      <VehicleDetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </section>
  );
}
