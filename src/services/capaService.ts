import { supabase } from '@/integrations/supabase/client';
import { CAPAAction, CAPAStatus } from '@/types/capa';

/**
 * Fetch all CAPA actions
 */
export const fetchCAPAActions = async (): Promise<CAPAAction[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching CAPA actions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCAPAActions:', error);
    throw error;
  }
};

/**
 * Create a new CAPA action
 */
export const createCAPAAction = async (capaAction: Omit<CAPAAction, 'id' | 'created_at' | 'updated_at'>): Promise<CAPAAction> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .insert([capaAction])
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA action:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createCAPAAction:', error);
    throw error;
  }
};

/**
 * Fetch a CAPA action by ID
 */
export const fetchCAPAActionById = async (id: string): Promise<CAPAAction | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching CAPA action by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchCAPAActionById:', error);
    throw error;
  }
};

/**
 * Update an existing CAPA action
 */
export const updateCAPAAction = async (id: string, updates: Partial<CAPAAction>): Promise<CAPAAction> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA action:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCAPAAction:', error);
    throw error;
  }
};

/**
 * Update the status of a CAPA action
 */
export const updateCAPAStatus = async (id: string, newStatus: CAPAStatus): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateCAPAStatus:', error);
    throw error;
  }
};

/**
 * Delete a CAPA action
 */
export const deleteCAPAAction = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting CAPA action:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteCAPAAction:', error);
    throw error;
  }
};

export default {
  fetchCAPAActions,
  createCAPAAction,
  fetchCAPAActionById,
  updateCAPAAction,
  updateCAPAStatus,
  deleteCAPAAction
};
