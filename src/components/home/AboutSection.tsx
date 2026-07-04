import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FEATURE_KEYS = ["realtime", "chat", "variety", "multilingual"] as const;

export function AboutSection() {
  const { t } = useTranslation("about");

  return (
    <section className="container about-section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="about-section__intro"
      >
        <h2>{t("title")}</h2>
        <p>{t("text")}</p>
      </motion.div>

      <div className="about-section__grid">
        {FEATURE_KEYS.map((key, index) => (
          <motion.div
            key={key}
            className="rental-terms-grid__item glass-surface"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
          >
            <h3>{t(`features.${key}.title`)}</h3>
            <p>{t(`features.${key}.text`)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
