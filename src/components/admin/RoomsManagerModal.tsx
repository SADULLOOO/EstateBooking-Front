import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { roomsApi } from "@/api/rooms.api";
import { Button } from "@/components/ui/Button";
import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { RoomFormModal } from "@/components/admin/RoomFormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Building, Room } from "@/types/booking";

interface RoomsManagerModalProps {
  building: Building | null;
  onClose: () => void;
  onChanged: () => void;
}

export function RoomsManagerModal({ building, onClose, onChanged }: RoomsManagerModalProps) {
  const { t } = useTranslation(["admin", "common", "housing"]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editing, setEditing] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  const load = () => {
    if (!building) return;
    roomsApi.list(building.id).then(({ data }) => setRooms(data));
  };

  useEffect(load, [building]);

  const handleSubmit = async (formData: FormData) => {
    if (editing) await roomsApi.update(editing.id, formData);
    else await roomsApi.create(formData);
    load();
    onChanged();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await roomsApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
    onChanged();
  };

  const columns: AdminTableColumn<Room>[] = [
    { key: "name", label: t("admin:properties.roomsManager.columns.name"), render: (r) => r.name },
    { key: "floor", label: t("admin:properties.roomsManager.columns.floor"), render: (r) => r.floor },
    { key: "capacity", label: t("admin:properties.roomsManager.columns.capacity"), render: (r) => r.capacity },
    {
      key: "price",
      label: t("admin:properties.roomsManager.columns.price"),
      render: (r) => (r.price_per_night ? formatCurrency(r.price_per_night) : "—"),
    },
    {
      key: "status",
      label: t("admin:properties.roomsManager.columns.status"),
      render: (r) => (r.booking_status === "available" ? t("housing:status.roomAvailable") : t("housing:status.roomBooked")),
    },
  ];

  return (
    <AnimatePresence>
      {building && (
        <motion.div
          className="auth-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="auth-modal glass-surface admin-form-modal admin-form-modal--wide"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vehicle-toolbar">
              <h3 className="auth-modal__title">{t("admin:properties.roomsManager.title", { name: building.name })}</h3>
              <Button
                variant="primary"
                onClick={() => {
                  setEditing(null);
                  setIsFormOpen(true);
                }}
              >
                {t("admin:properties.roomsManager.addButton")}
              </Button>
            </div>

            <AdminTable
              columns={columns}
              rows={rooms}
              rowKey={(r) => r.id}
              onEdit={(r) => {
                setEditing(r);
                setIsFormOpen(true);
              }}
              onDelete={setDeleteTarget}
              emptyLabel={t("admin:properties.roomsManager.empty")}
            />

            <div className="admin-form-modal__actions">
              <Button variant="glass" onClick={onClose}>
                {t("admin:properties.roomsManager.close")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <RoomFormModal
        room={editing}
        buildingId={building?.id ?? 0}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={t("admin:properties.roomsManager.confirmDelete", { name: deleteTarget?.name })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AnimatePresence>
  );
}
