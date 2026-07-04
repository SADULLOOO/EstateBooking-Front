import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHousingCatalog } from "@/hooks/useHousingCatalog";
import { PropertyFilters } from "@/components/housing/PropertyFilters";
import { PropertyToolbar } from "@/components/housing/PropertyToolbar";
import { PropertyGrid } from "@/components/housing/PropertyGrid";
import { PropertyDetailModal } from "@/components/housing/PropertyDetailModal";
import type { Building } from "@/types/booking";

export function HousingPage() {
  const { t } = useTranslation(["housing", "common"]);
  const {
    isLoading,
    error,
    roomTypeOptions,
    priceBounds,
    filters,
    visibleBuildings,
    totalCount,
    hasMore,
    setRoomTypeNames,
    setPriceRange,
    setMinRooms,
    setProjectorOnly,
    setSearch,
    setSort,
    resetFilters,
    loadMore,
  } = useHousingCatalog();

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const toggleRoomType = (name: string) => {
    const next = filters.roomTypeNames.includes(name)
      ? filters.roomTypeNames.filter((n) => n !== name)
      : [...filters.roomTypeNames, name];
    setRoomTypeNames(next);
  };

  return (
    <section className="container vehicles-page">
      <div className="vehicles-page__header">
        <h1>{t("housing:page.title")}</h1>
        <p>{t("housing:page.subtitle")}</p>
      </div>

      <div className="vehicles-page__layout">
        <PropertyFilters
          roomTypeOptions={roomTypeOptions}
          selectedRoomTypes={filters.roomTypeNames}
          onRoomTypeToggle={toggleRoomType}
          priceBounds={priceBounds}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onPriceChange={setPriceRange}
          minRooms={filters.minRooms}
          onMinRoomsChange={setMinRooms}
          projectorOnly={filters.projectorOnly}
          onProjectorOnlyChange={setProjectorOnly}
          onReset={resetFilters}
        />

        <div className="vehicles-page__main">
          <PropertyToolbar
            search={filters.search}
            onSearchChange={setSearch}
            sort={filters.sort}
            onSortChange={setSort}
            totalCount={totalCount}
          />

          {isLoading && <p className="vehicles-page__status">{t("common:loading")}</p>}
          {error && <p className="vehicles-page__status vehicles-page__status--error">{error}</p>}

          {!isLoading && !error && (
            <PropertyGrid
              buildings={visibleBuildings}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onViewDetails={setSelectedBuilding}
            />
          )}
        </div>
      </div>

      <PropertyDetailModal building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />
    </section>
  );
}
