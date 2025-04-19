
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

// Get facilities - Renamed from fetchFacilities for compatibility
export const getFacilities = async (organizationId?: string, onlyAssigned?: boolean): Promise<Facility[]> => {
  try {
    // Call the RPC function which handles permissions and filtering
    const { data, error } = await supabase.rpc('get_facilities', {
      p_organization_id: organizationId || null,
      p_only_assigned: onlyAssigned || false
    });
    
    if (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFacilities:', error);
    return [];
  }
};

// Alias for backward compatibility
export const fetchFacilities = getFacilities;

// Create a new facility
export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert(facilityData)
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

// Update an existing facility
export const updateFacility = async (id: string, facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update(facilityData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating facility with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in updateFacility for ID ${id}:`, error);
    throw error;
  }
};

// Delete a facility
export const deleteFacility = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting facility with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteFacility for ID ${id}:`, error);
    throw error;
  }
};

export default {
  getFacilities,
  fetchFacilities,
  createFacility,
  updateFacility,
  deleteFacility
};
