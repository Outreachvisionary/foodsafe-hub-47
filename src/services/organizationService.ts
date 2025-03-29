
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';

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
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name: organization.name,
      description: organization.description || null,
      contact_email: organization.contact_email || null,
      contact_phone: organization.contact_phone || null,
      logo_url: organization.logo_url || null,
      status: organization.status || 'active',
      address: organization.address || null
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
  
  return data as Organization;
};

export const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization> => {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
  
  return data as Organization;
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
