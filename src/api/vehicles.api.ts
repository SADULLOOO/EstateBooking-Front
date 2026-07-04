import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { Vehicle, VehicleCategory } from "@/types/booking";

export const vehiclesApi = {
  listCategories: () => apiClient.get<VehicleCategory[]>(ENDPOINTS.vehicleCategories.list),
  categoryDetail: (id: number) =>
    apiClient.get<VehicleCategory>(ENDPOINTS.vehicleCategories.detail(id)),
  createCategory: (payload: Partial<VehicleCategory>) =>
    apiClient.post<VehicleCategory>(ENDPOINTS.vehicleCategories.list, payload),
  updateCategory: (id: number, payload: Partial<VehicleCategory>) =>
    apiClient.patch<VehicleCategory>(ENDPOINTS.vehicleCategories.detail(id), payload),
  removeCategory: (id: number) => apiClient.delete(ENDPOINTS.vehicleCategories.detail(id)),

  list: (params?: { category?: number; level?: number }) =>
    apiClient.get<Vehicle[]>(ENDPOINTS.vehicles.list, { params }),
  detail: (id: number) => apiClient.get<Vehicle>(ENDPOINTS.vehicles.detail(id)),
  create: (payload: FormData) => apiClient.post<Vehicle>(ENDPOINTS.vehicles.list, payload),
  update: (id: number, payload: FormData) =>
    apiClient.patch<Vehicle>(ENDPOINTS.vehicles.detail(id), payload),
  remove: (id: number) => apiClient.delete(ENDPOINTS.vehicles.detail(id)),
};
