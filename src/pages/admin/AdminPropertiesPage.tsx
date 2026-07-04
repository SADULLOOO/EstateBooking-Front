import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { buildingsApi } from "@/api/buildings.api";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { BuildingFormModal } from "@/components/admin/BuildingFormModal";
import { RoomsManagerModal } from "@/components/admin/RoomsManagerModal";
import { Button } from "@/components/ui/Button";
import type { Building } from "@/types/booking";

export function AdminPropertiesPage() {
  const { t } = useTranslation(["admin", "common"]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Building | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Building | null>(null);
  const [roomsBuilding, setRoomsBuilding] = useState<Building | null>(null);

  const load = () => {
    setIsLoading(true);
    buildingsApi.list().then(({ data }) => setBuildings(data)).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return buildings;
    return buildings.filter((b) => b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q));
  }, [buildings, search]);

  const handleSubmit = async (formData: FormData) => {
    if (editing) await buildingsApi.update(editing.id, formData);
    else await buildingsApi.create(formData);
    load();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await buildingsApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const columns: AdminTableColumn<Building>[] = [
    { key: "name", label: t("admin:properties.columns.name"), render: (b) => b.name },
    { key: "city", label: t("admin:properties.columns.city"), render: (b) => b.city || "—" },
    { key: "rooms", label: t("admin:properties.columns.rooms"), render: (b) => b.rooms_count },
    {
      key: "manage",
      label: t("admin:properties.columns.manage"),
      render: (b) => (
        <Button variant="glass" onClick={() => setRoomsBuilding(b)}>
          {t("admin:properties.manageButton")}
        </Button>
      ),
    },
  ];

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:properties.title")}</h1>
        <p>{t("admin:properties.subtitle")}</p>
      </div>

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        onAdd={() => {
          setEditing(null);
          setIsFormOpen(true);
        }}
        addLabel={t("admin:properties.addButton")}
        totalCount={filtered.length}
      />

      {isLoading ? (
        <p className="vehicles-page__status">{t("common:loading")}</p>
      ) : (
        <AdminTable
          columns={columns}
          rows={filtered}
          rowKey={(b) => b.id}
          onEdit={(b) => {
            setEditing(b);
            setIsFormOpen(true);
          }}
          onDelete={setDeleteTarget}
        />
      )}

      <BuildingFormModal
        building={editing}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <RoomsManagerModal building={roomsBuilding} onClose={() => setRoomsBuilding(null)} onChanged={load} />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={t("admin:properties.confirmDelete", { name: deleteTarget?.name })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
