import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { AdminRoute } from "@/app/router/AdminRoute";
import { ROUTES } from "@/app/router/routes";
import { HomePage } from "@/pages/HomePage";
import { VehiclesPage } from "@/pages/VehiclesPage";
import { VehicleDetailPage } from "@/pages/VehicleDetailPage";
import { HousingPage } from "@/pages/HousingPage";
import { PropertyDetailPage } from "@/pages/PropertyDetailPage";
import { BookingsPage } from "@/pages/BookingsPage";
import { ChatPage } from "@/pages/ChatPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminOverviewPage } from "@/pages/admin/AdminOverviewPage";
import { AdminVehiclesPage } from "@/pages/admin/AdminVehiclesPage";
import { AdminVehicleCategoriesPage } from "@/pages/admin/AdminVehicleCategoriesPage";
import { AdminPropertiesPage } from "@/pages/admin/AdminPropertiesPage";
import { AdminBookingsPage } from "@/pages/admin/AdminBookingsPage";
import { AdminReviewsPage } from "@/pages/admin/AdminReviewsPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminNotificationsPage } from "@/pages/admin/AdminNotificationsPage";
import { AdminAnalyticsPage } from "@/pages/admin/AdminAnalyticsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.vehicles} element={<VehiclesPage />} />
        <Route path={ROUTES.vehicleDetailPattern} element={<VehicleDetailPage />} />
        <Route path={ROUTES.housing} element={<HousingPage />} />
        <Route path={ROUTES.propertyDetailPattern} element={<PropertyDetailPage />} />
        <Route
          path={ROUTES.bookings}
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.chat}
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.notifications}
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.profile}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.settings}
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path={ROUTES.admin} element={<AdminOverviewPage />} />
        <Route path={ROUTES.adminVehicles} element={<AdminVehiclesPage />} />
        <Route path={ROUTES.adminVehicleCategories} element={<AdminVehicleCategoriesPage />} />
        <Route path={ROUTES.adminProperties} element={<AdminPropertiesPage />} />
        <Route path={ROUTES.adminBookings} element={<AdminBookingsPage />} />
        <Route path={ROUTES.adminReviews} element={<AdminReviewsPage />} />
        <Route path={ROUTES.adminUsers} element={<AdminUsersPage />} />
        <Route path={ROUTES.adminNotifications} element={<AdminNotificationsPage />} />
        <Route path={ROUTES.adminAnalytics} element={<AdminAnalyticsPage />} />
      </Route>
    </Routes>
  );
}
