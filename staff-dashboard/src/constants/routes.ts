export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  DASHBOARD: {
    ROOT: '/',
    KDS: '/',
    ORDERS: '/all-orders',
    ORDER_DETAILS: '/all-orders/:orderId',
    PRODUCTS: '/products',
    CMS: '/cms',
    STOCK_86: '/stock-86',
    ANALYTICS: '/analytics',
    USERS: '/staff-users',
  },
} as const;

export type AppRoutes = typeof ROUTES;
