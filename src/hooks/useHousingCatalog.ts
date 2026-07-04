import { useEffect, useMemo, useState } from "react";
import { buildingsApi } from "@/api/buildings.api";
import i18n from "@/i18n";
import type { Building } from "@/types/booking";

export type HousingSortOption = "price_asc" | "price_desc" | "name_asc" | "rooms_desc";

const PAGE_SIZE = 8;

interface Filters {
  roomTypeNames: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRooms: number | null;
  projectorOnly: boolean;
  search: string;
  sort: HousingSortOption;
}

const DEFAULT_FILTERS: Filters = {
  roomTypeNames: [],
  minPrice: null,
  maxPrice: null,
  minRooms: null,
  projectorOnly: false,
  search: "",
  sort: "price_asc",
};

export function minRoomPrice(building: Building): number | null {
  const prices = building.rooms.map((r) => (r.price_per_night ? Number(r.price_per_night) : null)).filter(
    (p): p is number => p !== null,
  );
  return prices.length > 0 ? Math.min(...prices) : null;
}

function roomTypeNamesOf(building: Building): string[] {
  return Array.from(new Set(building.rooms.map((r) => r.category?.name).filter((n): n is string => Boolean(n))));
}

export function useHousingCatalog() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setIsLoading(true);
    buildingsApi
      .list()
      .then(({ data }) => setBuildings(data))
      .catch(() => setError(i18n.t("housing:page.loadError")))
      .finally(() => setIsLoading(false));
  }, []);

  const roomTypeOptions = useMemo(() => {
    const set = new Set<string>();
    buildings.forEach((b) => roomTypeNamesOf(b).forEach((n) => set.add(n)));
    return Array.from(set).sort();
  }, [buildings]);

  const priceBounds = useMemo(() => {
    const prices = buildings.map(minRoomPrice).filter((p): p is number => p !== null);
    if (prices.length === 0) return { min: 0, max: 0 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [buildings]);

  const filteredSorted = useMemo(() => {
    let result = buildings;

    if (filters.roomTypeNames.length > 0) {
      result = result.filter((b) => roomTypeNamesOf(b).some((n) => filters.roomTypeNames.includes(n)));
    }
    if (filters.minRooms !== null) {
      result = result.filter((b) => b.rooms_count >= filters.minRooms!);
    }
    if (filters.projectorOnly) {
      result = result.filter((b) => b.rooms.some((r) => r.has_projector));
    }
    if (filters.minPrice !== null) {
      result = result.filter((b) => {
        const price = minRoomPrice(b);
        return price !== null && price >= filters.minPrice!;
      });
    }
    if (filters.maxPrice !== null) {
      result = result.filter((b) => {
        const price = minRoomPrice(b);
        return price !== null && price <= filters.maxPrice!;
      });
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (b) => b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (filters.sort === "price_asc") return (minRoomPrice(a) ?? Infinity) - (minRoomPrice(b) ?? Infinity);
      if (filters.sort === "price_desc") return (minRoomPrice(b) ?? -Infinity) - (minRoomPrice(a) ?? -Infinity);
      if (filters.sort === "rooms_desc") return b.rooms_count - a.rooms_count;
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [buildings, filters]);

  const visibleBuildings = filteredSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSorted.length;

  const resetVisibility = () => setVisibleCount(PAGE_SIZE);

  const setRoomTypeNames = (roomTypeNames: string[]) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, roomTypeNames }));
  };
  const setPriceRange = (minPrice: number | null, maxPrice: number | null) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };
  const setMinRooms = (minRooms: number | null) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, minRooms }));
  };
  const setProjectorOnly = (projectorOnly: boolean) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, projectorOnly }));
  };
  const setSearch = (search: string) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, search }));
  };
  const setSort = (sort: HousingSortOption) => setFilters((prev) => ({ ...prev, sort }));
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    resetVisibility();
  };
  const loadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

  return {
    isLoading,
    error,
    roomTypeOptions,
    priceBounds,
    filters,
    visibleBuildings,
    totalCount: filteredSorted.length,
    hasMore,
    setRoomTypeNames,
    setPriceRange,
    setMinRooms,
    setProjectorOnly,
    setSearch,
    setSort,
    resetFilters,
    loadMore,
  };
}
