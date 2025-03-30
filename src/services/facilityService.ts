
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';
import { useToast } from '@/hooks/use-toast';

export const fetchFacilities = async (organizationId?: string, onlyAssigned: boolean = false): Promise<Facility[]> => {
  try {
    console.log('Fetching facilities for organization:', organizationId, 'onlyAssigned:', onlyAssigned);
    const { data, error } = await supabase
      .rpc('get_facilities', {
        p_organization_id: organizationId || null,
        p_only_assigned: onlyAssigned
      });
    
    if (error) {
      console.error('Error in get_facilities RPC:', error);
      throw error;
    }
    
    console.log('Facilities data retrieved:', data);
    return data as Facility[];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

export const fetchFacilityById = async (id: string): Promise<Facility> => {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching facility:', error);
    throw error;
  }
  
  return data as Facility;
};

export const createFacility = async (facility: Partial<Facility>): Promise<Facility> => {
  try {
    console.log('Creating facility with data:', facility);
    
    // Ensure organization_id is set
    if (!facility.organization_id) {
      throw new Error('Organization ID is required to create a facility');
    }
    
    const { data, error } = await supabase
      .from('facilities')
      .insert({
        name: facility.name,
        description: facility.description || null,
        address: facility.address || null,
        facility_type: facility.facility_type || null,
        organization_id: facility.organization_id,
        status: facility.status || 'active',
        contact_email: facility.contact_email || null,
        contact_phone: facility.contact_phone || null,
        location_data: facility.location_data || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
    
    console.log('Created facility:', data);
    return data as Facility;
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
};

export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility> => {
  try {
    console.log('Updating facility:', id, 'with data:', updates);
    const { data, error } = await supabase
      .from('facilities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating facility:', error);
      throw error;
    }
    
    console.log('Updated facility:', data);
    return data as Facility;
  } catch (error) {
    console.error('Error updating facility:', error);
    throw error;
  }
};

export const deleteFacility = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('facilities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};
