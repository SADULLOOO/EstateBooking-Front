import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RINGS = [
  { radius: 3.2, tube: 0.006, rotation: [Math.PI / 2.2, 0, 0], speed: 0.05, color: "#6d8bff", baseOpacity: 0.35 },
  { radius: 3.6, tube: 0.005, rotation: [Math.PI / 3, Math.PI / 4, 0], speed: -0.035, color: "#b98bff", baseOpacity: 0.35 },
  { radius: 4.0, tube: 0.004, rotation: [Math.PI / 5, -Math.PI / 6, Math.PI / 8], speed: 0.025, color: "#6d8bff", baseOpacity: 0.35 },
] as const;

function Ring({ radius, tube, rotation, speed, color, baseOpacity }: (typeof RINGS)[number]) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.z += delta * speed;
    if (materialRef.current) {
      const pointerMagnitude = Math.min(1, Math.hypot(state.pointer.x, state.pointer.y));
      const target = baseOpacity + pointerMagnitude * 0.25;
      materialRef.current.opacity += (target - materialRef.current.opacity) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={rotation as unknown as [number, number, number]}>
      <torusGeometry args={[radius, tube, 16, 128]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent opacity={baseOpacity} />
    </mesh>
  );
}

export function OrbitalRings() {
  return (
    <group>
      {RINGS.map((ring, i) => (
        <Ring key={i} {...ring} />
      ))}
    </group>
  );
}
