import { useEffect, useState } from "react";
import { buildingsApi } from "@/api/buildings.api";
import { vehiclesApi } from "@/api/vehicles.api";

export interface ServiceStats {
  buildingsCount: number;
  roomsCount: number;
  vehiclesCount: number;
  isLoading: boolean;
}

export function useServiceStats(): ServiceStats {
  const [stats, setStats] = useState<Omit<ServiceStats, "isLoading">>({
    buildingsCount: 0,
    roomsCount: 0,
    vehiclesCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([buildingsApi.list(), vehiclesApi.list()])
      .then(([buildingsRes, vehiclesRes]) => {
        if (cancelled) return;
        const buildings = buildingsRes.data;
        setStats({
          buildingsCount: buildings.length,
          roomsCount: buildings.reduce((sum, b) => sum + b.rooms_count, 0),
          vehiclesCount: vehiclesRes.data.length,
        });
      })
      .catch(() => {
        // сервис статистики недоступен — остаёмся на нулевых значениях
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...stats, isLoading };
}
