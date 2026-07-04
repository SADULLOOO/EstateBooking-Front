import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { Building } from "@/types/booking";

interface BuildingFormModalProps {
  building: Building | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function BuildingFormModal({ building, isOpen, onClose, onSubmit }: BuildingFormModalProps) {
  const { t } = useTranslation(["admin", "common"]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(building?.name ?? "");
    setAddress(building?.address ?? "");
    setCity(building?.city ?? "");
    setDescription(building?.description ?? "");
    setCoverImage(null);
    setError(null);
  }, [isOpen, building]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("description", description);
      if (coverImage) formData.append("cover_image", coverImage);

      await onSubmit(formData);
      onClose();
    } catch {
      setError(t("admin:properties.form.saveError"));
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
            <h3 className="auth-modal__title">{building ? t("admin:properties.form.editTitle") : t("admin:properties.form.createTitle")}</h3>
            <form onSubmit={handleSubmit} className="auth-modal__form admin-form-modal__grid">
              <label className="auth-modal__label">
                {t("admin:properties.form.name")}
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:properties.form.city")}
                <input value={city} onChange={(e) => setCity(e.target.value)} />
              </label>
              <label className="auth-modal__label">
                {t("admin:properties.form.address")}
                <input value={address} onChange={(e) => setAddress(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:properties.form.cover")}
                <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} />
              </label>
              <label className="auth-modal__label admin-form-modal__full">
                {t("admin:properties.form.description")}
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
