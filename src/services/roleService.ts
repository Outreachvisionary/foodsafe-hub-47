
import { supabase } from '@/integrations/supabase/client';
import { Role, UserRole } from '@/types/role';

export const fetchRoles = async (): Promise<Role[]> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
  
  return data as Role[];
};

export const fetchRoleById = async (id: string): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
  
  return data as Role;
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
  // Ensure required fields are provided
  const roleData = {
    name: role.name,
    level: role.level || "organization", // Default to organization level
    description: role.description,
    permissions: role.permissions,
    organization_id: role.organization_id
  };

  const { data, error } = await supabase
    .from('roles')
    .insert(roleData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating role:', error);
    throw error;
  }
  
  return data as Role;
};

export const updateRole = async (id: string, updates: Partial<Role>): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating role:', error);
    throw error;
  }
  
  return data as Role;
};

export const deleteRole = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const assignRoleToUser = async (
  userId: string, 
  roleId: string, 
  organizationId?: string, 
  facilityId?: string, 
  departmentId?: string
): Promise<UserRole> => {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role_id: roleId,
      organization_id: organizationId,
      facility_id: facilityId,
      department_id: departmentId,
      assigned_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error assigning role to user:', error);
    throw error;
  }
  
  return data as UserRole;
};

export const removeRoleFromUser = async (userRoleId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', userRoleId);
  
  if (error) {
    console.error('Error removing role from user:', error);
    throw error;
  }
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .rpc('get_user_roles', { _user_id: userId });
  
  if (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
  
  return data as UserRole[];
};

export const checkUserPermission = async (
  userId: string, 
  permission: string,
  organizationId?: string,
  facilityId?: string,
  departmentId?: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('has_permission', { 
      _user_id: userId, 
      _permission: permission,
      _org_id: organizationId || null,
      _facility_id: facilityId || null,
      _department_id: departmentId || null
    });
  
  if (error) {
    console.error('Error checking user permission:', error);
    throw error;
  }
  
  return data as boolean;
};

export const checkUserRole = async (
  userId: string, 
  roleName: string,
  organizationId?: string,
  facilityId?: string,
  departmentId?: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('has_role', { 
      _user_id: userId, 
      _role_name: roleName,
      _org_id: organizationId || null,
      _facility_id: facilityId || null,
      _department_id: departmentId || null
    });
  
  if (error) {
    console.error('Error checking user role:', error);
    throw error;
  }
  
  return data as boolean;
};
