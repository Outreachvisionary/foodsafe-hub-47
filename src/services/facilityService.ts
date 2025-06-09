
import { supabase } from '@/integrations/supabase/client';

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

export const createFacility = async (facilityData: Omit<Facility, 'id' | 'created_at' | 'updated_at'>): Promise<Facility> => {
  try {
    const dataToInsert = {
      ...facilityData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Ensure name is provided as it's required
    if (!dataToInsert.name) {
      throw new Error('Facility name is required');
    }

    const { data, error } = await supabase
      .from('facilities')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }

    return data as Facility;
  } catch (error) {
    console.error('Error in createFacility:', error);
    throw error;
  }
};

export const getFacilities = async (): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }

    return data as Facility[];
  } catch (error) {
    console.error('Error in getFacilities:', error);
    return [];
  }
};

export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility> => {
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

    return data as Facility;
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
  updateFacility,
  deleteFacility
};
