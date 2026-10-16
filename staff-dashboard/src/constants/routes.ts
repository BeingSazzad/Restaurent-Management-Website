export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    ROOT: '/',
    KDS: '/',
    ORDERS: '/all-orders',
    ORDER_DETAILS: '/all-orders/:orderId',
    PRODUCTS: '/products',
    CUSTOMERS: '/customers',
    TRANSACTIONS: '/transactions',
    CMS: '/cms',
    STOCK_86: '/stock-86',
    ANALYTICS: '/analytics',
    USERS: '/staff-users',
    CHANGE_PASSWORD: '/change-password',
  },
} as const;

export type AppRoutes = typeof ROUTES;
