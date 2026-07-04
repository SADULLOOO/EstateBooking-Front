import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

interface PointerTiltRigProps {
  children: ReactNode;
  strength?: number;
}

/**
 * Wraps 3D content and gently tilts it toward the pointer position.
 * Lerped (not instant) so the motion always reads as smooth, never snappy.
 */
export function PointerTiltRig({ children, strength = 0.25 }: PointerTiltRigProps) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const targetY = state.pointer.x * strength;
    const targetX = -state.pointer.y * strength;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.04;
  });

  return <group ref={ref}>{children}</group>;
}
