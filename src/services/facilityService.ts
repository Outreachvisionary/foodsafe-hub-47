
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches a facility by ID
 * @param facilityId The ID of the facility to fetch
 * @returns The facility object or null if not found
 */
export const getFacility = async (facilityId: string): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', facilityId)
      .single();
    
    if (error) {
      console.error('Error fetching facility:', error);
      return null;
    }
    
    return data as Facility;
  } catch (error) {
    console.error('Exception in getFacility:', error);
    return null;
  }
};

/**
 * Creates a new facility
 * @param facilityData The facility data to create
 * @returns The created facility object
 */
export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    // Ensure required fields are present
    if (!facilityData.name || !facilityData.organization_id) {
      throw new Error('Facility name and organization ID are required');
    }
    
    // Set default values if not provided
    const newFacility = {
      ...facilityData,
      status: facilityData.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('facilities')
      .insert(newFacility)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
    
    console.log('Facility created successfully:', data);
    return data as Facility;
  } catch (error: any) {
    console.error('Exception in createFacility:', error);
    toast({
      title: "Failed to create facility",
      description: error.message || "An unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Updates an existing facility
 * @param facilityId The ID of the facility to update
 * @param updates The updates to apply to the facility
 * @returns The updated facility object
 */
export const updateFacility = async (facilityId: string, updates: Partial<Facility>): Promise<Facility> => {
  try {
    // Add the updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('facilities')
      .update(updatedData)
      .eq('id', facilityId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating facility:', error);
      throw error;
    }
    
    console.log('Facility updated successfully:', data);
    return data as Facility;
  } catch (error: any) {
    console.error('Exception in updateFacility:', error);
    toast({
      title: "Failed to update facility",
      description: error.message || "An unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Deletes a facility
 * @param facilityId The ID of the facility to delete
 * @returns True if successful, false otherwise
 */
export const deleteFacility = async (facilityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', facilityId);
    
    if (error) {
      console.error('Error deleting facility:', error);
      throw error;
    }
    
    console.log('Facility deleted successfully:', facilityId);
    return true;
  } catch (error: any) {
    console.error('Exception in deleteFacility:', error);
    toast({
      title: "Failed to delete facility",
      description: error.message || "An unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Fetches facilities for an organization
 * @param organizationId The ID of the organization
 * @returns Array of facilities
 */
export const getFacilitiesByOrganization = async (organizationId: string): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('name');
    
    if (error) {
      console.error('Error fetching facilities by organization:', error);
      return [];
    }
    
    return data as Facility[] || [];
  } catch (error) {
    console.error('Exception in getFacilitiesByOrganization:', error);
    return [];
  }
};

export default {
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilitiesByOrganization
};
