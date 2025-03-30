
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
    
    // Create a properly typed facility object with required fields
    const facilityData: { 
      name: string;
      organization_id: string;
      status: string;
      city?: string;
      state?: string;
      country?: string;
      description?: string;
      address?: string;
      contact_email?: string;
      contact_phone?: string;
      zipcode?: string;
      location_data?: Record<string, any>;
    } = {
      name: facility.name,
      organization_id: facility.organization_id,
      status: facility.status || 'active',
    };
    
    // Add optional fields if they exist
    if (facility.city) facilityData.city = capitalizeLocation(facility.city);
    if (facility.state) facilityData.state = capitalizeLocation(facility.state);
    if (facility.country) facilityData.country = facility.country;
    if (facility.description) facilityData.description = facility.description;
    if (facility.address) facilityData.address = facility.address;
    if (facility.contact_email) facilityData.contact_email = facility.contact_email;
    if (facility.contact_phone) facilityData.contact_phone = facility.contact_phone;
    if (facility.zipcode) facilityData.zipcode = facility.zipcode;
    if (facility.location_data) facilityData.location_data = facility.location_data;
    
    console.log('Sending facility data to Supabase:', facilityData);
    
    const { data, error } = await supabase
      .from('facilities')
      .insert(facilityData)
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
    
    // Create a new object with only the fields that exist in the database
    const cleanUpdates: Record<string, any> = {};
    
    // Include only the fields that are allowed to be updated
    if (updates.name !== undefined) cleanUpdates.name = updates.name;
    if (updates.description !== undefined) cleanUpdates.description = updates.description;
    if (updates.status !== undefined) cleanUpdates.status = updates.status;
    if (updates.address !== undefined) cleanUpdates.address = updates.address;
    if (updates.city !== undefined) cleanUpdates.city = capitalizeLocation(updates.city);
    if (updates.state !== undefined) cleanUpdates.state = capitalizeLocation(updates.state);
    if (updates.country !== undefined) cleanUpdates.country = updates.country;
    if (updates.zipcode !== undefined) cleanUpdates.zipcode = updates.zipcode;
    if (updates.contact_email !== undefined) cleanUpdates.contact_email = updates.contact_email;
    if (updates.contact_phone !== undefined) cleanUpdates.contact_phone = updates.contact_phone;
    if (updates.location_data !== undefined) cleanUpdates.location_data = updates.location_data;
    if (updates.organization_id !== undefined) cleanUpdates.organization_id = updates.organization_id;
    
    console.log('Cleaned updates for Supabase:', cleanUpdates);
    
    const { data, error } = await supabase
      .from('facilities')
      .update(cleanUpdates)
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
