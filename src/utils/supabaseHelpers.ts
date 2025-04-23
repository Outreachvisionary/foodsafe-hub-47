
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/facility';

/**
 * Fetch facilities from Supabase
 * @returns Promise<Facility[]> Array of facilities
 */
export const fetchFacilities = async (): Promise<Facility[]> => {
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*');
    
    if (error) throw error;
    return data as Facility[];
  } catch (error) {
    console.error('Error in fetchFacilities:', error);
    return [];
  }
};
