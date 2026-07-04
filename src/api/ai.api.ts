import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export const aiApi = {
  ask: (query: string) =>
    apiClient.post<{ query: string; response: string }>(ENDPOINTS.ai.recommendation, { query }),
};
