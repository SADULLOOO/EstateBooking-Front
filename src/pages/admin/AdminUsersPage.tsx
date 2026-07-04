import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usersApi } from "@/api/users.api";
import { useAuth } from "@/app/providers/AuthProvider";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatDate } from "@/utils/formatDate";
import type { User, UserRole } from "@/types/user";

const ROLE_OPTIONS: UserRole[] = ["user", "moderator", "admin"];

export function AdminUsersPage() {
  const { t } = useTranslation(["admin", "common", "profile"]);
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const load = () => {
    setIsLoading(true);
    usersApi.list().then(({ data }) => setUsers(data)).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const handleRoleChange = async (user: User, role: UserRole) => {
    await usersApi.changeRole(user.id, role);
    load();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await usersApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const columns: AdminTableColumn<User>[] = [
    { key: "username", label: t("admin:users.columns.username"), render: (u) => u.username },
    { key: "email", label: t("admin:users.columns.email"), render: (u) => u.email || "—" },
    { key: "staff", label: t("admin:users.columns.staff"), render: (u) => (u.is_staff ? t("common:actions.yes") : t("common:actions.no")) },
    {
      key: "role",
      label: t("admin:users.columns.role"),
      render: (u) => (
        <select value={u.role} onChange={(e) => void handleRoleChange(u, e.target.value as UserRole)}>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {t(`profile:role.${role}`)}
            </option>
          ))}
        </select>
      ),
    },
    { key: "joined", label: t("admin:users.columns.joined"), render: (u) => formatDate(u.date_joined) },
  ];

  const deletableUsers = filtered.filter((u) => u.id !== currentUser?.id);

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:users.title")}</h1>
        <p>{t("admin:users.subtitle")}</p>
      </div>

      <AdminToolbar search={search} onSearchChange={setSearch} totalCount={filtered.length} />

      {isLoading ? (
        <p className="vehicles-page__status">{t("common:loading")}</p>
      ) : (
        <AdminTable
          columns={columns}
          rows={filtered}
          rowKey={(u) => u.id}
          onDelete={(u) => (deletableUsers.includes(u) ? setDeleteTarget(u) : undefined)}
        />
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={t("admin:users.confirmDelete", { username: deleteTarget?.username })}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
