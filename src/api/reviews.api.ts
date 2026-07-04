import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { Review, ReviewableType } from "@/types/booking";

export interface CreateReviewPayload {
  object_type: ReviewableType;
  object_id: number;
  rating: number;
  comment: string;
}

export const reviewsApi = {
  create: (payload: CreateReviewPayload) =>
    apiClient.post<Review>(ENDPOINTS.reviews.create, payload),

  my: () => apiClient.get<Review[]>(ENDPOINTS.reviews.my),

  delete: (id: number) => apiClient.delete<{ message: string }>(ENDPOINTS.reviews.delete(id)),

  list: (objectType: ReviewableType, objectId: number) =>
    apiClient.get<Review[]>(ENDPOINTS.reviews.list, {
      params: { object_type: objectType, object_id: objectId },
    }),

  listAll: () => apiClient.get<Review[]>(ENDPOINTS.reviews.list),
};
