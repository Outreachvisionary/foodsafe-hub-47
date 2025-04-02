
import { supabase } from '@/integrations/supabase/client';

/**
 * Assigns a role to a user
 * @param userId User ID
 * @param roleId Role ID
 * @param organizationId Optional organization ID
 * @param facilityId Optional facility ID
 * @param departmentId Optional department ID
 */
export const assignRoleToUser = async (
  userId: string,
  roleId: string,
  organizationId?: string,
  facilityId?: string,
  departmentId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
        organization_id: organizationId || null,
        facility_id: facilityId || null,
        department_id: departmentId || null,
        assigned_by: (await supabase.auth.getUser()).data.user?.id || null
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error assigning role to user:', error);
    return false;
  }
};

/**
 * Creates a new role
 * @param roleData Role data to create
 * @returns The created role or null if failed
 */
export const createRole = async (roleData: any) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .insert(roleData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating role:', error);
    return null;
  }
};

/**
 * Updates an existing role
 * @param roleId Role ID to update
 * @param updates Role data updates
 * @returns The updated role or null if failed
 */
export const updateRole = async (roleId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .update(updates)
      .eq('id', roleId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating role:', error);
    return null;
  }
};

/**
 * Deletes a role
 * @param roleId Role ID to delete
 * @returns Success status
 */
export const deleteRole = async (roleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting role:', error);
    return false;
  }
};

/**
 * Fetches all available roles
 */
export const fetchRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

/**
 * Fetches roles assigned to a user
 * @param userId User ID
 */
export const fetchUserRoles = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_user_roles', {
      _user_id: userId
    });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
};

/**
 * Removes a role from a user
 * @param userId User ID
 * @param roleId Role ID
 * @param organizationId Optional organization ID
 * @param facilityId Optional facility ID
 * @param departmentId Optional department ID
 */
export const removeRoleFromUser = async (
  userId: string,
  roleId: string,
  organizationId?: string,
  facilityId?: string,
  departmentId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .match({
        user_id: userId,
        role_id: roleId,
        ...(organizationId && { organization_id: organizationId }),
        ...(facilityId && { facility_id: facilityId }),
        ...(departmentId && { department_id: departmentId })
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing role from user:', error);
    return false;
  }
};
