import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { bookingsApi } from "@/api/bookings.api";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { formatDateTime } from "@/utils/formatDate";
import type { Booking } from "@/types/booking";

export function AdminBookingsPage() {
  const { t } = useTranslation(["admin", "common", "bookings"]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingsApi.all().then(({ data }) => setBookings(data)).finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) => b.booked_object_repr.toLowerCase().includes(q));
  }, [bookings, search]);

  const columns: AdminTableColumn<Booking>[] = [
    { key: "object", label: t("admin:bookings.columns.object"), render: (b) => b.booked_object_repr },
    {
      key: "type",
      label: t("admin:bookings.columns.type"),
      render: (b) => (b.booked_object_type === "room" ? t("bookings:objectType.room") : t("bookings:objectType.vehicle")),
    },
    { key: "start", label: t("admin:bookings.columns.start"), render: (b) => formatDateTime(b.start_time) },
    { key: "end", label: t("admin:bookings.columns.end"), render: (b) => formatDateTime(b.end_time) },
    { key: "status", label: t("admin:bookings.columns.status"), render: (b) => t(`common:status.${b.status}`) },
  ];

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:bookings.title")}</h1>
        <p>{t("admin:bookings.subtitle")}</p>
      </div>

      <AdminToolbar search={search} onSearchChange={setSearch} totalCount={filtered.length} />

      {isLoading ? (
        <p className="vehicles-page__status">{t("common:loading")}</p>
      ) : (
        <AdminTable columns={columns} rows={filtered} rowKey={(b) => b.id} />
      )}
    </section>
  );
}
