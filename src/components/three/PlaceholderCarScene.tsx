import { CoreSphere } from "@/components/three/CoreSphere";
import { OrbitalRings } from "@/components/three/OrbitalRings";
import { Nodes } from "@/components/three/Nodes";

export function PlaceholderCarScene() {
  return (
    <group scale={0.9}>
      <CoreSphere />
      <OrbitalRings />
      <Nodes />
    </group>
  );
}
