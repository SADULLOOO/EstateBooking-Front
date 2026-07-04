export const ENDPOINTS = {
  auth: {
    register: "/api/user/register/",
    login: "/api/user/login/",
    logout: "/api/user/logout/",
    profile: "/api/user/profile/",
    token: "/api/token/",
    tokenRefresh: "/api/token/refresh/",
  },
  users: {
    list: "/api/user/users/",
    detail: (id: number | string) => `/api/user/users/${id}/`,
    changeRole: (id: number | string) => `/api/user/users/${id}/change-role/`,
  },
  buildings: {
    list: "/api/buildings/",
    detail: (id: number | string) => `/api/buildings/${id}/`,
  },
  rooms: {
    list: "/api/rooms/",
    detail: (id: number | string) => `/api/rooms/${id}/`,
  },
  vehicleCategories: {
    list: "/api/vehicle-categories/",
    detail: (id: number | string) => `/api/vehicle-categories/${id}/`,
  },
  vehicles: {
    list: "/api/vehicles/",
    detail: (id: number | string) => `/api/vehicles/${id}/`,
  },
  bookings: {
    create: "/api/bookings/create/",
    my: "/api/bookings/my/",
    all: "/api/bookings/all/",
    cancel: (id: number | string) => `/api/bookings/${id}/cancel/`,
  },
  reviews: {
    create: "/api/reviews/create/",
    my: "/api/reviews/my/",
    delete: (id: number | string) => `/api/reviews/${id}/`,
    list: "/api/reviews/",
  },
  ai: {
    recommendation: "/api/ai/recommendation/",
  },
  chat: {
    rooms: "/api/chat/rooms/",
    messages: (roomId: number | string) => `/api/chat/rooms/${roomId}/messages/`,
    notifications: "/api/chat/notifications/",
    notificationsMarkRead: "/api/chat/notifications/mark-read/",
  },
} as const;
