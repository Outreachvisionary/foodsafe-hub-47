
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

/**
 * Centralized error handling for Supabase operations
 */
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  
  // Handle specific error types
  if (error?.code === 'PGRST116') {
    return 'No data found';
  }
  
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  
  if (error?.code === '23503') {
    return 'Cannot delete this record as it is referenced by other data';
  }
  
  return error?.message || `${operation} failed`;
};

/**
 * Check if user is authenticated and return user ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

/**
 * Fetch facilities from Supabase with error handling
 */
export const fetchFacilities = async (): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (error) {
      console.error('Error fetching facilities:', handleSupabaseError(error, 'fetch facilities'));
      return [];
    }
    
    return data as Facility[];
  } catch (error) {
    console.error('Unexpected error fetching facilities:', error);
    return [];
  }
};

/**
 * Insert data into facilities table
 */
export const insertFacility = async (facilityData: Partial<Facility>): Promise<Facility | null> => {
  try {
    const userId = await getCurrentUserId();
    
    const insertData = {
      ...facilityData,
      created_by: userId || 'system',
    };
    
    const { data, error } = await supabase
      .from('facilities')
      .insert(insertData)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error inserting facility:', handleSupabaseError(error, 'insert facility'));
      return null;
    }
    
    return data as Facility;
  } catch (error) {
    console.error('Unexpected error inserting facility:', error);
    return null;
  }
};

/**
 * Update facility data
 */
export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility | null> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating facility:', handleSupabaseError(error, 'update facility'));
      return null;
    }
    
    return data as Facility;
  } catch (error) {
    console.error('Unexpected error updating facility:', error);
    return null;
  }
};

/**
 * Delete facility (soft delete by updating status)
 */
export const deleteFacility = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('facilities')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting facility:', handleSupabaseError(error, 'delete facility'));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting facility:', error);
    return false;
  }
};

/**
 * Fetch non-conformances with error handling
 */
export const fetchNonConformances = async () => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching non-conformances:', handleSupabaseError(error, 'fetch non-conformances'));
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching non-conformances:', error);
    return [];
  }
};

/**
 * Fetch CAPAs with error handling
 */
export const fetchCapas = async () => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPAs:', handleSupabaseError(error, 'fetch CAPAs'));
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching CAPAs:', error);
    return [];
  }
};

export default {
  handleSupabaseError,
  getCurrentUserId,
  fetchFacilities,
  insertFacility,
  updateFacility,
  deleteFacility,
  fetchNonConformances,
  fetchCapas,
};
