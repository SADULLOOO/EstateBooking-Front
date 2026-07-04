import type { Room, Vehicle } from "@/types/booking";

export type PriceUnit = "days" | "hours" | "nights";

interface PriceEstimate {
  amount: number;
  unit: PriceUnit;
  unitCount: number;
}

function durationHours(startTime: string, endTime: string): number | null {
  if (!startTime || !endTime) return null;
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  return (end - start) / (1000 * 60 * 60);
}

export function estimateVehiclePrice(
  vehicle: Vehicle,
  startTime: string,
  endTime: string,
): PriceEstimate | null {
  const hours = durationHours(startTime, endTime);
  if (hours === null) return null;

  if (vehicle.price_per_day && hours >= 24) {
    const days = Math.ceil(hours / 24);
    return { amount: days * Number(vehicle.price_per_day), unit: "days", unitCount: days };
  }

  const roundedHours = Math.ceil(hours);
  return { amount: roundedHours * Number(vehicle.price_per_hour), unit: "hours", unitCount: roundedHours };
}

export function estimateRoomPrice(room: Room, startTime: string, endTime: string): PriceEstimate | null {
  if (!room.price_per_night) return null;
  const hours = durationHours(startTime, endTime);
  if (hours === null) return null;

  const nights = Math.max(1, Math.ceil(hours / 24));
  return { amount: nights * Number(room.price_per_night), unit: "nights", unitCount: nights };
}
