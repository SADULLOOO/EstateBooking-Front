import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { Building } from "@/types/booking";

export const buildingsApi = {
  list: () => apiClient.get<Building[]>(ENDPOINTS.buildings.list),
  detail: (id: number) => apiClient.get<Building>(ENDPOINTS.buildings.detail(id)),
  create: (payload: FormData) => apiClient.post<Building>(ENDPOINTS.buildings.list, payload),
  update: (id: number, payload: FormData) =>
    apiClient.patch<Building>(ENDPOINTS.buildings.detail(id), payload),
  remove: (id: number) => apiClient.delete(ENDPOINTS.buildings.detail(id)),
};
