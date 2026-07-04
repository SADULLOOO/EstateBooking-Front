import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

interface AdminToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  totalCount: number;
}

export function AdminToolbar({ search, onSearchChange, onAdd, addLabel, totalCount }: AdminToolbarProps) {
  const { t } = useTranslation("admin");

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
        <span className="vehicle-toolbar__count">{t("toolbar.recordsCount", { count: totalCount })}</span>
        {onAdd && (
          <Button variant="primary" onClick={onAdd}>
            {addLabel ?? t("toolbar.addDefault")}
          </Button>
        )}
      </div>
    </div>
  );
}
