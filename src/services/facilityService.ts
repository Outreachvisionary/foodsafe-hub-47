import { supabase } from '@/integrations/supabase/client';

interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  organization_id?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  created_at?: string;
  updated_at?: string;
}

export const getFacilities = async (): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

export const createFacility = async (facilityData: any) => {
  try {
    // Make sure the data matches the required shape
    const facilityToCreate = {
      ...facilityData,
      organization_id: facilityData.organization_id || '',  // Ensure required field
      created_at: facilityData.created_at || new Date().toISOString(),
      updated_at: facilityData.updated_at || new Date().toISOString(),
      // Handle location_data properly by keeping it as an object if present
    };

    const { data, error } = await supabase
      .from('facilities')
      .insert([facilityToCreate])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
};

export const getFacilityById = async (id: string): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching facility by ID:', error);
    throw error;
  }
};

export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating facility:', error);
    throw error;
  }
};

export const deleteFacility = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};

export const adaptFacility = (facility: any): Facility => {
  return {
    id: facility.id,
    name: facility.name,
    description: facility.description || '',
    address: facility.address || '',
    contact_email: facility.contact_email || '',
    contact_phone: facility.contact_phone || '',
    organization_id: facility.organization_id || '',
    location_data: facility.location_data || {},
    created_at: facility.created_at,
    updated_at: facility.updated_at,
    country: facility.country || '',
    state: facility.state || '',
    city: facility.city || '',
    zipcode: facility.zipcode || '',
    status: facility.status || 'active', // Ensure status has a default value
  };
};

export default {
  getFacilities,
  createFacility,
  getFacilityById,
  updateFacility,
  deleteFacility,
  adaptFacility
};
