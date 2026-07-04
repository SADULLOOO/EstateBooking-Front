import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { reviewsApi } from "@/api/reviews.api";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatDate } from "@/utils/formatDate";
import type { Review } from "@/types/booking";

export function AdminReviewsPage() {
  const { t } = useTranslation(["admin", "common"]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const load = () => {
    setIsLoading(true);
    reviewsApi
      .listAll()
      .then(({ data }) => setReviews(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) => r.user.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q));
  }, [reviews, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await reviewsApi.delete(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const columns: AdminTableColumn<Review>[] = [
    { key: "user", label: t("admin:reviews.columns.user"), render: (r) => r.user },
    { key: "type", label: t("admin:reviews.columns.type"), render: (r) => t(`admin:reviews.objectType.${r.object_type}`) },
    { key: "rating", label: t("admin:reviews.columns.rating"), render: (r) => `★ ${r.rating}` },
    { key: "comment", label: t("admin:reviews.columns.comment"), render: (r) => r.comment || "—" },
    { key: "date", label: t("admin:reviews.columns.date"), render: (r) => formatDate(r.created_at) },
  ];

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:reviews.title")}</h1>
        <p>{t("admin:reviews.subtitle")}</p>
      </div>

      <AdminToolbar search={search} onSearchChange={setSearch} totalCount={filtered.length} />

      {isLoading ? (
        <p className="vehicles-page__status">{t("common:loading")}</p>
      ) : (
        <AdminTable columns={columns} rows={filtered} rowKey={(r) => r.id} onDelete={setDeleteTarget} />
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={t("admin:reviews.confirmDelete", { user: deleteTarget?.user })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
