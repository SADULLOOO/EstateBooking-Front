import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, type LoginPayload, type RegisterPayload } from "@/api/auth.api";
import { tokenStorage } from "@/api/tokenStorage";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "housingbook_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.login(payload);
      tokenStorage.set(data.tokens);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.register(payload);
      tokenStorage.set(data.tokens);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refresh = tokenStorage.getRefresh();
    tokenStorage.clear();
    setUser(null);
    if (refresh) {
      try {
        await authApi.logout(refresh);
      } catch {
        // токен уже невалиден на бэкенде — локальный логаут всё равно выполнен
      }
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
