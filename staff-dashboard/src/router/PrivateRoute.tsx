import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { UserRole } from '../types/common.types';

export interface PrivateRouteProps {
  requiredRoles?: UserRole[];
  children?: React.ReactNode;
}

export function PrivateRoute({ requiredRoles, children }: PrivateRouteProps) {
  const { isAuthenticated, user, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to={ROUTES.DASHBOARD.ROOT} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PrivateRoute;
