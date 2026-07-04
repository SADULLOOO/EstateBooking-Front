import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { authApi } from "@/api/auth.api";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/app/router/routes";
import type { Profile } from "@/types/user";

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export function SettingsPage() {
  const { t } = useTranslation(["settings", "common"]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const { toastsEnabled, setToastsEnabled } = useNotificationPreferences();

  useEffect(() => {
    authApi.getProfile().then(({ data }) => {
      setProfile(data);
      setAddress(data.address ?? "");
    });
  }, []);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatarFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const formData = new FormData();
      formData.append("address", address);
      if (avatarFile) formData.append("avatar", avatarFile);

      const { data } = await authApi.updateProfile(formData);
      setProfile(data);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="container vehicles-page settings-page">
      <div className="vehicles-page__header profile-page__header">
        <h1>{t("title")}</h1>
        <Link to={ROUTES.profile}>
          <Button variant="glass">{t("backButton")}</Button>
        </Link>
      </div>

      <div className="settings-page__grid">
        <motion.form className="settings-card glass-surface" onSubmit={handleSubmit} {...cardMotion}>
          <h2>{t("profileCard.title")}</h2>
          <p className="vehicle-detail-section__text">{t("profileCard.description")}</p>

          <label className="auth-modal__label">
            {t("profileCard.address")}
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>

          <label className="auth-modal__label">
            {t("profileCard.avatar")}
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>

          {profile?.avatar && !avatarFile && (
            <p className="vehicle-detail-section__text">{t("profileCard.avatarAlreadyUploaded")}</p>
          )}

          {status === "saved" && <p className="auth-modal__success">{t("profileCard.saved")}</p>}
          {status === "error" && <p className="auth-modal__error">{t("profileCard.saveError")}</p>}

          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? t("common:actions.saving") : t("common:actions.save")}
          </Button>
        </motion.form>

        <motion.div className="settings-card glass-surface" {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.05 }}>
          <h2>{t("languageCard.title")}</h2>
          <p className="vehicle-detail-section__text">{t("languageCard.description")}</p>
          <LanguageSwitcher />
        </motion.div>

        <motion.div className="settings-card glass-surface" {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.1 }}>
          <h2>{t("notificationsCard.title")}</h2>
          <p className="vehicle-detail-section__text">{t("notificationsCard.description")}</p>
          <label className="vehicle-filters__checkbox">
            <input
              type="checkbox"
              checked={toastsEnabled}
              onChange={(e) => setToastsEnabled(e.target.checked)}
            />
            {t("notificationsCard.toggleLabel")}
          </label>
        </motion.div>
      </div>
    </section>
  );
}
