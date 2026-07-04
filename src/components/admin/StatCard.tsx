import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  index?: number;
}

export function StatCard({ label, value, icon, index = 0 }: StatCardProps) {
  return (
    <motion.div
      className="admin-stat-card glass-surface"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <span className="admin-stat-card__icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </motion.div>
  );
}
