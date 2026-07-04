import { useEffect, useState } from "react";
import { buildingsApi } from "@/api/buildings.api";
import { vehiclesApi } from "@/api/vehicles.api";
import { usersApi } from "@/api/users.api";
import { bookingsApi } from "@/api/bookings.api";
import { useNotifications } from "@/app/providers/NotificationProvider";

export function useAdminOverviewStats() {
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [buildingsCount, setBuildingsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { notifications, unreadCount } = useNotifications();

  useEffect(() => {
    Promise.all([vehiclesApi.list(), buildingsApi.list(), usersApi.list(), bookingsApi.all()])
      .then(([vehiclesRes, buildingsRes, usersRes, bookingsRes]) => {
        setVehiclesCount(vehiclesRes.data.length);
        setBuildingsCount(buildingsRes.data.length);
        setUsersCount(usersRes.data.length);
        setActiveBookingsCount(bookingsRes.data.filter((b) => b.status === "active").length);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const newMessagesCount = notifications.filter((n) => n.notification_type === "message" && !n.is_read).length;

  return {
    isLoading,
    vehiclesCount,
    buildingsCount,
    usersCount,
    activeBookingsCount,
    newMessagesCount,
    newNotificationsCount: unreadCount,
  };
}
