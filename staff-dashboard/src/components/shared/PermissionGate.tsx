import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/common.types';

export interface PermissionGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  allowedRoles,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
