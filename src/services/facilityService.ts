
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

export const getFacilities = async (organizationId?: string, onlyAssigned: boolean = false): Promise<Facility[]> => {
  try {
    let query = supabase
      .from('facilities')
      .select('*')
      .eq('status', 'active');
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFacilities:', error);
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
        // No rows returned
        return null;
      }
      console.error('Error fetching facility by ID:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getFacilityById:', error);
    throw error;
  }
};

export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert([facilityData])
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
};

export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility> => {
  try {
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
    
    return data;
  } catch (error) {
    console.error('Error in updateFacility:', error);
    throw error;
  }
};

export const deleteFacility = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .update({ status: 'inactive' })
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
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
};
