
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAEffectivenessMetrics, CAPAAction } from '@/types/capa';

// Original functions
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

// New functions required by components
export const fetchCAPAs = async (filters?: any): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source);
      }
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching CAPAs:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCAPAs:', error);
    throw error;
  }
};

export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching CAPA by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchCAPAById:', error);
    throw error;
  }
};

export const createCAPA = async (capaData: Omit<CAPA, 'id' | 'created_at' | 'updated_at' | 'lastUpdated'>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .insert([{
        ...capaData,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createCAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCAPA:', error);
    throw error;
  }
};

export const deleteCAPA = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting CAPA:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteCAPA:', error);
    throw error;
  }
};

export const getCAPAStats = async (): Promise<any> => {
  try {
    const { data: capaData, error } = await supabase
      .from('capa_actions')
      .select('*');
    
    if (error) {
      console.error('Error fetching CAPA stats:', error);
      throw error;
    }
    
    // Process and return stats
    const total = capaData?.length || 0;
    const open = capaData?.filter(c => c.status === 'Open').length || 0;
    const inProgress = capaData?.filter(c => c.status === 'In Progress').length || 0;
    const closed = capaData?.filter(c => c.status === 'Closed').length || 0;
    const verified = capaData?.filter(c => c.status === 'Verified').length || 0;
    const byPriority = {
      critical: capaData?.filter(c => c.priority === 'critical').length || 0,
      high: capaData?.filter(c => c.priority === 'high').length || 0,
      medium: capaData?.filter(c => c.priority === 'medium').length || 0,
      low: capaData?.filter(c => c.priority === 'low').length || 0,
    };
    
    return { total, open, inProgress, closed, verified, byPriority };
  } catch (error) {
    console.error('Error in getCAPAStats:', error);
    throw error;
  }
};

export const getPotentialCAPAs = async (): Promise<any[]> => {
  // In a real implementation, this would search for potential issues
  // For now, return mock data
  return [
    {
      id: 'auto-capa-1',
      title: 'Critical temperature deviation in storage area',
      description: 'Temperature log showing consistent deviation above acceptable threshold in cold storage area B',
      source: 'haccp',
      sourceId: 'haccp-monitoring-123',
      date: new Date().toISOString(),
      severity: 'Critical',
      confidence: 0.92
    },
    {
      id: 'auto-capa-2',
      title: 'Multiple supplier quality issues detected',
      description: 'Recurring quality issues with ingredient batches from Supplier XYZ',
      source: 'supplier',
      sourceId: 'supplier-eval-456',
      date: new Date().toISOString(),
      severity: 'Major',
      confidence: 0.87
    }
  ];
};

export const saveEffectivenessMetrics = async (capaId: string, metrics: CAPAEffectivenessMetrics): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('capa_effectiveness_assessments')
      .insert([{
        capa_id: capaId,
        assessment_date: new Date().toISOString(),
        root_cause_eliminated: metrics.rootCauseEliminated,
        preventive_measures_implemented: metrics.preventiveMeasuresImplemented,
        documentation_complete: metrics.documentationComplete,
        score: metrics.score,
        notes: metrics.notes,
        created_by: 'system' // This should be the current user
      }])
      .select();

    if (error) {
      console.error('Error saving effectiveness metrics:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Error in saveEffectivenessMetrics:', error);
    throw error;
  }
};

export const getEffectivenessMetrics = async (capaId: string): Promise<CAPAEffectivenessMetrics | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_effectiveness_assessments')
      .select('*')
      .eq('capa_id', capaId)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching effectiveness metrics:', error);
      throw error;
    }

    if (!data) return null;

    return {
      rootCauseEliminated: data.root_cause_eliminated,
      preventiveMeasuresImplemented: data.preventive_measures_implemented,
      documentationComplete: data.documentation_complete,
      score: data.score,
      checkedDate: data.assessment_date,
      notes: data.notes
    };
  } catch (error) {
    console.error('Error in getEffectivenessMetrics:', error);
    throw error;
  }
};

// Default export for compatibility
export default {
  fetchCAPAActions,
  createCAPAAction,
  fetchCAPAActionById,
  updateCAPAAction,
  updateCAPAStatus,
  deleteCAPAAction,
  fetchCAPAs,
  fetchCAPAById,
  createCAPA,
  updateCAPA,
  deleteCAPA,
  getCAPAStats,
  getPotentialCAPAs,
  saveEffectivenessMetrics,
  getEffectivenessMetrics
};
