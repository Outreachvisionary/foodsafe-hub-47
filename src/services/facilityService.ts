
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';
import { fetchFacilities as fetchFacilitiesFromSupabase } from '@/utils/supabaseHelpers';

/**
 * Get all facilities
 * @returns {Promise<Facility[]>} Array of facilities
 */
export const getFacilities = async (): Promise<Facility[]> => {
  try {
    // Use the supabaseHelpers function that's already set up correctly
    const facilities = await fetchFacilitiesFromSupabase();
    return facilities;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
};

/**
 * Create a new facility
 * @param {Partial<Facility>} facility - The facility data
 * @returns {Promise<Facility | null>} The created facility or null if there was an error
 */
export const createFacility = async (facility: Partial<Facility>): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert(facility)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating facility:', error);
    return null;
  }
};

/**
 * Update a facility
 * @param {string} id - The facility ID
 * @param {Partial<Facility>} updates - The updates to apply
 * @returns {Promise<Facility | null>} The updated facility or null if there was an error
 */
export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating facility ${id}:`, error);
    return null;
  }
};

/**
 * Delete a facility
 * @param {string} id - The facility ID
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const deleteFacility = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting facility ${id}:`, error);
    return false;
  }
};

/**
 * Get a facility by ID
 * @param {string} id - The facility ID
 * @returns {Promise<Facility | null>} The facility or null if not found
 */
export const getFacilityById = async (id: string): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching facility ${id}:`, error);
    return null;
  }
};

/**
 * Get facilities by organization ID
 * @param {string} organizationId - The organization ID
 * @returns {Promise<Facility[]>} Array of facilities
 */
export const getFacilitiesByOrganization = async (organizationId: string): Promise<Facility[]> => {
  try {
    // Use the fetchFacilities helper passing the organizationId
    const facilities = await fetchFacilitiesFromSupabase(organizationId);
    return facilities;
  } catch (error) {
    console.error(`Error fetching facilities for organization ${organizationId}:`, error);
    return [];
  }
};

export { fetchFacilitiesFromSupabase };
