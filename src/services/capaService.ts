
import { supabase } from '@/integrations/supabase/client';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  created_by: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  source?: string;
  source_id?: string;
}

export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .insert(capaData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

export const deleteCAPA = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting CAPA:', error);
    throw error;
  }
};
