import { useTranslation } from "react-i18next";
import { useAdminOverviewStats } from "@/hooks/useAdminOverviewStats";
import { StatCard } from "@/components/admin/StatCard";

export function AdminOverviewPage() {
  const { t } = useTranslation(["admin", "common"]);
  const stats = useAdminOverviewStats();

  return (
    <section className="admin-page">
      <div className="vehicles-page__header">
        <h1>{t("admin:overview.title")}</h1>
        <p>{t("admin:overview.subtitle")}</p>
      </div>

      {stats.isLoading ? (
        <p className="vehicles-page__status">{t("common:loading")}</p>
      ) : (
        <div className="admin-stats-grid">
          <StatCard icon="🚗" label={t("admin:overview.vehicles")} value={stats.vehiclesCount} index={0} />
          <StatCard icon="🏢" label={t("admin:overview.properties")} value={stats.buildingsCount} index={1} />
          <StatCard icon="👥" label={t("admin:overview.users")} value={stats.usersCount} index={2} />
          <StatCard icon="📅" label={t("admin:overview.activeBookings")} value={stats.activeBookingsCount} index={3} />
          <StatCard icon="💬" label={t("admin:overview.newMessages")} value={stats.newMessagesCount} index={4} />
          <StatCard icon="🔔" label={t("admin:overview.newNotifications")} value={stats.newNotificationsCount} index={5} />
        </div>
      )}
    </section>
  );
}
