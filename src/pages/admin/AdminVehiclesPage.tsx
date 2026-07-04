import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { vehiclesApi } from "@/api/vehicles.api";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { VehicleFormModal } from "@/components/admin/VehicleFormModal";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Vehicle, VehicleCategory } from "@/types/booking";

export function AdminVehiclesPage() {
  const { t } = useTranslation(["admin", "common"]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const load = () => {
    setIsLoading(true);
    Promise.all([vehiclesApi.list(), vehiclesApi.listCategories()])
      .then(([vehiclesRes, categoriesRes]) => {
        setVehicles(vehiclesRes.data);
        setCategories(categoriesRes.data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) => v.name.toLowerCase().includes(q) || v.plate_number.toLowerCase().includes(q));
  }, [vehicles, search]);

  const handleCreate = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (editingVehicle) {
      await vehiclesApi.update(editingVehicle.id, formData);
    } else {
      await vehiclesApi.create(formData);
    }
    load();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await vehiclesApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const columns: AdminTableColumn<Vehicle>[] = [
    { key: "name", label: t("admin:vehicles.columns.name"), render: (v) => `${v.brand ? v.brand + " " : ""}${v.name}` },
    { key: "category", label: t("admin:vehicles.columns.category"), render: (v) => v.category?.name ?? "—" },
    { key: "plate", label: t("admin:vehicles.columns.plate"), render: (v) => v.plate_number },
    { key: "price", label: t("admin:vehicles.columns.pricePerHour"), render: (v) => formatCurrency(v.price_per_hour) },
    {
      key: "status",
      label: t("admin:vehicles.columns.status"),
      render: (v) => (v.booking_status === "available" ? t("common:status.available") : t("common:status.booked")),
    },
  ];

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:vehicles.title")}</h1>
        <p>{t("admin:vehicles.subtitle")}</p>
      </div>

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        onAdd={handleCreate}
        addLabel={t("admin:vehicles.addButton")}
        totalCount={filtered.length}
      />

      {isLoading ? (
        <p className="vehicles-page__status">{t("common:loading")}</p>
      ) : (
        <AdminTable columns={columns} rows={filtered} rowKey={(v) => v.id} onEdit={handleEdit} onDelete={setDeleteTarget} />
      )}

      <VehicleFormModal
        vehicle={editingVehicle}
        categories={categories}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={t("admin:vehicles.confirmDelete", { name: deleteTarget?.name })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
