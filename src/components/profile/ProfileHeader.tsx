import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatDate";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import type { Profile, User } from "@/types/user";

interface ProfileHeaderProps {
  user: User;
  profile: Profile | null;
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const { t } = useTranslation("profile");

  const avatarUrl = profile?.avatar ? resolveMediaUrl(profile.avatar) : null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  const joined = formatDate(user.date_joined);

  return (
    <motion.div
      className="profile-header glass-surface"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="profile-header__avatar">
        {avatarUrl ? <img src={avatarUrl} alt={displayName} /> : displayName[0]?.toUpperCase()}
      </div>

      <div className="profile-header__info">
        <div className="vehicle-card__top-row">
          <h1>{displayName}</h1>
          <span className="vehicle-card__category">{t(`role.${user.role}`)}</span>
        </div>
        <p className="profile-header__username">@{user.username}</p>

        <dl className="profile-header__meta">
          {user.email && (
            <div>
              <dt>{t("meta.email")}</dt>
              <dd>{user.email}</dd>
            </div>
          )}
          <div>
            <dt>{t("meta.joinedSince")}</dt>
            <dd>{joined}</dd>
          </div>
          {profile?.address && (
            <div>
              <dt>{t("meta.address")}</dt>
              <dd>{profile.address}</dd>
            </div>
          )}
        </dl>
      </div>
    </motion.div>
  );
}
