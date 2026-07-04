import { useEffect, useState } from "react";

interface Options {
  /** Also disable on narrow viewports (appropriate for decorative scenes with a static fallback). */
  respectNarrowViewport?: boolean;
}

function computeShouldRender(respectNarrowViewport: boolean): boolean {
  if (typeof window === "undefined") return false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isNarrowViewport = respectNarrowViewport && window.innerWidth < 640;
  return !prefersReducedMotion && !isNarrowViewport;
}

export function useShouldRender3D({ respectNarrowViewport = false }: Options = {}): boolean {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(computeShouldRender(respectNarrowViewport));
  }, [respectNarrowViewport]);

  return canRender;
}
