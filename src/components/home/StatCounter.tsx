import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface StatCounterProps {
  value: number;
  label: string;
}

export function StatCounter({ value, label }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const counter = { n: 0 };
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(counter.n).toString();
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <div className="stat-counter">
      <span ref={ref} className="stat-counter__value">
        0
      </span>
      <span className="stat-counter__label">{label}</span>
    </div>
  );
}
