import { useMemo } from "react";
import { Text } from "@react-three/drei";
import type { Room } from "@/types/booking";

interface RoomBoxProps {
  room: Room;
  position: [number, number, number];
  size: number;
  isSelected: boolean;
  onSelect: () => void;
}

function RoomBox({ room, position, size, isSelected, onSelect }: RoomBoxProps) {
  const color = room.booking_status === "available" ? "#6fe3a0" : "#ff8f8f";

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        scale={isSelected ? 1.08 : 1}
      >
        <boxGeometry args={[size, 0.6, size]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.6 : 0.25}
          transparent
          opacity={0.85}
        />
      </mesh>
      <Text position={[0, 0.5, 0]} fontSize={0.18} color="#ffffff" anchorX="center" anchorY="middle">
        {room.name}
      </Text>
    </group>
  );
}

interface RoomLayoutSceneProps {
  rooms: Room[];
  selectedRoomId: number | null;
  onSelectRoom: (room: Room) => void;
}

export function RoomLayoutScene({ rooms, selectedRoomId, onSelectRoom }: RoomLayoutSceneProps) {
  const layout = useMemo(() => {
    const capacities = rooms.map((r) => r.capacity);
    const minCap = Math.min(...capacities);
    const maxCap = Math.max(...capacities);

    const byFloor = new Map<number, Room[]>();
    rooms.forEach((room) => {
      const list = byFloor.get(room.floor) ?? [];
      list.push(room);
      byFloor.set(room.floor, list);
    });

    const positions: { room: Room; position: [number, number, number]; size: number }[] = [];
    Array.from(byFloor.entries())
      .sort(([a], [b]) => a - b)
      .forEach(([, floorRooms], floorIndex) => {
        floorRooms.forEach((room, roomIndex) => {
          const spread = (roomIndex - (floorRooms.length - 1) / 2) * 1.6;
          const size = maxCap === minCap ? 1 : 0.7 + ((room.capacity - minCap) / (maxCap - minCap)) * 0.9;
          positions.push({
            room,
            position: [spread, floorIndex * 1.1, 0],
            size,
          });
        });
      });

    return positions;
  }, [rooms]);

  return (
    <group>
      {layout.map(({ room, position, size }) => (
        <RoomBox
          key={room.id}
          room={room}
          position={position}
          size={size}
          isSelected={selectedRoomId === room.id}
          onSelect={() => onSelectRoom(room)}
        />
      ))}
    </group>
  );
}
