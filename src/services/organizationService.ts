
import { supabase } from '@/integrations/supabase/client';

interface Organization {
  id?: string;
  name: string;
  description?: string;
  logo_url?: string;
  status: 'active' | 'inactive' | 'pending';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  contact_email?: string;
  contact_phone?: string;
}

/**
 * Creates a new organization
 * @param organizationData Organization data
 * @returns The created organization
 */
export const createOrganization = async (organizationData: Organization): Promise<Organization> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert(organizationData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
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
    return data;
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
    return data;
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
    return data || [];
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
