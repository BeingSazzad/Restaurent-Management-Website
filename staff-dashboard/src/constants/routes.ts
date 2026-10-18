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
    RESERVATIONS: '/reservations',
    PRODUCTS: '/products',
    CUSTOMERS: '/customers',
    CUSTOMER_DETAILS: '/customers/:customerId',
    TRANSACTIONS: '/transactions',
    CMS: '/cms',
    STOCK_86: '/stock-86',
    ANALYTICS: '/analytics',
    USERS: '/staff-users',
    NOTIFICATIONS: '/notifications',
    PROFILE: '/profile',
  },
} as const;

export type AppRoutes = typeof ROUTES;
