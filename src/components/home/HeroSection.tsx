import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { StatCounter } from "@/components/home/StatCounter";
import { HeroSceneLazy } from "@/components/three/HeroSceneLazy";
import { useServiceStats } from "@/hooks/useServiceStats";
import { ROUTES } from "@/app/router/routes";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function HeroSection() {
  const { t } = useTranslation(["hero", "common"]);
  const navigate = useNavigate();
  const stats = useServiceStats();

  return (
    <section className="hero">
      <div className="hero__scene">
        <HeroSceneLazy />
      </div>

      <div className="container hero__content">
        <motion.p className="hero__eyebrow" custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          {t("common:appName")} · {t("hero:eyebrow")}
        </motion.p>

        <motion.h1 className="hero__title" custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          {t("hero:titleLine1")}
          <br />
          {t("hero:titleLine2")}
        </motion.h1>

        <motion.p className="hero__subtitle" custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          {t("hero:subtitle")}
        </motion.p>

        <motion.div className="hero__actions" custom={3} initial="hidden" animate="visible" variants={fadeUp}>
          <MagneticWrapper>
            <Button variant="primary" onClick={() => navigate(ROUTES.vehicles)}>
              {t("hero:findVehicle")}
            </Button>
          </MagneticWrapper>
          <MagneticWrapper>
            <Button variant="glass" onClick={() => navigate(ROUTES.housing)}>
              {t("hero:findHousing")}
            </Button>
          </MagneticWrapper>
        </motion.div>

        <motion.div className="hero__stats" custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <StatCounter value={stats.buildingsCount} label={t("hero:stats.buildings")} />
          <StatCounter value={stats.roomsCount} label={t("hero:stats.rooms")} />
          <StatCounter value={stats.vehiclesCount} label={t("hero:stats.vehicles")} />
        </motion.div>
      </div>
    </section>
  );
}
