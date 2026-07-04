import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { Room } from "@/types/booking";

interface RoomFormModalProps {
  room: Room | null;
  buildingId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function RoomFormModal({ room, buildingId, isOpen, onClose, onSubmit }: RoomFormModalProps) {
  const { t } = useTranslation(["admin", "common"]);
  const [name, setName] = useState("");
  const [floor, setFloor] = useState("1");
  const [capacity, setCapacity] = useState("2");
  const [hasProjector, setHasProjector] = useState(false);
  const [pricePerNight, setPricePerNight] = useState("");
  const [model3dUrl, setModel3dUrl] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(room?.name ?? "");
    setFloor(String(room?.floor ?? 1));
    setCapacity(String(room?.capacity ?? 2));
    setHasProjector(room?.has_projector ?? false);
    setPricePerNight(room?.price_per_night ?? "");
    setModel3dUrl(room?.model_3d_url ?? "");
    setPhoto(null);
    setError(null);
  }, [isOpen, room]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("building", String(buildingId));
      formData.append("floor", floor);
      formData.append("capacity", capacity);
      formData.append("has_projector", String(hasProjector));
      if (pricePerNight) formData.append("price_per_night", pricePerNight);
      formData.append("model_3d_url", model3dUrl.trim());
      if (photo) formData.append("photo", photo);

      await onSubmit(formData);
      onClose();
    } catch {
      setError(t("admin:properties.roomForm.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="auth-modal glass-surface admin-form-modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="auth-modal__title">{room ? t("admin:properties.roomForm.editTitle") : t("admin:properties.roomForm.createTitle")}</h3>
            <form onSubmit={handleSubmit} className="auth-modal__form admin-form-modal__grid">
              <label className="auth-modal__label">
                {t("admin:properties.roomForm.name")}
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:properties.roomForm.floor")}
                <input type="number" min={0} value={floor} onChange={(e) => setFloor(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:properties.roomForm.capacity")}
                <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:properties.roomForm.pricePerNight")}
                <input type="number" min={0} value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
              </label>
              <label className="vehicle-filters__checkbox">
                <input type="checkbox" checked={hasProjector} onChange={(e) => setHasProjector(e.target.checked)} />
                {t("admin:properties.roomForm.hasProjector")}
              </label>
              <label className="auth-modal__label">
                {t("admin:properties.roomForm.photo")}
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
              </label>
              <label className="auth-modal__label admin-form-modal__full">
                {t("admin:properties.roomForm.model3dUrl")}
                <input
                  type="url"
                  value={model3dUrl}
                  onChange={(e) => setModel3dUrl(e.target.value)}
                  placeholder="https://..."
                />
                <small className="admin-form-modal__hint">{t("admin:properties.roomForm.model3dUrlHint")}</small>
              </label>

              {error && <p className="auth-modal__error">{error}</p>}

              <div className="admin-form-modal__actions">
                <Button type="button" variant="glass" onClick={onClose}>
                  {t("common:actions.cancel")}
                </Button>
                <Button type="submit" disabled={isSaving} className={isSaving ? "is-loading" : ""}>
                  {isSaving ? t("common:actions.saving") : t("common:actions.save")}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
