import { supabase } from '@/integrations/supabase/client';
import { fetchCapas, fetchCapaById } from './capaService';

// Replace or fix the problematic functions
export const getCAPAs = async () => {
  return fetchCapas();
};

export const getCAPAById = async (id: string) => {
  return fetchCapaById(id);
};
