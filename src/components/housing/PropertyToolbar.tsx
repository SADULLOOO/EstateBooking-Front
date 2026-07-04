import { useTranslation } from "react-i18next";
import type { HousingSortOption } from "@/hooks/useHousingCatalog";

interface PropertyToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: HousingSortOption;
  onSortChange: (value: HousingSortOption) => void;
  totalCount: number;
}

export function PropertyToolbar({ search, onSearchChange, sort, onSortChange, totalCount }: PropertyToolbarProps) {
  const { t } = useTranslation("housing");

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
        <select value={sort} onChange={(e) => onSortChange(e.target.value as HousingSortOption)}>
          <option value="price_asc">{t("toolbar.sortPriceAsc")}</option>
          <option value="price_desc">{t("toolbar.sortPriceDesc")}</option>
          <option value="rooms_desc">{t("toolbar.sortRoomsDesc")}</option>
          <option value="name_asc">{t("toolbar.sortName")}</option>
        </select>
      </div>
    </div>
  );
}
