
import { supabase } from '@/integrations/supabase/client';
import { Facility as TypedFacility } from '@/types/facility';

export interface Facility {
  id?: string;
  organization_id?: string;
  name?: string;
  description?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  facility_type?: string;
}

export const createFacility = async (facilityData: Omit<Facility, 'id' | 'created_at' | 'updated_at'>): Promise<TypedFacility> => {
  try {
    // Ensure name is provided as it's required
    if (!facilityData.name) {
      throw new Error('Facility name is required');
    }

    const dataToInsert = {
      name: facilityData.name,
      organization_id: facilityData.organization_id,
      description: facilityData.description || '',
      address: facilityData.address || '',
      contact_email: facilityData.contact_email || '',
      contact_phone: facilityData.contact_phone || '',
      status: facilityData.status || 'active',
      country: facilityData.country || '',
      state: facilityData.state || '',
      city: facilityData.city || '',
      zipcode: facilityData.zipcode || '',
      facility_type: facilityData.facility_type || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('facilities')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }

    return data as TypedFacility;
  } catch (error) {
    console.error('Error in createFacility:', error);
    throw error;
  }
};

export const getFacilities = async (): Promise<TypedFacility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }

    return data as TypedFacility[];
  } catch (error) {
    console.error('Error in getFacilities:', error);
    return [];
  }
};

export const getFacilityById = async (id: string): Promise<TypedFacility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching facility:', error);
      throw error;
    }

    return data as TypedFacility;
  } catch (error) {
    console.error('Error in getFacilityById:', error);
    throw error;
  }
};

export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<TypedFacility> => {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('facilities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating facility:', error);
      throw error;
    }

    return data as TypedFacility;
  } catch (error) {
    console.error('Error in updateFacility:', error);
    throw error;
  }
};

export const deleteFacility = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting facility:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteFacility:', error);
    throw error;
  }
};

export default {
  createFacility,
  getFacilities,
  getFacilityById,
  updateFacility,
  deleteFacility
};
