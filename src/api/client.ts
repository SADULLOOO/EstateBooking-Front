import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/config/env";
import { ENDPOINTS } from "@/api/endpoints";
import { tokenStorage } from "@/api/tokenStorage";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) {
    throw new Error("No refresh token available");
  }
  const { data } = await axios.post<{ access: string }>(
    `${API_BASE_URL}${ENDPOINTS.auth.tokenRefresh}`,
    { refresh },
  );
  tokenStorage.setAccess(data.access);
  return data.access;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry || !tokenStorage.getRefresh()) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccess = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clear();
      return Promise.reject(refreshError);
    }
  },
);
