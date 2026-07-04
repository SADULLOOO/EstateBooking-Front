import { useEffect, useState } from "react";
import { bookingsApi } from "@/api/bookings.api";
import { reviewsApi } from "@/api/reviews.api";
import type { Booking, Review } from "@/types/booking";

export function useProfileStats() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookingsApi.my(), reviewsApi.my()])
      .then(([bookingsRes, reviewsRes]) => {
        setBookings(bookingsRes.data);
        setReviews(reviewsRes.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return {
    isLoading,
    bookingsCount: bookings.length,
    activeBookingsCount: bookings.filter((b) => b.status === "active").length,
    completedBookingsCount: bookings.filter((b) => b.status === "completed").length,
    cancelledBookingsCount: bookings.filter((b) => b.status === "cancelled").length,
    reviewsCount: reviews.length,
  };
}
