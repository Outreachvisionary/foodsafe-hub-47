
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

// For consistency with our app
export interface FacilityWithOrganization extends Facility {
  organizationName?: string;
}

export async function getFacilities(organizationId?: string): Promise<Facility[]> {
  try {
    let query = supabase
      .from('facilities')
      .select('*')
      .order('name', { ascending: true });
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
    
    // DB columns already match our Facility type
    return data || [];
  } catch (error) {
    console.error('Error in getFacilities:', error);
    throw error;
  }
}

// Add this function to support components that expect it
export const fetchFacilitiesByOrganization = getFacilities;
// Add this alias for components expecting this name
export const fetchFacilities = getFacilities;

export async function getFacilityById(id: string): Promise<Facility | null> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching facility by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getFacilityById:', error);
    return null;
  }
}

// Add this alias for components expecting this name
export const fetchFacilityById = getFacilityById;

export async function createFacility(facility: Omit<Facility, 'id' | 'created_at' | 'updated_at'>): Promise<Facility> {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert([
        {
          name: facility.name,
          description: facility.description,
          address: facility.address,
          contact_email: facility.contact_email,
          contact_phone: facility.contact_phone,
          status: facility.status,
          organization_id: facility.organization_id,
          country: facility.country,
          state: facility.state,
          city: facility.city,
          zipcode: facility.zipcode,
          facility_type: facility.facility_type,
          location_data: facility.location_data
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createFacility:', error);
    throw error;
  }
}

export async function updateFacility(id: string, updates: Partial<Facility>): Promise<Facility | null> {
  try {
    const updateObject: { [key: string]: any } = {};
    if (updates.name !== undefined) updateObject.name = updates.name;
    if (updates.description !== undefined) updateObject.description = updates.description;
    if (updates.address !== undefined) updateObject.address = updates.address;
    if (updates.contact_email !== undefined) updateObject.contact_email = updates.contact_email;
    if (updates.contact_phone !== undefined) updateObject.contact_phone = updates.contact_phone;
    if (updates.status !== undefined) updateObject.status = updates.status;
    if (updates.organization_id !== undefined) updateObject.organization_id = updates.organization_id;
    if (updates.country !== undefined) updateObject.country = updates.country;
    if (updates.state !== undefined) updateObject.state = updates.state;
    if (updates.city !== undefined) updateObject.city = updates.city;
    if (updates.zipcode !== undefined) updateObject.zipcode = updates.zipcode;
    if (updates.facility_type !== undefined) updateObject.facility_type = updates.facility_type;
    if (updates.location_data !== undefined) updateObject.location_data = updates.location_data;

    const { data, error } = await supabase
      .from('facilities')
      .update(updateObject)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating facility:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateFacility:', error);
    return null;
  }
}

export async function deleteFacility(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting facility:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFacility:', error);
    return false;
  }
}
