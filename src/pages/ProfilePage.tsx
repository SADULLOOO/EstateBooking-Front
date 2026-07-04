import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/AuthProvider";
import { authApi } from "@/api/auth.api";
import { useProfileStats } from "@/hooks/useProfileStats";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/app/router/routes";
import type { Profile } from "@/types/user";

export function ProfilePage() {
  const { t } = useTranslation("profile");
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const stats = useProfileStats();

  useEffect(() => {
    authApi.getProfile().then(({ data }) => setProfile(data));
  }, []);

  if (!user) return null;

  return (
    <section className="container vehicles-page profile-page">
      <div className="vehicles-page__header profile-page__header">
        <h1>{t("title")}</h1>
        <Link to={ROUTES.settings}>
          <Button variant="glass">{t("settingsButton")}</Button>
        </Link>
      </div>

      <ProfileHeader user={user} profile={profile} />

      {!stats.isLoading && (
        <ProfileStats
          bookingsCount={stats.bookingsCount}
          activeBookingsCount={stats.activeBookingsCount}
          completedBookingsCount={stats.completedBookingsCount}
          cancelledBookingsCount={stats.cancelledBookingsCount}
          reviewsCount={stats.reviewsCount}
        />
      )}
    </section>
  );
}
