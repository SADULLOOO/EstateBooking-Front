import { motion } from "framer-motion";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";

interface VehicleGalleryProps {
  name: string;
  photo: string | null;
}

export function VehicleGallery({ name, photo }: VehicleGalleryProps) {
  const photoUrl = photo ? resolveMediaUrl(photo) : null;

  return (
    <motion.div
      className="vehicle-gallery glass-surface"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="vehicle-gallery__stage">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="property-gallery__cover" loading="lazy" />
        ) : (
          <div className="property-gallery__cover property-gallery__cover--empty" aria-hidden="true" />
        )}
      </div>
    </motion.div>
  );
}
