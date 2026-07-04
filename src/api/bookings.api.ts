import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { BookableType, Booking } from "@/types/booking";

export interface CreateBookingPayload {
  object_type: BookableType;
  object_id: number;
  start_time: string;
  end_time: string;
}

export const bookingsApi = {
  create: (payload: CreateBookingPayload) =>
    apiClient.post<{ message: string; booking: Booking }>(ENDPOINTS.bookings.create, payload),

  my: () => apiClient.get<Booking[]>(ENDPOINTS.bookings.my),

  all: () => apiClient.get<Booking[]>(ENDPOINTS.bookings.all),

  cancel: (id: number) => apiClient.post<{ message: string }>(ENDPOINTS.bookings.cancel(id)),
};
