import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { CoreSphere } from "@/components/three/CoreSphere";
import { OrbitalRings } from "@/components/three/OrbitalRings";
import { Nodes } from "@/components/three/Nodes";
import { PointerTiltRig } from "@/components/three/PointerTiltRig";

export function HeroScene() {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 42 }}
    >
      <ambientLight intensity={0.45} color="#4a3ea8" />
      <directionalLight
        position={[3, 4, 4]}
        intensity={1.1}
        color="#dce6ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={9}
        shadow-camera-left={-2.4}
        shadow-camera-right={2.4}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-2.4}
      />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6d8bff" />
      <pointLight position={[-5, -3, -5]} intensity={0.7} color="#b98bff" />

      <Suspense fallback={null}>
        <Stars radius={40} depth={30} count={1500} factor={2.2} saturation={0} fade speed={0.5} />
        <PointerTiltRig strength={0.3}>
          <CoreSphere />
          <OrbitalRings />
          <Nodes />
          <Sparkles count={60} scale={7} size={1.5} speed={0.3} opacity={0.5} color="#b98bff" />
        </PointerTiltRig>
      </Suspense>
    </Canvas>
  );
}
