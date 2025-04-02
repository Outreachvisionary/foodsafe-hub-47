
import React, { ReactNode, useEffect, useState } from 'react';
import { usePermission } from '@/contexts/PermissionContext';
import { useUser } from '@/contexts/UserContext';

interface PermissionGuardProps {
  permission?: string;
  requiredRole?: string;
  orgId?: string;
  facilityId?: string;
  departmentId?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  requiredRole,
  orgId,
  facilityId,
  departmentId,
  children,
  fallback = null
}) => {
  const { user, loading: userLoading } = useUser();
  const { hasPermission, hasRole, isLoading } = usePermission();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      if (userLoading || isLoading || !user) {
        setHasAccess(false);
        return;
      }
      
      setCheckingAccess(true);
      
      try {
        // If neither permission nor role is specified, default to allowing access
        if (!permission && !requiredRole) {
          setHasAccess(true);
          return;
        }
        
        // Check permission if specified
        if (permission) {
          const permitted = await hasPermission(permission, orgId, facilityId, departmentId);
          if (permitted) {
            setHasAccess(true);
            return;
          }
        }
        
        // Check role if specified
        if (requiredRole) {
          const hasRequiredRole = await hasRole(requiredRole, orgId, facilityId, departmentId);
          if (hasRequiredRole) {
            setHasAccess(true);
            return;
          }
        }
        
        // If we get here, the user doesn't have access
        setHasAccess(false);
      } catch (error) {
        console.error('Error in permission check:', error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };
    
    checkAccess();
  }, [hasPermission, hasRole, permission, requiredRole, orgId, facilityId, departmentId, user, userLoading, isLoading]);
  
  if (userLoading || isLoading || checkingAccess) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
