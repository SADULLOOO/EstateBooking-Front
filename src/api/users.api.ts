import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { User, UserRole } from "@/types/user";

export const usersApi = {
  list: () => apiClient.get<User[]>(ENDPOINTS.users.list),
  remove: (id: number) => apiClient.delete(ENDPOINTS.users.detail(id)),
  changeRole: (id: number, role: UserRole) =>
    apiClient.post<User>(ENDPOINTS.users.changeRole(id), { role }),
};
