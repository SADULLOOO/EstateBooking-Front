import { lazy, Suspense } from "react";
import { useShouldRender3D } from "@/hooks/useShouldRender3D";

const HeroScene = lazy(() => import("@/components/three/HeroScene").then((m) => ({ default: m.HeroScene })));

export function HeroSceneLazy() {
  const canRender = useShouldRender3D({ respectNarrowViewport: true });

  if (!canRender) {
    return <div className="hero-scene__fallback" aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className="hero-scene__fallback" aria-hidden="true" />}>
      <HeroScene />
    </Suspense>
  );
}
