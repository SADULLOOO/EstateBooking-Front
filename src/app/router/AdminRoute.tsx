import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROUTES } from "@/app/router/routes";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={ROUTES.home} replace />;
  if (!user?.is_staff) return <Navigate to={ROUTES.home} replace />;

  return <>{children}</>;
}
