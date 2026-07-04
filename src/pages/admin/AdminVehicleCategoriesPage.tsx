import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { vehiclesApi } from "@/api/vehicles.api";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { VehicleCategoryFormModal } from "@/components/admin/VehicleCategoryFormModal";
import type { VehicleCategory } from "@/types/booking";

export function AdminVehicleCategoriesPage() {
  const { t } = useTranslation(["admin", "common"]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<VehicleCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VehicleCategory | null>(null);

  const load = () => {
    setIsLoading(true);
    vehiclesApi.listCategories().then(({ data }) => setCategories(data)).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const handleSubmit = async (payload: Partial<VehicleCategory>) => {
    if (editing) await vehiclesApi.updateCategory(editing.id, payload);
    else await vehiclesApi.createCategory(payload);
    load();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await vehiclesApi.removeCategory(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const columns: AdminTableColumn<VehicleCategory>[] = [
    { key: "name", label: t("admin:vehicleCategories.columns.name"), render: (c) => c.name },
    { key: "level", label: t("admin:vehicleCategories.columns.level"), render: (c) => c.level },
    { key: "description", label: t("admin:vehicleCategories.columns.description"), render: (c) => c.description || "—" },
  ];

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:vehicleCategories.title")}</h1>
        <p>{t("admin:vehicleCategories.subtitle")}</p>
      </div>

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        onAdd={() => {
          setEditing(null);
          setIsFormOpen(true);
        }}
        addLabel={t("admin:vehicleCategories.addButton")}
        totalCount={filtered.length}
      />

      {isLoading ? (
        <p className="vehicles-page__status">{t("common:loading")}</p>
      ) : (
        <AdminTable
          columns={columns}
          rows={filtered}
          rowKey={(c) => c.id}
          onEdit={(c) => {
            setEditing(c);
            setIsFormOpen(true);
          }}
          onDelete={setDeleteTarget}
        />
      )}

      <VehicleCategoryFormModal
        category={editing}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={t("admin:vehicleCategories.confirmDelete", { name: deleteTarget?.name })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
