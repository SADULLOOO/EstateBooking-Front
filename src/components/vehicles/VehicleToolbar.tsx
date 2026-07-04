import { useTranslation } from "react-i18next";
import type { SortOption } from "@/hooks/useVehiclesCatalog";

interface VehicleToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  totalCount: number;
}

export function VehicleToolbar({ search, onSearchChange, sort, onSortChange, totalCount }: VehicleToolbarProps) {
  const { t } = useTranslation("vehicles");

  return (
    <div className="vehicle-toolbar">
      <input
        type="search"
        className="vehicle-toolbar__search"
        placeholder={t("toolbar.searchPlaceholder")}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="vehicle-toolbar__meta">
        <span className="vehicle-toolbar__count">{t("toolbar.count", { count: totalCount })}</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value as SortOption)}>
          <option value="price_asc">{t("toolbar.sortPriceAsc")}</option>
          <option value="price_desc">{t("toolbar.sortPriceDesc")}</option>
          <option value="rating_desc">{t("toolbar.sortRating")}</option>
          <option value="name_asc">{t("toolbar.sortName")}</option>
        </select>
      </div>
    </div>
  );
}
