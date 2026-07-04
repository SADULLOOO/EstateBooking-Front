import { useTranslation } from "react-i18next";
import { useTransmissionLabel } from "@/components/vehicles/vehicleLabels";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Vehicle } from "@/types/booking";

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const { t } = useTranslation("vehicles");
  const transmissionLabel = useTransmissionLabel();

  const items = [
    { label: t("specs.brand"), value: vehicle.brand || "—" },
    { label: t("specs.class"), value: vehicle.category?.name ?? "—" },
    { label: t("specs.capacity"), value: t("card.seats", { count: vehicle.capacity }) },
    { label: t("specs.plateNumber"), value: vehicle.plate_number },
    {
      label: t("specs.transmission"),
      value: vehicle.transmission
        ? transmissionLabel(vehicle.transmission as Exclude<typeof vehicle.transmission, "">)
        : "—",
    },
    { label: t("specs.location"), value: vehicle.location || "—" },
    { label: t("specs.pricePerHour"), value: formatCurrency(vehicle.price_per_hour) },
    {
      label: t("specs.pricePerDay"),
      value: vehicle.price_per_day ? formatCurrency(vehicle.price_per_day) : "—",
    },
    {
      label: t("specs.status"),
      value: vehicle.booking_status === "available" ? t("status.available") : t("status.booked"),
    },
  ];

  return (
    <section className="vehicle-detail-section">
      <h2>{t("specs.title")}</h2>
      <div className="vehicle-specs-grid">
        {items.map((item) => (
          <div key={item.label} className="vehicle-specs-grid__item glass-surface">
            <span className="vehicle-specs-grid__label">{item.label}</span>
            <span className="vehicle-specs-grid__value">{item.value}</span>
          </div>
        ))}
      </div>

      {vehicle.category?.description && (
        <p className="vehicle-detail-section__text">{vehicle.category.description}</p>
      )}
    </section>
  );
}
