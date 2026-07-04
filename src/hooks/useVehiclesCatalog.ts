import { useEffect, useMemo, useState } from "react";
import { vehiclesApi } from "@/api/vehicles.api";
import i18n from "@/i18n";
import type { Transmission, Vehicle, VehicleCategory } from "@/types/booking";

export type SortOption = "price_asc" | "price_desc" | "name_asc" | "rating_desc";

const PAGE_SIZE = 8;

interface Filters {
  categoryIds: number[];
  brands: string[];
  transmissions: Transmission[];
  minRating: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  search: string;
  sort: SortOption;
}

const DEFAULT_FILTERS: Filters = {
  categoryIds: [],
  brands: [],
  transmissions: [],
  minRating: null,
  minPrice: null,
  maxPrice: null,
  search: "",
  sort: "price_asc",
};

function priceOf(vehicle: Vehicle): number {
  return Number(vehicle.price_per_day ?? vehicle.price_per_hour);
}

export function useVehiclesCatalog() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([vehiclesApi.list(), vehiclesApi.listCategories()])
      .then(([vehiclesRes, categoriesRes]) => {
        setVehicles(vehiclesRes.data);
        setCategories(categoriesRes.data);
      })
      .catch(() => setError(i18n.t("vehicles:page.loadError")))
      .finally(() => setIsLoading(false));
  }, []);

  const priceBounds = useMemo(() => {
    if (vehicles.length === 0) return { min: 0, max: 0 };
    const prices = vehicles.map(priceOf);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [vehicles]);

  const brandOptions = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand).filter((b) => b.trim().length > 0))).sort(),
    [vehicles],
  );

  const transmissionOptions = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.transmission).filter((t): t is Transmission => t !== ""))),
    [vehicles],
  );

  const filteredSorted = useMemo(() => {
    let result = vehicles;

    if (filters.categoryIds.length > 0) {
      result = result.filter((v) => v.category && filters.categoryIds.includes(v.category.id));
    }
    if (filters.brands.length > 0) {
      result = result.filter((v) => filters.brands.includes(v.brand));
    }
    if (filters.transmissions.length > 0) {
      result = result.filter((v) => filters.transmissions.includes(v.transmission));
    }
    if (filters.minRating !== null) {
      result = result.filter((v) => (v.average_rating ?? 0) >= filters.minRating!);
    }
    if (filters.minPrice !== null) {
      result = result.filter((v) => priceOf(v) >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      result = result.filter((v) => priceOf(v) <= filters.maxPrice!);
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (v) => v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (filters.sort === "price_asc") return priceOf(a) - priceOf(b);
      if (filters.sort === "price_desc") return priceOf(b) - priceOf(a);
      if (filters.sort === "rating_desc") return (b.average_rating ?? 0) - (a.average_rating ?? 0);
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [vehicles, filters]);

  const visibleVehicles = filteredSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSorted.length;

  const resetVisibility = () => setVisibleCount(PAGE_SIZE);

  const setCategoryIds = (categoryIds: number[]) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, categoryIds }));
  };

  const setBrands = (brands: string[]) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, brands }));
  };

  const setTransmissions = (transmissions: Transmission[]) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, transmissions }));
  };

  const setMinRating = (minRating: number | null) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, minRating }));
  };

  const setPriceRange = (minPrice: number | null, maxPrice: number | null) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  const setSearch = (search: string) => {
    resetVisibility();
    setFilters((prev) => ({ ...prev, search }));
  };

  const setSort = (sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    resetVisibility();
  };

  const loadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

  return {
    isLoading,
    error,
    categories,
    brandOptions,
    transmissionOptions,
    priceBounds,
    filters,
    visibleVehicles,
    totalCount: filteredSorted.length,
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
  };
}
