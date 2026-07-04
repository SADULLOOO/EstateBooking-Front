import { useTranslation } from "react-i18next";
import { useMyBookings } from "@/hooks/useMyBookings";
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingGrid } from "@/components/bookings/BookingGrid";

export function BookingsPage() {
  const { t } = useTranslation(["bookings", "common"]);
  const { isLoading, error, counts, filter, setFilter, sort, setSort, visibleBookings, cancelBooking, cancellingId } =
    useMyBookings();

  return (
    <section className="container vehicles-page">
      <div className="vehicles-page__header">
        <h1>{t("bookings:page.title")}</h1>
        <p>{t("bookings:page.subtitle")}</p>
      </div>

      <BookingFilters filter={filter} onFilterChange={setFilter} counts={counts} sort={sort} onSortChange={setSort} />

      {isLoading && <p className="vehicles-page__status">{t("common:loading")}</p>}
      {error && <p className="vehicles-page__status vehicles-page__status--error">{error}</p>}

      {!isLoading && !error && (
        <BookingGrid bookings={visibleBookings} onCancel={cancelBooking} cancellingId={cancellingId} />
      )}
    </section>
  );
}
