import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { Vehicle, VehicleCategory } from "@/types/booking";

interface VehicleFormModalProps {
  vehicle: Vehicle | null;
  categories: VehicleCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function VehicleFormModal({ vehicle, categories, isOpen, onClose, onSubmit }: VehicleFormModalProps) {
  const { t } = useTranslation(["admin", "common", "vehicles"]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState("4");
  const [categoryId, setCategoryId] = useState<string>("");
  const [transmission, setTransmission] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("0");
  const [pricePerDay, setPricePerDay] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(vehicle?.name ?? "");
    setBrand(vehicle?.brand ?? "");
    setPlateNumber(vehicle?.plate_number ?? "");
    setCapacity(String(vehicle?.capacity ?? 4));
    setCategoryId(vehicle?.category ? String(vehicle.category.id) : categories[0] ? String(categories[0].id) : "");
    setTransmission(vehicle?.transmission ?? "");
    setLocation(vehicle?.location ?? "");
    setPricePerHour(vehicle?.price_per_hour ?? "0");
    setPricePerDay(vehicle?.price_per_day ?? "");
    setPhoto(null);
    setError(null);
  }, [isOpen, vehicle, categories]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("plate_number", plateNumber);
      formData.append("capacity", capacity);
      if (categoryId) formData.append("category_id", categoryId);
      formData.append("transmission", transmission);
      formData.append("location", location);
      formData.append("price_per_hour", pricePerHour);
      if (pricePerDay) formData.append("price_per_day", pricePerDay);
      if (photo) formData.append("photo", photo);

      await onSubmit(formData);
      onClose();
    } catch {
      setError(t("admin:vehicles.form.saveError"));
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
            <h3 className="auth-modal__title">{vehicle ? t("admin:vehicles.form.editTitle") : t("admin:vehicles.form.createTitle")}</h3>

            <form onSubmit={handleSubmit} className="auth-modal__form admin-form-modal__grid">
              <label className="auth-modal__label">
                {t("admin:vehicles.form.name")}
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.brand")}
                <input value={brand} onChange={(e) => setBrand(e.target.value)} />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.plateNumber")}
                <input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.capacity")}
                <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.category")}
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.transmission")}
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="">{t("admin:vehicles.form.transmissionUnset")}</option>
                  <option value="manual">{t("vehicles:transmission.manual")}</option>
                  <option value="automatic">{t("vehicles:transmission.automatic")}</option>
                </select>
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.location")}
                <input value={location} onChange={(e) => setLocation(e.target.value)} />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.pricePerHour")}
                <input type="number" min={0} value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} required />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.pricePerDay")}
                <input type="number" min={0} value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />
              </label>
              <label className="auth-modal__label">
                {t("admin:vehicles.form.photo")}
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
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
