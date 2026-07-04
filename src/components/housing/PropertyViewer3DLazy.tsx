import { lazy, Suspense } from "react";
import { useShouldRender3D } from "@/hooks/useShouldRender3D";
import type { Room } from "@/types/booking";

const PropertyViewer3D = lazy(() =>
  import("@/components/housing/PropertyViewer3D").then((m) => ({ default: m.PropertyViewer3D })),
);

type PropertyViewer3DLazyProps =
  | { mode: "building"; modelUrl: string | null }
  | { mode: "room"; room: Room }
  | { mode: "rooms"; rooms: Room[]; selectedRoomId: number | null; onSelectRoom: (room: Room) => void };

export function PropertyViewer3DLazy(props: PropertyViewer3DLazyProps) {
  const canRender = useShouldRender3D();

  if (!canRender) {
    return <div className="hero-scene__fallback" aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className="hero-scene__fallback" aria-hidden="true" />}>
      <PropertyViewer3D {...props} />
    </Suspense>
  );
}
