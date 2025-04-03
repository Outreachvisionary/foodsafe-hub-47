
import React, { ReactNode } from 'react';
import { usePermission } from '@/contexts/PermissionContext';

interface PermissionGuardProps {
  permission: string;
  organizationId?: string;
  facilityId?: string;
  departmentId?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  organizationId,
  facilityId,
  departmentId,
  children,
  fallback = null,
}) => {
  const { hasPermission, loadingPermissions } = usePermission();
  
  if (loadingPermissions) {
    return null; // Or a subtle loading indicator
  }
  
  if (hasPermission(permission, organizationId, facilityId, departmentId)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGuard;
