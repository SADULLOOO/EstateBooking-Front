import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { VehicleCategory } from "@/types/booking";

interface VehicleCategoryFormModalProps {
  category: VehicleCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: Partial<VehicleCategory>) => Promise<void>;
}

export function VehicleCategoryFormModal({ category, isOpen, onClose, onSubmit }: VehicleCategoryFormModalProps) {
  const { t } = useTranslation(["admin", "common"]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("1");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(category?.name ?? "");
    setLevel(String(category?.level ?? 1));
    setDescription(category?.description ?? "");
    setError(null);
  }, [isOpen, category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({ name, level: Number(level), description });
      onClose();
    } catch {
      setError(t("admin:vehicleCategories.form.saveError"));
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
            className="auth-modal glass-surface"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="auth-modal__title">{category ? t("admin:vehicleCategories.form.editTitle") : t("admin:vehicleCategories.form.createTitle")}</h3>
            <form onSubmit={handleSubmit} className="auth-modal__form">
              <label className="auth-modal__label">
                {t("admin:vehicleCategories.form.name")}
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicleCategories.form.level")}
                <input type="number" min={1} value={level} onChange={(e) => setLevel(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicleCategories.form.description")}
                <input value={description} onChange={(e) => setDescription(e.target.value)} />
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
