import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Room } from "@/types/booking";

const WALL_COLOR = "#e9ddc9";
const FLOOR_COLOR = "#2a3350";
const WOOD_COLOR = "#8a5a34";
const FABRIC_COLOR = "#c94f4f";

function roomFootprint(capacity: number) {
  const scale = Math.max(1, Math.sqrt(Math.max(capacity, 1)) * 0.65);
  return { width: 2.4 * scale, depth: 2.1 * scale, height: 1.7 };
}

function ConferenceFurniture({ width }: { width: number }) {
  const tableLength = width * 0.62;
  const chairCount = Math.max(4, Math.min(10, Math.round(tableLength / 0.22)));
  const chairs = useMemo(
    () =>
      Array.from({ length: chairCount }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const t = Math.floor(i / 2) / Math.ceil(chairCount / 2 - 1 || 1);
        const x = -tableLength / 2 + t * tableLength;
        return { x, z: side * 0.32 };
      }),
    [chairCount, tableLength],
  );

  return (
    <group>
      <RoundedBox args={[tableLength, 0.03, 0.5]} radius={0.008} smoothness={3} position={[0, 0.28, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.35} metalness={0.15} />
      </RoundedBox>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}-${sz}`} position={[sx * (tableLength / 2 - 0.03), 0.14, sz * 0.22]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <meshStandardMaterial color="#3a3f52" metalness={0.4} roughness={0.4} />
          </mesh>
        )),
      )}
      {chairs.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]} rotation={[0, c.z > 0 ? Math.PI : 0, 0]}>
          <RoundedBox args={[0.16, 0.02, 0.16]} radius={0.006} position={[0, 0.11, 0]} castShadow>
            <meshStandardMaterial color="#2f3448" roughness={0.6} />
          </RoundedBox>
          <RoundedBox args={[0.16, 0.16, 0.02]} radius={0.006} position={[0, 0.19, -0.08]} castShadow>
            <meshStandardMaterial color="#2f3448" roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.11, 6]} />
            <meshStandardMaterial color="#1c1f2c" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SuiteFurniture({ width, depth }: { width: number; depth: number }) {
  return (
    <group position={[width * 0.18, 0, depth * 0.12]}>
      <RoundedBox args={[Math.min(1, width * 0.4), 0.22, Math.min(0.7, depth * 0.42)]} radius={0.02} smoothness={4} position={[0, 0.11, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f2ede1" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[Math.min(0.95, width * 0.38), 0.1, Math.min(0.62, depth * 0.36)]} radius={0.018} smoothness={4} position={[0, 0.27, 0]} castShadow>
        <meshStandardMaterial color={FABRIC_COLOR} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[Math.min(0.95, width * 0.38), 0.22, 0.05]} radius={0.02} position={[0, 0.35, -Math.min(0.3, depth * 0.18)]} castShadow>
        <meshStandardMaterial color="#f2ede1" roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.24, 0.24, 0.24]} radius={0.012} position={[0.7, 0.12, -0.25]} castShadow>
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0.7, 0.26, -0.25]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffe3a8" emissive="#ffe3a8" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <RoundedBox args={[0.7, 0.6, 0.3]} radius={0.015} position={[-width * 0.32, 0.3, depth * 0.28]} castShadow receiveShadow>
        <meshStandardMaterial color="#efe6d4" roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

function DeskFurniture({ width, depth }: { width: number; depth: number }) {
  return (
    <group position={[-width * 0.22, 0, -depth * 0.22]}>
      <RoundedBox args={[0.62, 0.025, 0.34]} radius={0.008} position={[0, 0.28, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.4} metalness={0.1} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.27, 0.14, 0.12]} castShadow>
          <boxGeometry args={[0.02, 0.28, 0.02]} />
          <meshStandardMaterial color="#3a3f52" />
        </mesh>
      ))}
      <RoundedBox args={[0.18, 0.02, 0.18]} radius={0.006} position={[0, 0.11, 0.35]} castShadow>
        <meshStandardMaterial color="#2f3448" roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.2, 0.02]} radius={0.006} position={[0, 0.2, 0.43]} castShadow>
        <meshStandardMaterial color="#2f3448" roughness={0.6} />
      </RoundedBox>

      <RoundedBox args={[Math.min(1.2, width * 0.5), 0.2, Math.min(0.85, depth * 0.5)]} radius={0.02} position={[width * 0.55, 0.1, depth * 0.35]} castShadow receiveShadow>
        <meshStandardMaterial color="#f2ede1" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[Math.min(1.1, width * 0.46), 0.08, Math.min(0.75, depth * 0.44)]} radius={0.016} position={[width * 0.55, 0.24, depth * 0.35]} castShadow>
        <meshStandardMaterial color="#dfe4f2" roughness={0.8} />
      </RoundedBox>
    </group>
  );
}

function ProjectorScreen({ width, height }: { width: number; height: number }) {
  return (
    <group position={[0, height - 0.02, -0.02]}>
      <mesh>
        <planeGeometry args={[Math.min(1.4, width * 0.55), 0.7]} />
        <meshStandardMaterial color="#f5f7ff" emissive="#8fb4ff" emissiveIntensity={0.35} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.42, 0.9]}>
        <boxGeometry args={[0.16, 0.06, 0.1]} />
        <meshStandardMaterial color="#20232f" roughness={0.4} metalness={0.3} />
      </mesh>
      <spotLight position={[0, 0.4, 0.9]} target-position={[0, height - 0.4, -0.02]} angle={0.5} intensity={0.6} color="#cfe0ff" penumbra={0.6} />
    </group>
  );
}

interface RoomModelSceneProps {
  room: Room;
}

/** A procedurally furnished room, generated from the room's own data
 * (category, capacity, projector) — no external 3D asset required. */
export function RoomModelScene({ room }: RoomModelSceneProps) {
  const { width, depth, height } = useMemo(() => roomFootprint(room.capacity), [room.capacity]);
  const categoryName = (room.category?.name ?? "").toLowerCase();
  const isConference = /перегово|конференц|meeting|conference/.test(categoryName);
  const isSuite = /люкс|suite|lux/.test(categoryName);

  return (
    <group position={[0, -0.85, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>

      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[width * 0.15, height * 0.55, -depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.32, height * 0.42]} />
        <meshStandardMaterial color="#bcd4ff" emissive="#bcd4ff" emissiveIntensity={0.25} transparent opacity={0.5} />
      </mesh>

      {isConference ? (
        <ConferenceFurniture width={width} />
      ) : isSuite ? (
        <SuiteFurniture width={width} depth={depth} />
      ) : (
        <DeskFurniture width={width} depth={depth} />
      )}

      {room.has_projector && <ProjectorScreen width={width} height={height} />}

      <pointLight position={[0, height * 0.92, 0]} intensity={0.7} color="#fff2d6" distance={width + depth} decay={1.6} />
    </group>
  );
}
