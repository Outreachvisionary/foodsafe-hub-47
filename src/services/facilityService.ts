
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';
import { capitalizeLocation } from '@/utils/locationUtils';

export const fetchFacilities = async (organizationId?: string, onlyAssigned: boolean = false): Promise<Facility[]> => {
  try {
    console.log('Fetching facilities for organization:', organizationId, 'onlyAssigned:', onlyAssigned);
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
    
    if (organizationId) {
      return (data as Facility[]).filter(f => f.organization_id === organizationId);
    }
    
    console.log('Facilities data retrieved:', data);
    return data as Facility[];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

export const fetchFacilitiesByLocation = async (
  organizationId?: string, 
  country?: string, 
  state?: string, 
  city?: string
): Promise<Facility[]> => {
  try {
    console.log('Fetching facilities by location:', { organizationId, country, state, city });
    let query = supabase
      .from('facilities')
      .select('*')
      .eq('status', 'active');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
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
      console.error('Error fetching facilities by location:', error);
      throw error;
    }
    
    console.log('Facilities data retrieved by location:', data);
    return data as Facility[];
  } catch (error) {
    console.error('Error fetching facilities by location:', error);
    throw error;
  }
};

export const fetchFacilityById = async (id: string): Promise<Facility> => {
  try {
    console.log('Fetching facility by ID:', id);
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching facility:', error);
      throw error;
    }
    
    console.log('Facility data retrieved:', data);
    return data as Facility;
  } catch (error) {
    console.error('Error fetching facility:', error);
    throw error;
  }
};

export const createFacility = async (facility: Partial<Facility>): Promise<Facility> => {
  try {
    console.log('Creating facility with data:', facility);
    
    // Ensure organization_id is set
    if (!facility.organization_id) {
      throw new Error('Organization ID is required to create a facility');
    }
    
    // Ensure name is set
    if (!facility.name) {
      throw new Error('Facility name is required');
    }
    
    // Capitalize location names if present
    const processedFacility = {
      ...facility,
      city: facility.city ? capitalizeLocation(facility.city) : facility.city,
      state: facility.state ? capitalizeLocation(facility.state) : facility.state,
    };
    
    const { data, error } = await supabase
      .from('facilities')
      .insert(processedFacility)
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
    
    // Capitalize location names if present
    const processedUpdates = {
      ...updates,
      city: updates.city ? capitalizeLocation(updates.city) : updates.city,
      state: updates.state ? capitalizeLocation(updates.state) : updates.state,
    };
    
    const { data, error } = await supabase
      .from('facilities')
      .update(processedUpdates)
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
  try {
    console.log('Deleting facility:', id);
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting facility:', error);
      throw error;
    }
    
    console.log('Facility deleted successfully');
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};
