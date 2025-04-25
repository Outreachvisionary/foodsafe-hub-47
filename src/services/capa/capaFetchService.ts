
import { supabase } from '@/integrations/supabase/client';
import { fetchCapas } from './capaService';

// Replace or fix the problematic functions
export const getCAPAs = async () => {
  return fetchCapas();
};

export const getCAPAById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching CAPA by ID:', error);
    throw error;
  }
};

// Add alias for backwards compatibility
export const fetchCAPAById = getCAPAById;
