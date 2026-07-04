import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { AuthResponse, Profile } from "@/types/user";

export interface RegisterPayload {
  phone_number?: string;
  username?: string;
  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  phone_number: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.register, payload),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>(ENDPOINTS.auth.login, payload),

  logout: (refresh: string) => apiClient.post(ENDPOINTS.auth.logout, { refresh }),

  getProfile: () => apiClient.get<Profile>(ENDPOINTS.auth.profile),

  updateProfile: (payload: Partial<Profile> | FormData) =>
    apiClient.patch<Profile>(ENDPOINTS.auth.profile, payload),
};
