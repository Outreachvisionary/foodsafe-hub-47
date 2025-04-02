
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';

interface PermissionContextType {
  hasPermission: (permission: string, orgId?: string, facilityId?: string, departmentId?: string) => boolean;
  hasRole: (roleName: string, orgId?: string, facilityId?: string, departmentId?: string) => boolean;
  isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useUser();

  const hasPermission = async (
    permission: string,
    orgId?: string,
    facilityId?: string,
    departmentId?: string
  ): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase.rpc('has_permission', {
        _user_id: user.id,
        _permission: permission,
        _org_id: orgId || null,
        _facility_id: facilityId || null,
        _department_id: departmentId || null
      });

      if (error) {
        console.error('Error checking permission:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Exception checking permission:', error);
      return false;
    }
  };

  const hasRole = async (
    roleName: string,
    orgId?: string,
    facilityId?: string,
    departmentId?: string
  ): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role_name: roleName,
        _org_id: orgId || null,
        _facility_id: facilityId || null,
        _department_id: departmentId || null
      });

      if (error) {
        console.error('Error checking role:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Exception checking role:', error);
      return false;
    }
  };

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        hasRole,
        isLoading: loading
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
