import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GltfModel } from "@/components/three/GltfModel";
import { PlaceholderCarScene } from "@/components/three/PlaceholderCarScene";
import { RoomLayoutScene } from "@/components/three/RoomLayoutScene";
import { RoomModelScene } from "@/components/three/RoomModelScene";
import type { Room } from "@/types/booking";

interface BuildingModeProps {
  mode: "building";
  modelUrl: string | null;
}

interface RoomsModeProps {
  mode: "rooms";
  rooms: Room[];
  selectedRoomId: number | null;
  onSelectRoom: (room: Room) => void;
}

interface RoomModeProps {
  mode: "room";
  room: Room;
}

type PropertyViewer3DProps = BuildingModeProps | RoomsModeProps | RoomModeProps;

export function PropertyViewer3D(props: PropertyViewer3DProps) {
  return (
    <div className="vehicle-viewer3d">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [4, 3, 6], fov: 42 }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 6, 5]} intensity={1.4} color="#6d8bff" />
        <pointLight position={[-5, -2, -4]} intensity={0.9} color="#b98bff" />

        <Suspense fallback={null}>
          {props.mode === "building" ? (
            props.modelUrl ? (
              <GltfModel url={props.modelUrl} fallback={<PlaceholderCarScene />} />
            ) : (
              <PlaceholderCarScene />
            )
          ) : props.mode === "room" ? (
            <RoomModelScene room={props.room} />
          ) : (
            <RoomLayoutScene
              rooms={props.rooms}
              selectedRoomId={props.selectedRoomId}
              onSelectRoom={props.onSelectRoom}
            />
          )}
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          autoRotate={props.mode === "building" || props.mode === "room"}
          autoRotateSpeed={0.6}
          minDistance={2}
          maxDistance={14}
        />
      </Canvas>
    </div>
  );
}
