export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  DASHBOARD: {
    ROOT: '/',
    KDS: '/',
    STOCK_86: '/stock-86',
    ANALYTICS: '/analytics',
    USERS: '/staff-users',
  },
} as const;

export type AppRoutes = typeof ROUTES;
