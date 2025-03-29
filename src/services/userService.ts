import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { Role } from '@/types/role';

/**
 * Gives the user full developer access by assigning them the developer role
 * @param userId The user ID to update
 * @returns Promise resolving to success status
 */
export const giveUserDeveloperAccess = async (userId: string): Promise<boolean> => {
  try {
    console.log('Starting developer access process for user:', userId);
    // First, check if a developer role exists
    let developerRole: Role | null = null;
    
    const { data: existingRoles, error: roleQueryError } = await supabase
      .from('roles')
      .select('*')
      .eq('name', 'Developer')
      .single();
    
    console.log('Existing Developer role check:', existingRoles, roleQueryError);
    
    if (roleQueryError || !existingRoles) {
      console.log('Developer role not found, creating it');
      // Create the developer role if it doesn't exist
      const fullPermissions: Record<string, boolean> = {
        admin: true,
        // Adding all permissions here ensures full access
        'dashboard.view': true,
        'documents.create': true,
        'documents.view': true,
        'documents.edit': true,
        'documents.delete': true,
        'haccp.view': true,
        'training.view': true,
        'internal_audits.view': true,
        'supplier_management.view': true,
        'traceability.view': true,
        'capa.view': true,
        'complaint_management.view': true,
        'reports.view': true,
        'standards.view': true,
        'non_conformance.view': true,
        'organization.view': true,
        'facilities.view': true,
        'users.view': true,
        'users.create': true,
        'users.edit': true,
        'users.delete': true,
        'users.status': true,
        'roles.view': true,
        'roles.create': true,
        'roles.edit': true,
        'roles.delete': true,
        'departments.view': true,
        'departments.create': true,
        'departments.edit': true,
        'departments.delete': true,
      };
      
      // Use RPC call instead of direct table access to bypass RLS
      const { data: newRole, error: createRoleError } = await supabase
        .rpc('create_role', {
          _name: 'Developer',
          _description: 'Full system access for development purposes',
          _level: 'organization',
          _permissions: fullPermissions
        });
      
      if (createRoleError) {
        console.error('Failed to create developer role:', createRoleError);
        throw createRoleError;
      }
      
      console.log('Developer role created:', newRole);
      developerRole = newRole as Role;
    } else {
      console.log('Using existing developer role:', existingRoles);
      developerRole = existingRoles as Role;
    }
    
    if (!developerRole || !developerRole.id) {
      console.error('Failed to get or create developer role');
      return false;
    }
    
    // Now assign the developer role to the user
    console.log('Assigning developer role to user:', userId, developerRole.id);
    
    // Use RPC call to bypass RLS
    const { data: roleAssignmentResult, error: assignRoleError } = await supabase
      .rpc('assign_user_role', {
        _user_id: userId,
        _role_id: developerRole.id,
        _assigned_by: userId
      });
    
    if (assignRoleError) {
      console.error('Failed to assign role to user:', assignRoleError);
      throw assignRoleError;
    }
    
    console.log('Role assignment result:', roleAssignmentResult);
    
    // Also update the profile's role field for backward compatibility
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ role: 'Developer' })
      .eq('id', userId);
    
    if (updateProfileError) {
      console.error('Failed to update user profile:', updateProfileError);
      throw updateProfileError;
    }
    
    console.log('Developer access successfully granted to user:', userId);
    return true;
  } catch (error) {
    console.error('Error giving user developer access:', error);
    return false;
  }
};

/**
 * Creates a QA Technician role if it doesn't exist
 * @returns Promise resolving to the created role
 */
export const createQATechnicianRole = async (): Promise<Role | null> => {
  try {
    // Check if the role already exists
    const { data: existingRoles, error: roleQueryError } = await supabase
      .from('roles')
      .select('*')
      .eq('name', 'QA Technician')
      .single();
    
    if (!roleQueryError && existingRoles) {
      return existingRoles as Role;
    }
    
    // Create appropriate permissions for QA Technicians
    const qaPermissions: Record<string, boolean> = {
      'dashboard.view': true,
      'documents.view': true,
      'haccp.view': true,
      'training.view': true,
      'internal_audits.view': true,
      'supplier_management.view': true, 
      'traceability.view': true,
      'capa.view': true,
      'complaint_management.view': true,
      'non_conformance.view': true,
      'standards.view': true,
    };
    
    const { data: newRole, error: createRoleError } = await supabase
      .from('roles')
      .insert({
        name: 'QA Technician',
        description: 'Quality assurance staff that performs quality checks and monitors compliance',
        level: 'facility',
        permissions: qaPermissions
      })
      .select()
      .single();
    
    if (createRoleError) throw createRoleError;
    return newRole as Role;
  } catch (error) {
    console.error('Error creating QA Technician role:', error);
    return null;
  }
};

/**
 * Assigns a specific role to a user
 * @param userId User to assign role to
 * @param roleId Role to assign
 * @param organizationId Optional organization context
 * @param facilityId Optional facility context
 * @param departmentId Optional department context
 * @returns Promise resolving to success status
 */
export const assignRoleToUser = async (
  userId: string,
  roleId: string,
  organizationId?: string,
  facilityId?: string,
  departmentId?: string
): Promise<boolean> => {
  try {
    // Check if this role assignment already exists
    const { data: existingAssignments, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', roleId);
      
    if (checkError) throw checkError;
    
    // If not already assigned, create the assignment
    if (!existingAssignments || existingAssignments.length === 0) {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId,
          organization_id: organizationId,
          facility_id: facilityId,
          department_id: departmentId,
          assigned_by: userId // Self-assignment in this case
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error assigning role to user:', error);
    return false;
  }
};

/**
 * Gets the user's role details from their profile
 * @param userId The user ID to check
 * @returns Promise resolving to the role name
 */
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Updates a user profile with new information
 * @param userId The user ID to update
 * @param updates The profile updates to apply
 * @returns Promise resolving to success status
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
