
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Facility {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  status: 'active' | 'inactive';
  organization_id: string; // Make this required like in the database
}

export const getFacilities = async (organizationId?: string): Promise<Facility[]> => {
  try {
    let query = supabase
      .from('facilities')
      .select('*')
      .order('name', { ascending: true });
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    toast.error('Failed to fetch facilities');
    return [];
  }
};

// Alias for backward compatibility
export const fetchFacilities = getFacilities;

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
    console.error('Error fetching facility by ID:', error);
    toast.error('Failed to fetch facility details');
    return null;
  }
};

// Alias for backward compatibility
export const fetchFacilityById = getFacilityById;

export const createFacility = async (facilityData: Omit<Facility, 'id'>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .insert(facilityData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Facility created successfully');
    return data;
  } catch (error) {
    console.error('Error creating facility:', error);
    toast.error('Failed to create facility');
    throw error;
  }
};

export const updateFacility = async (id: string, facilityData: Partial<Facility>): Promise<Facility> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update(facilityData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Facility updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating facility:', error);
    toast.error('Failed to update facility');
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
    
    toast.success('Facility deleted successfully');
  } catch (error) {
    console.error('Error deleting facility:', error);
    toast.error('Failed to delete facility');
    throw error;
  }
};

// Export a type that contains both property versions for compatibility
export type FacilityData = Facility & {
  organizationId?: string; // For UI components expecting camelCase
};
