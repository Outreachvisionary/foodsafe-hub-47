
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
    // First, check if a developer role exists
    let developerRole: Role | null = null;
    
    const { data: existingRoles, error: roleQueryError } = await supabase
      .from('roles')
      .select('*')
      .eq('name', 'Developer')
      .single();
    
    if (roleQueryError || !existingRoles) {
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
      
      const { data: newRole, error: createRoleError } = await supabase
        .from('roles')
        .insert({
          name: 'Developer',
          description: 'Full system access for development purposes',
          level: 'organization',
          permissions: fullPermissions
        })
        .select()
        .single();
      
      if (createRoleError) throw createRoleError;
      developerRole = newRole as Role;
    } else {
      developerRole = existingRoles as Role;
    }
    
    // Now assign the developer role to the user
    // First check if the user already has this role
    const { data: existingUserRoles, error: userRoleQueryError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', developerRole.id);
    
    if (!existingUserRoles?.length) {
      // Assign the role to the user
      const { error: assignRoleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: developerRole.id,
          assigned_by: userId // Self-assigned
        });
      
      if (assignRoleError) throw assignRoleError;
    }
    
    // Also update the profile's role field for backward compatibility
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ role: 'Developer' })
      .eq('id', userId);
    
    if (updateProfileError) throw updateProfileError;
    
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
