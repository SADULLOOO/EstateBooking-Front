import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { Room } from "@/types/booking";

export const roomsApi = {
  list: (buildingId?: number) =>
    apiClient.get<Room[]>(ENDPOINTS.rooms.list, {
      params: buildingId ? { building: buildingId } : undefined,
    }),
  detail: (id: number) => apiClient.get<Room>(ENDPOINTS.rooms.detail(id)),
  create: (payload: FormData) => apiClient.post<Room>(ENDPOINTS.rooms.list, payload),
  update: (id: number, payload: FormData) => apiClient.patch<Room>(ENDPOINTS.rooms.detail(id), payload),
  remove: (id: number) => apiClient.delete(ENDPOINTS.rooms.detail(id)),
};
