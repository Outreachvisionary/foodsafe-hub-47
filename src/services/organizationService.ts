
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';
import { capitalizeLocation } from '@/utils/locationUtils';

export const fetchOrganizations = async (): Promise<Organization[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_organizations');
    
    if (error) throw error;
    
    return data as Organization[];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

export const fetchOrganizationsByLocation = async (
  country?: string, 
  state?: string, 
  city?: string
): Promise<Organization[]> => {
  try {
    console.log('Fetching organizations by location:', { country, state, city });
    let query = supabase
      .from('organizations')
      .select('*')
      .eq('status', 'active');
    
    if (country) {
      query = query.eq('country', country);
    }
    
    if (state) {
      query = query.eq('state', state);
    }
    
    if (city) {
      query = query.eq('city', city);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching organizations by location:', error);
      throw error;
    }
    
    return data as Organization[];
  } catch (error) {
    console.error('Error fetching organizations by location:', error);
    throw error;
  }
};

export const fetchOrganizationById = async (id: string): Promise<Organization> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }
  
  return data as Organization;
};

export const createOrganization = async (organization: Partial<Organization>): Promise<Organization> => {
  try {
    // Capitalize location names if present
    const processedOrg = {
      ...organization,
      city: organization.city ? capitalizeLocation(organization.city) : organization.city,
      state: organization.state ? capitalizeLocation(organization.state) : organization.state,
    };
    
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name: processedOrg.name,
        description: processedOrg.description || null,
        contact_email: processedOrg.contact_email || null,
        contact_phone: processedOrg.contact_phone || null,
        logo_url: processedOrg.logo_url || null,
        status: processedOrg.status || 'active',
        address: processedOrg.address || null,
        country: processedOrg.country || null,
        state: processedOrg.state || null,
        city: processedOrg.city || null,
        zipcode: processedOrg.zipcode || null
      })
      .select()
      .single();
  
    if (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  
    return data as Organization;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

export const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization> => {
  try {
    // Capitalize location names if present
    const processedUpdates = {
      ...updates,
      city: updates.city ? capitalizeLocation(updates.city) : updates.city,
      state: updates.state ? capitalizeLocation(updates.state) : updates.state,
    };
    
    const { data, error } = await supabase
      .from('organizations')
      .update(processedUpdates)
      .eq('id', id)
      .select()
      .single();
  
    if (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  
    return data as Organization;
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

export const deleteOrganization = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};
