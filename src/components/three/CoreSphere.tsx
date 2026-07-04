import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";

const CAR_COUNT = 5;
const ROAD_RADIUS = 1.6;
const ROAD_TILT = -0.24;
const PLANET_RADIUS = 1.3;

const dummy = new THREE.Object3D();

/** Real NASA-derived Earth maps from the official three.js example assets,
 * mirrored on jsDelivr (reliable production CDN, unlike raw.githack.com which
 * blocks datacenter IPs). Verified reachable — see r150 tag pin below. */
const EARTH_TEXTURE_BASE = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r150/examples/textures/planets/";
const EARTH_TEXTURES = {
  map: `${EARTH_TEXTURE_BASE}earth_atmos_2048.jpg`,
  specular: `${EARTH_TEXTURE_BASE}earth_specular_2048.jpg`,
  lights: `${EARTH_TEXTURE_BASE}earth_lights_2048.png`,
  normal: `${EARTH_TEXTURE_BASE}earth_normal_2048.jpg`,
  clouds: `${EARTH_TEXTURE_BASE}earth_clouds_1024.png`,
};

/** Loads the real Earth texture set (suspends until ready — must be rendered
 * inside a <Suspense> boundary, which HeroScene already provides). */
function usePlanetTextures() {
  const [map, specular, lights, normal, clouds] = useTexture([
    EARTH_TEXTURES.map,
    EARTH_TEXTURES.specular,
    EARTH_TEXTURES.lights,
    EARTH_TEXTURES.normal,
    EARTH_TEXTURES.clouds,
  ]);

  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    lights.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    clouds.anisotropy = 4;
  }, [map, lights, clouds]);

  return { map, specular, lights, normal, clouds };
}

function useWindowTexture(tint: string, rows = 14) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#050912";
    ctx.fillRect(0, 0, 64, 128);
    ctx.fillStyle = tint;
    const step = 128 / rows;
    for (let y = step * 0.3; y < 128; y += step) {
      for (let x = 4; x < 64; x += 8) {
        if (Math.random() > 0.3) ctx.fillRect(x, y, 4, step * 0.5);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 2);
    return texture;
  }, [tint, rows]);
}

function useFacadeTexture(base: string, band: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 64, 96);
    ctx.fillStyle = band;
    for (let y = 6; y < 96; y += 16) {
      ctx.fillRect(2, y, 60, 4);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1.5);
    return texture;
  }, [base, band]);
}

function IstiqlolTower({ position }: { position: [number, number, number] }) {
  const windowMap = useWindowTexture("#ffd98a", 16);
  return (
    <group position={position}>
      <RoundedBox args={[0.15, 0.46, 0.15]} radius={0.018} smoothness={4} position={[0, 0.23, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f4f2ea" emissive="#ffd98a" emissiveMap={windowMap ?? undefined} emissiveIntensity={0.85} roughness={0.22} metalness={0.2} clearcoat={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.105, 0.32, 0.105]} radius={0.014} smoothness={4} position={[0, 0.62, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f7f5ee" emissive="#ffd98a" emissiveMap={windowMap ?? undefined} emissiveIntensity={0.75} roughness={0.18} metalness={0.25} clearcoat={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.84, 0]} castShadow>
        <cylinderGeometry args={[0.019, 0.048, 0.16, 12]} />
        <meshStandardMaterial color="#e7e2d2" roughness={0.28} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0.955, 0]} castShadow>
        <coneGeometry args={[0.026, 0.1, 12]} />
        <meshStandardMaterial color="#f3d67a" metalness={0.88} roughness={0.12} emissive="#f3d67a" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color="#fff0bd" emissive="#ffdf8f" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.65, 0.1]} color="#ffd98a" intensity={0.5} distance={1.2} decay={2} />
    </group>
  );
}

function ParliamentBuilding({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const columns = useMemo(() => Array.from({ length: 7 }, (_, i) => -0.15 + (i / 6) * 0.3), []);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[0.38, 0.12, 0.15]} radius={0.011} smoothness={4} position={[0, 0.06, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#efe9d8" roughness={0.5} metalness={0.06} />
      </RoundedBox>
      {columns.map((x, i) => (
        <mesh key={i} position={[x, 0.135, 0.048]} castShadow>
          <cylinderGeometry args={[0.0075, 0.0075, 0.084, 8]} />
          <meshStandardMaterial color="#faf6ea" roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.185, 0]} castShadow>
        <coneGeometry args={[0.19, 0.05, 3]} />
        <meshStandardMaterial color="#efe9d8" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.225, 0]} castShadow>
        <sphereGeometry args={[0.07, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#d9c46b" metalness={0.6} roughness={0.22} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0.29, 0]}>
        <sphereGeometry args={[0.011, 8, 8]} />
        <meshStandardMaterial color="#fff0bd" emissive="#ffdf8f" emissiveIntensity={1.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

function BusinessTower({ position, height, tint }: { position: [number, number, number]; height: number; tint: string }) {
  const windowMap = useWindowTexture(tint, 18);
  return (
    <RoundedBox
      args={[0.115, height, 0.115]}
      radius={0.013}
      smoothness={4}
      position={[position[0], position[1] + height / 2, position[2]]}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color="#cdd8f2"
        emissive={tint}
        emissiveMap={windowMap ?? undefined}
        emissiveIntensity={0.7}
        roughness={0.12}
        metalness={0.4}
        clearcoat={1}
        clearcoatRoughness={0.15}
      />
    </RoundedBox>
  );
}

function HotelTower({ position }: { position: [number, number, number] }) {
  const segments = useMemo(
    () => [
      { r: 0.09, h: 0.14, y: 0.07 },
      { r: 0.075, h: 0.12, y: 0.2 },
      { r: 0.06, h: 0.11, y: 0.315 },
      { r: 0.045, h: 0.09, y: 0.415 },
    ],
    [],
  );
  const windowMap = useWindowTexture("#ffe3b0", 20);
  return (
    <group position={position}>
      {segments.map((seg, i) => (
        <mesh key={i} position={[0, seg.y, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[seg.r * 0.86, seg.r, seg.h, 20]} />
          <meshPhysicalMaterial
            color="#f0ede3"
            emissive="#ffe3b0"
            emissiveMap={windowMap ?? undefined}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.15}
            clearcoat={0.6}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.485, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.05, 10]} />
        <meshStandardMaterial color="#e7e2d2" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.515, 0]}>
        <sphereGeometry args={[0.013, 10, 10]} />
        <meshStandardMaterial color="#ff8f6b" emissive="#ff8f6b" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ResidentialBlock({ position, height, scale = 1 }: { position: [number, number, number]; height: number; scale?: number }) {
  const facade = useFacadeTexture("#e9ddc9", "#c9a86a");
  return (
    <RoundedBox
      args={[0.14 * scale, height, 0.12 * scale]}
      radius={0.012}
      smoothness={4}
      position={[position[0], position[1] + height / 2, position[2]]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial map={facade ?? undefined} color="#f2ecdd" roughness={0.6} metalness={0.05} />
    </RoundedBox>
  );
}

function TreeGrove({ position, count = 7, radius = 0.09 }: { position: [number, number, number]; count?: number; radius?: number }) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

  const transforms = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + i * 0.7;
        const r = radius * (0.4 + 0.6 * ((i * 37) % 10) / 10);
        const s = 0.75 + ((i * 53) % 10) / 10 * 0.5;
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, s };
      }),
    [count, radius],
  );

  useLayoutEffect(() => {
    transforms.forEach((t, i) => {
      dummy.position.set(t.x, 0.025 * t.s, t.z);
      dummy.scale.setScalar(t.s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      trunkRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(t.x, 0.07 * t.s, t.z);
      dummy.updateMatrix();
      canopyRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (trunkRef.current) trunkRef.current.instanceMatrix.needsUpdate = true;
    if (canopyRef.current) canopyRef.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  return (
    <group position={position}>
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[radius * 1.4, 24]} />
        <meshStandardMaterial color="#153a2c" roughness={0.9} />
      </mesh>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, count]} castShadow>
        <cylinderGeometry args={[0.006, 0.008, 0.05, 6]} />
        <meshStandardMaterial color="#5b4028" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[undefined, undefined, count]} castShadow>
        <icosahedronGeometry args={[0.045, 1]} />
        <meshStandardMaterial color="#2f8f52" emissive="#164529" emissiveIntensity={0.25} roughness={0.55} />
      </instancedMesh>
    </group>
  );
}

function LampPosts({ radius, count = 16 }: { radius: number; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      dummy.position.set(x, 0.03, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 0.062, z);
      dummy.updateMatrix();
      glowRef.current?.setMatrixAt(i, dummy.matrix);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    if (glowRef.current) glowRef.current.instanceMatrix.needsUpdate = true;
  }, [radius, count]);

  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.003, 0.004, 0.06, 6]} />
        <meshStandardMaterial color="#3a3f52" roughness={0.6} metalness={0.3} />
      </instancedMesh>
      <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#ffe3a8" emissive="#ffe3a8" emissiveIntensity={1.5} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function CityDistrict({ pointerRef }: { pointerRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const districtRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!districtRef.current) return;
    const targetX = -pointerRef.current.y * 0.06;
    const targetZ = pointerRef.current.x * 0.06;
    districtRef.current.rotation.x += (targetX - districtRef.current.rotation.x) * 0.04;
    districtRef.current.rotation.z += (targetZ - districtRef.current.rotation.z) * 0.04;
  });

  return (
    <group ref={districtRef} position={[0, 0.94, 0.149]} rotation={[-0.16, 0, 0]} scale={1.15}>
      <RoundedBox args={[1.15, 0.02, 0.62]} radius={0.01} smoothness={3} position={[0, -0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#101d3e" roughness={0.8} metalness={0.1} />
      </RoundedBox>

      <IstiqlolTower position={[0, 0, 0]} />
      <ParliamentBuilding position={[-0.44, 0, 0.1]} rotationY={0.3} />
      <BusinessTower position={[0.3, 0, 0.06]} height={0.4} tint="#8fb4ff" />
      <BusinessTower position={[0.44, 0, -0.12]} height={0.3} tint="#c79bff" />
      <HotelTower position={[-0.24, 0, -0.24]} />
      <ResidentialBlock position={[0.16, 0, 0.32]} height={0.2} scale={1.1} />
      <ResidentialBlock position={[0.02, 0, 0.34]} height={0.16} scale={0.9} />
      <ResidentialBlock position={[-0.5, 0, -0.02]} height={0.18} scale={1} />

      <TreeGrove position={[0.14, 0, 0.42]} count={7} radius={0.075} />
      <TreeGrove position={[-0.5, 0, -0.28]} count={6} radius={0.065} />
    </group>
  );
}

function RoadWithCars() {
  const carRefs = useRef<(THREE.Group | null)[]>([]);
  const phases = useMemo(() => Array.from({ length: CAR_COUNT }, (_, i) => (i / CAR_COUNT) * Math.PI * 2), []);
  const dashMap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 8;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#14161f";
    ctx.fillRect(0, 0, 256, 8);
    ctx.fillStyle = "rgba(244,214,122,0.6)";
    for (let x = 0; x < 256; x += 24) ctx.fillRect(x, 3, 12, 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(52, 1);
    return texture;
  }, []);

  useFrame((state) => {
    phases.forEach((phase, i) => {
      const car = carRefs.current[i];
      if (!car) return;
      const angle = phase + state.clock.elapsedTime * 0.4;
      car.position.set(Math.cos(angle) * ROAD_RADIUS, 0, Math.sin(angle) * ROAD_RADIUS);
      car.rotation.y = -angle + Math.PI / 2;
    });
  });

  return (
    <group rotation={[ROAD_TILT, 0, 0.04]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[ROAD_RADIUS - 0.05, ROAD_RADIUS + 0.05, 128]} />
        <meshStandardMaterial color="#181b26" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {dashMap && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.0015, 0]}>
          <ringGeometry args={[ROAD_RADIUS - 0.004, ROAD_RADIUS + 0.004, 128]} />
          <meshBasicMaterial map={dashMap} transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
      <LampPosts radius={ROAD_RADIUS + 0.075} count={14} />
      {phases.map((_, i) => (
        <group key={i} ref={(el) => (carRefs.current[i] = el)}>
          <RoundedBox args={[0.07, 0.026, 0.13]} radius={0.011} smoothness={3} position={[0, 0.02, 0]} castShadow>
            <meshPhysicalMaterial
              color={i % 2 === 0 ? "#e2453f" : "#f2f4f8"}
              emissive={i % 2 === 0 ? "#ff5c5c" : "#dfe8ff"}
              emissiveIntensity={0.3}
              clearcoat={1}
              clearcoatRoughness={0.15}
              metalness={0.4}
              roughness={0.22}
            />
          </RoundedBox>
          <RoundedBox args={[0.042, 0.019, 0.07]} radius={0.007} smoothness={3} position={[0, 0.04, -0.005]}>
            <meshPhysicalMaterial color="#0d1120" transparent opacity={0.82} roughness={0.08} clearcoat={1} />
          </RoundedBox>
          <mesh position={[-0.024, 0.018, 0.062]}>
            <sphereGeometry args={[0.006, 8, 8]} />
            <meshStandardMaterial color="#fff6d8" emissive="#fff6d8" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
          <mesh position={[0.024, 0.018, 0.062]}>
            <sphereGeometry args={[0.006, 8, 8]} />
            <meshStandardMaterial color="#fff6d8" emissive="#fff6d8" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
          <mesh position={[-0.024, 0.018, -0.062]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshStandardMaterial color="#ff3b3b" emissive="#ff3b3b" emissiveIntensity={2} toneMapped={false} />
          </mesh>
          <mesh position={[0.024, 0.018, -0.062]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshStandardMaterial color="#ff3b3b" emissive="#ff3b3b" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function CoreSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const { map, specular, lights, normal, clouds } = usePlanetTextures();
  const pointerRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (!hovered) groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += (Math.sin(state.clock.elapsedTime * 0.15) * 0.07 - groupRef.current.rotation.x) * 0.02;
    }
    if (cloudsRef.current && !hovered) {
      cloudsRef.current.rotation.y += delta * 0.19;
    }
    pointerRef.current.x = state.pointer.x;
    pointerRef.current.y = state.pointer.y;
    if (lightRef.current) {
      lightRef.current.position.x += (state.pointer.x * 2.2 - lightRef.current.position.x) * 0.04;
      lightRef.current.position.y += (2 + state.pointer.y * 1.2 - lightRef.current.position.y) * 0.04;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[2, 2, 3]} intensity={0.9} color="#fff2d6" distance={8} decay={1.6} />
      <pointLight position={[-2.4, -1.2, 2.6]} intensity={0.5} color="#9fd0ff" distance={7} decay={1.8} />
      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <mesh receiveShadow>
          <sphereGeometry args={[PLANET_RADIUS, 64, 64]} />
          <meshPhongMaterial
            map={map}
            specularMap={specular}
            specular={new THREE.Color("#3a3f55")}
            shininess={9}
            bumpMap={normal}
            bumpScale={0.015}
            emissiveMap={lights}
            emissive={new THREE.Color("#ffdf9e")}
            emissiveIntensity={1.1}
          />
        </mesh>

        <mesh ref={cloudsRef} scale={1.008}>
          <sphereGeometry args={[PLANET_RADIUS, 48, 48]} />
          <meshStandardMaterial alphaMap={clouds} transparent opacity={0.35} depthWrite={false} color="#ffffff" />
        </mesh>

        <CityDistrict pointerRef={pointerRef} />
        <RoadWithCars />

        <mesh visible>
          <sphereGeometry args={[1.85, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}
