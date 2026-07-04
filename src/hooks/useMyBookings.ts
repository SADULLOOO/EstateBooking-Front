import { useEffect, useMemo, useState } from "react";
import { bookingsApi } from "@/api/bookings.api";
import i18n from "@/i18n";
import type { Booking, BookingStatus } from "@/types/booking";

export type BookingFilter = "all" | BookingStatus;
export type BookingSort = "date_desc" | "date_asc";

export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [sort, setSort] = useState<BookingSort>("date_desc");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const load = () => {
    setIsLoading(true);
    bookingsApi
      .my()
      .then(({ data }) => setBookings(data))
      .catch(() => setError(i18n.t("bookings:loadError")))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancelBooking = async (id: number) => {
    setCancellingId(id);
    try {
      await bookingsApi.cancel(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    } finally {
      setCancellingId(null);
    }
  };

  const counts = useMemo(
    () => ({
      all: bookings.length,
      active: bookings.filter((b) => b.status === "active").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings],
  );

  const visibleBookings = useMemo(() => {
    let result = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
    result = [...result].sort((a, b) => {
      const diff = new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      return sort === "date_asc" ? diff : -diff;
    });
    return result;
  }, [bookings, filter, sort]);

  return {
    isLoading,
    error,
    counts,
    filter,
    setFilter,
    sort,
    setSort,
    visibleBookings,
    cancelBooking,
    cancellingId,
  };
}
