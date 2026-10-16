import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { PrivateRoute } from './PrivateRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Page imports
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import Stock86Page from '../pages/dashboard/Stock86Page';
import StaffUsersPage from '../pages/dashboard/StaffUsersPage';
import OrdersPage from '../pages/dashboard/OrdersPage';
import OrderDetailPage from '../pages/dashboard/OrderDetailPage';
import ProductsPage from '../pages/dashboard/ProductsPage';
import CustomersPage from '../pages/dashboard/CustomersPage';
import TransactionsPage from '../pages/dashboard/TransactionsPage';
import CmsPage from '../pages/dashboard/CmsPage';
import NotificationsPage from '../pages/dashboard/NotificationsPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // Public Auth Routes
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.AUTH.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.AUTH.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },

  // Protected Staff & Kitchen Dashboard Routes
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'all-orders',
            element: <OrdersPage />,
          },
          {
            path: 'all-orders/:orderId',
            element: <OrderDetailPage />,
          },
          {
            path: 'products',
            element: <ProductsPage />,
          },
          {
            path: 'customers',
            element: <CustomersPage />,
          },
          {
            path: 'transactions',
            element: <TransactionsPage />,
          },
          {
            path: 'cms',
            element: <CmsPage />,
          },
          {
            path: 'stock-86',
            element: <Stock86Page />,
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />,
          },
          {
            path: 'staff-users',
            element: <StaffUsersPage />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  // 404 Catch-All Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
