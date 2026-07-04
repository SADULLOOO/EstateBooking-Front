import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PropertyViewer3DLazy } from "@/components/housing/PropertyViewer3DLazy";
import { formatCurrency } from "@/utils/formatCurrency";
import { resolveMediaUrl } from "@/utils/resolveMediaUrl";
import type { Building, Room } from "@/types/booking";

type GalleryTab = "building" | "rooms";

interface PropertyGalleryProps {
  building: Building;
}

export function PropertyGallery({ building }: PropertyGalleryProps) {
  const { t } = useTranslation("housing");
  const [tab, setTab] = useState<GalleryTab>("building");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const coverUrl = building.cover_image ? resolveMediaUrl(building.cover_image) : null;
  const selectedRoomModelUrl = selectedRoom?.model_3d_url ? resolveMediaUrl(selectedRoom.model_3d_url) : null;

  return (
    <motion.div
      className="vehicle-gallery glass-surface"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="property-gallery__tabs">
        <button type="button" className={tab === "building" ? "is-active" : ""} onClick={() => setTab("building")}>
          {t("gallery.buildingTab")}
        </button>
        <button type="button" className={tab === "rooms" ? "is-active" : ""} onClick={() => setTab("rooms")}>
          {t("gallery.roomsTab")}
        </button>
      </div>

      <div className="vehicle-gallery__stage">
        {tab === "building" ? (
          coverUrl ? (
            <img src={coverUrl} alt={building.name} className="property-gallery__cover" loading="lazy" />
          ) : (
            <div className="property-gallery__cover property-gallery__cover--empty" aria-hidden="true" />
          )
        ) : (
          <PropertyViewer3DLazy
            mode="rooms"
            rooms={building.rooms}
            selectedRoomId={selectedRoom?.id ?? null}
            onSelectRoom={setSelectedRoom}
          />
        )}
      </div>

      {tab === "rooms" && selectedRoom && (
        <div className="property-gallery__room-info glass-surface">
          <div>
            <strong>{selectedRoom.name}</strong>
            <span>
              {t("card.seats", { count: selectedRoom.capacity })} · {t("gallery.floor", { floor: selectedRoom.floor })}
            </span>
          </div>
          <span>
            {selectedRoom.booking_status === "available" ? t("status.roomAvailable") : t("status.roomBooked")}
            {selectedRoom.price_per_night
              ? ` · ${formatCurrency(selectedRoom.price_per_night)}${t("card.perNight")}`
              : ""}
          </span>
        </div>
      )}

      {tab === "rooms" && selectedRoom && (
        <div className="property-gallery__room-3d">
          <p>{t("gallery.roomModelLabel", { name: selectedRoom.name })}</p>
          <div className="vehicle-gallery__stage">
            {selectedRoomModelUrl ? (
              <PropertyViewer3DLazy mode="building" modelUrl={selectedRoomModelUrl} />
            ) : (
              <PropertyViewer3DLazy mode="room" room={selectedRoom} />
            )}
          </div>
        </div>
      )}

      {coverUrl && tab === "rooms" && (
        <div className="vehicle-gallery__thumbs">
          <img src={coverUrl} alt={building.name} loading="lazy" />
        </div>
      )}
    </motion.div>
  );
}
