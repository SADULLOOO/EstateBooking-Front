import { useRef, type MouseEvent, type ReactNode } from "react";
import { gsap } from "gsap";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
}

/**
 * Subtly pulls its content toward the cursor on hover, like Linear/Stripe buttons.
 * Uses GSAP so the snap-back on leave has proper elastic easing.
 */
export function MagneticWrapper({ children, strength = 0.25 }: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="magnetic-wrapper">
      {children}
    </div>
  );
}
