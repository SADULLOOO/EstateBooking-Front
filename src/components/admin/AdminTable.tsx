import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

export interface AdminTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => number | string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyLabel?: string;
}

export function AdminTable<T>({ columns, rows, rowKey, onEdit, onDelete, emptyLabel }: AdminTableProps<T>) {
  const { t } = useTranslation(["admin", "common"]);

  if (rows.length === 0) {
    return <p className="vehicle-grid__empty">{emptyLabel ?? t("admin:table.empty")}</p>;
  }

  return (
    <div className="admin-table-wrapper glass-surface">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>{t("admin:table.actions")}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <motion.tr
              key={rowKey(row)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(index, 10) * 0.02 }}
            >
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
              {(onEdit || onDelete) && (
                <td className="admin-table__actions">
                  {onEdit && (
                    <Button variant="glass" onClick={() => onEdit(row)}>
                      {t("common:actions.edit")}
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" onClick={() => onDelete(row)}>
                      {t("common:actions.delete")}
                    </Button>
                  )}
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
