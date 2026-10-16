import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { PrivateRoute } from './PrivateRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Page imports
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import Stock86Page from '../pages/dashboard/Stock86Page';
import StaffUsersPage from '../pages/dashboard/StaffUsersPage';
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
