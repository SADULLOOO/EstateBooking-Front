import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 14;
const RADIUS = 2.6;
const CONNECT_DISTANCE = 1.7;
const GLOW_RADIUS = 2.2;

function randomPointOnSphere(radius: number): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  );
}

export function Nodes() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const focus = useMemo(() => new THREE.Vector3(), []);

  const points = useMemo(
    () => Array.from({ length: NODE_COUNT }, () => randomPointOnSphere(RADIUS)),
    [],
  );

  const segments = useMemo(() => {
    const pairs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        if (points[i].distanceTo(points[j]) < CONNECT_DISTANCE) {
          pairs.push([points[i], points[j]]);
        }
      }
    }
    return pairs;
  }, [points]);

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(segments.length * 6);
    segments.forEach(([a, b], i) => {
      positions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [segments]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x += delta * 0.015;
    }

    // Approximate cursor "focus" point in the same local space the nodes live in —
    // cheap and close enough for a decorative glow, avoids a full raycast per frame.
    focus.set(state.pointer.x * RADIUS, state.pointer.y * RADIUS, 0);

    let totalGlow = 0;
    points.forEach((point, i) => {
      const mesh = nodeRefs.current[i];
      if (!mesh) return;
      const distance = point.distanceTo(focus);
      const glow = Math.max(0, 1 - distance / GLOW_RADIUS);
      totalGlow += glow;

      const material = mesh.material as THREE.MeshStandardMaterial;
      const targetIntensity = 0.4 + glow * 1.8;
      material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * 0.1;

      const targetScale = 1 + glow * 0.7;
      mesh.scale.x += (targetScale - mesh.scale.x) * 0.1;
      mesh.scale.y = mesh.scale.z = mesh.scale.x;
    });

    if (lineMaterialRef.current) {
      const avgGlow = totalGlow / points.length;
      const targetOpacity = 0.2 + avgGlow * 0.5;
      lineMaterialRef.current.opacity += (targetOpacity - lineMaterialRef.current.opacity) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial ref={lineMaterialRef} color="#8ba3ff" transparent opacity={0.2} />
      </lineSegments>
      {points.map((point, i) => (
        <mesh key={i} position={point} ref={(el) => (nodeRefs.current[i] = el)}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#b98bff" emissive="#b98bff" emissiveIntensity={0.4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
