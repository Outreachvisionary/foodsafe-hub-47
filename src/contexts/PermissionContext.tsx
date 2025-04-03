
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { checkUserPermission, getUserRoles } from '@/services/roleService';
import { UserRole } from '@/types/role';
import { toast } from 'sonner';

interface PermissionContextType {
  userRoles: UserRole[];
  loadingPermissions: boolean;
  hasPermission: (permission: string, organizationId?: string, facilityId?: string, departmentId?: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const loadUserRoles = async () => {
    if (!user) {
      setUserRoles([]);
      setLoadingPermissions(false);
      return;
    }

    try {
      console.log('Loading roles for user:', user.id);
      setLoadingPermissions(true);
      const roles = await getUserRoles(user.id);
      console.log('Loaded user roles:', roles);
      setUserRoles(roles);
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast.error('Failed to load user permissions');
    } finally {
      setLoadingPermissions(false);
    }
  };

  useEffect(() => {
    loadUserRoles();
  }, [user]);

  const hasPermission = (
    permission: string,
    organizationId?: string,
    facilityId?: string,
    departmentId?: string
  ): boolean => {
    if (!user || userRoles.length === 0) return false;

    // Debug statement to see permissions being checked
    console.log(`Checking permission: ${permission} for user: ${user.id}`, {
      organizationId,
      facilityId,
      departmentId,
      availableRoles: userRoles
    });

    // Check if the user has admin permission at any level
    const hasAdminRole = userRoles.some(role => 
      role.permissions && role.permissions.admin === true && 
      (
        // If checking for specific context (org/facility/dept)
        (organizationId && role.organization_id === organizationId) ||
        (facilityId && role.facility_id === facilityId) ||
        (departmentId && role.department_id === departmentId) ||
        // If not checking specific context, any admin role grants permission
        (!organizationId && !facilityId && !departmentId)
      )
    );

    if (hasAdminRole) {
      console.log('User has admin role, permission granted');
      return true;
    }

    // Check for the specific permission
    const hasSpecificPermission = userRoles.some(role => {
      // Match specific permission
      const hasPermission = role.permissions && role.permissions[permission] === true;
      
      // Match the context if provided
      const matchesContext = (
        // If checking for specific context (org/facility/dept)
        (organizationId ? role.organization_id === organizationId : true) &&
        (facilityId ? role.facility_id === facilityId : true) &&
        (departmentId ? role.department_id === departmentId : true)
      );
      
      const result = hasPermission && matchesContext;
      if (result) {
        console.log(`Permission ${permission} granted through role: ${role.role_name}`);
      }
      return result;
    });
    
    console.log(`Permission check result for ${permission}: ${hasSpecificPermission}`);
    return hasSpecificPermission;
  };

  const refreshPermissions = async () => {
    console.log('Refreshing user permissions');
    await loadUserRoles();
  };

  return (
    <PermissionContext.Provider
      value={{
        userRoles,
        loadingPermissions,
        hasPermission,
        refreshPermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
