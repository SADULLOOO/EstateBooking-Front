import { useTranslation } from "react-i18next";
import type { BookingFilter, BookingSort } from "@/hooks/useMyBookings";

const TABS: { key: BookingFilter; labelKey: string }[] = [
  { key: "all", labelKey: "bookings:filters.all" },
  { key: "active", labelKey: "common:status.active" },
  { key: "completed", labelKey: "common:status.completed" },
  { key: "cancelled", labelKey: "common:status.cancelled" },
];

interface BookingFiltersProps {
  filter: BookingFilter;
  onFilterChange: (filter: BookingFilter) => void;
  counts: Record<BookingFilter, number>;
  sort: BookingSort;
  onSortChange: (sort: BookingSort) => void;
}

export function BookingFilters({ filter, onFilterChange, counts, sort, onSortChange }: BookingFiltersProps) {
  const { t } = useTranslation(["bookings", "common"]);

  return (
    <div className="vehicle-toolbar booking-filters">
      <div className="property-gallery__tabs booking-filters__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={filter === tab.key ? "is-active" : ""}
            onClick={() => onFilterChange(tab.key)}
          >
            {t(tab.labelKey)} ({counts[tab.key]})
          </button>
        ))}
      </div>

      <select value={sort} onChange={(e) => onSortChange(e.target.value as BookingSort)}>
        <option value="date_desc">{t("bookings:filters.sortDateDesc")}</option>
        <option value="date_asc">{t("bookings:filters.sortDateAsc")}</option>
      </select>
    </div>
  );
}
