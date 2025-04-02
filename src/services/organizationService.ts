
import { supabase } from '@/integrations/supabase/client';
import { Organization, OrganizationInput } from '@/types/organization';

/**
 * Creates a new organization
 * @param organizationData Organization data
 * @returns The created organization
 */
export const createOrganization = async (organizationData: OrganizationInput): Promise<Organization> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert(organizationData)
      .select()
      .single();
      
    if (error) throw error;
    
    // Ensure the organization has all required fields
    const organization: Organization = {
      ...data,
      id: data.id || '',
      status: data.status || 'active'
    };
    
    return organization;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

/**
 * Updates an organization
 * @param id Organization ID
 * @param updates Updates to apply
 * @returns The updated organization
 */
export const updateOrganization = async (
  id: string, 
  updates: Partial<Organization>
): Promise<Organization> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Ensure the organization has all required fields
    const organization: Organization = {
      ...data,
      id: data.id || id,
      status: data.status || 'active'
    };
    
    return organization;
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

/**
 * Fetches an organization by ID
 * @param id Organization ID
 * @returns The organization
 */
export const getOrganization = async (id: string): Promise<Organization | null> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    // Ensure the organization has all required fields
    const organization: Organization = {
      ...data,
      id: data.id || id,
      status: data.status || 'active'
    };
    
    return organization;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
};

/**
 * Fetches all organizations
 * @returns List of organizations
 */
export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Ensure all organizations have required fields
    const organizations: Organization[] = data.map(org => ({
      ...org,
      id: org.id || '',
      status: org.status || 'active'
    }));
    
    return organizations;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
};

/**
 * Deactivates an organization
 * @param id Organization ID
 * @returns Success status
 */
export const deactivateOrganization = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('organizations')
      .update({ status: 'inactive' })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deactivating organization:', error);
    return false;
  }
};
