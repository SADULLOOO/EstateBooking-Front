import { useTranslation } from "react-i18next";
import type { BuildingOwner } from "@/types/booking";

interface PropertyOwnerInfoProps {
  owner: BuildingOwner | null;
}

export function PropertyOwnerInfo({ owner }: PropertyOwnerInfoProps) {
  const { t } = useTranslation("housing");

  return (
    <section className="vehicle-detail-section">
      <h2>{t("owner.title")}</h2>
      {owner ? (
        <div className="vehicle-specs-grid__item glass-surface property-owner-card">
          <div className="navbar__avatar">{owner.username[0]?.toUpperCase() ?? "V"}</div>
          <div>
            <strong>{owner.username}</strong>
            {owner.phone_number && <p>{owner.phone_number}</p>}
          </div>
        </div>
      ) : (
        <p className="vehicle-detail-section__text">{t("owner.notAssigned")}</p>
      )}
    </section>
  );
}
