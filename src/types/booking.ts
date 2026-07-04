export interface RoomCategory {
  id: number;
  name: string;
}

export interface Room {
  id: number;
  building: number;
  name: string;
  category: RoomCategory | null;
  floor: number;
  capacity: number;
  has_projector: boolean;
  price_per_night: string | null;
  model_3d_url: string | null;
  photo: string | null;
  is_active: boolean;
  booking_status: "available" | "booked";
}

export interface BuildingOwner {
  id: number;
  username: string;
  phone_number: string;
}

export interface Building {
  id: number;
  name: string;
  address: string;
  city: string;
  description: string;
  owner: BuildingOwner | null;
  cover_image: string | null;
  created_at: string;
  rooms: Room[];
  rooms_count: number;
  average_rating: number | null;
  reviews_count: number;
}

export interface VehicleCategory {
  id: number;
  name: string;
  level: number;
  description: string;
}

export type Transmission = "manual" | "automatic" | "";

export interface Vehicle {
  id: number;
  category: VehicleCategory;
  name: string;
  brand: string;
  plate_number: string;
  capacity: number;
  transmission: Transmission;
  location: string;
  price_per_hour: string;
  price_per_day: string | null;
  photo: string | null;
  is_active: boolean;
  booking_status: "available" | "booked";
  average_rating: number | null;
  reviews_count: number;
}

export type BookableType = "room" | "vehicle";
export type BookingStatus = "active" | "cancelled" | "completed";

export interface Booking {
  id: number;
  object_type: BookableType;
  object_id: number;
  booked_object_repr: string;
  booked_object_type: BookableType;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
}

export type ReviewableType = "building" | "room" | "vehicle";

export interface Review {
  id: number;
  object_type: ReviewableType;
  object_id: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}
