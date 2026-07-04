export type UserRole = "admin" | "moderator" | "user";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_staff: boolean;
  date_joined: string;
}

export interface Profile {
  address: string | null;
  avatar: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  tokens: AuthTokens;
  user: User;
}
