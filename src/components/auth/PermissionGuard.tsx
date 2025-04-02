
import React, { ReactNode } from 'react';
import { usePermission } from '@/contexts/PermissionContext';

interface PermissionGuardProps {
  permissions: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permissions, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = usePermission();
  
  // Handle array of permissions
  if (Array.isArray(permissions)) {
    // Check if user has ANY of the required permissions
    const hasAnyPermission = permissions.some(permission => 
      hasPermission(permission)
    );
    
    return hasAnyPermission ? <>{children}</> : <>{fallback}</>;
  }
  
  // Handle single permission
  return hasPermission(permissions) ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
