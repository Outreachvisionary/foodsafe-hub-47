
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAEffectivenessMetrics, CAPAAction } from '@/types/capa';
import { mapStatusFromDb, mapStatusToDb } from './capaStatusService';

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

    // Map the database status values to UI status values
    const mappedData = data?.map(item => ({
      ...item,
      status: mapStatusFromDb(item.status as string)
    })) || [];

    return mappedData;
  } catch (error) {
    console.error('Error in fetchCAPAActions:', error);
    throw error;
  }
};

export const createCAPAAction = async (capaAction: Omit<CAPAAction, 'id' | 'created_at' | 'updated_at'>): Promise<CAPAAction> => {
  try {
    // Map UI status to DB status before saving
    const dbCAPAAction = {
      ...capaAction,
      status: mapStatusToDb(capaAction.status)
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert([dbCAPAAction])
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA action:', error);
      throw error;
    }

    // Map the database status back to UI status
    return {
      ...data,
      status: mapStatusFromDb(data.status as string)
    };
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

    if (!data) return null;

    // Map the database status to UI status
    return {
      ...data,
      status: mapStatusFromDb(data.status as string)
    };
  } catch (error) {
    console.error('Error in fetchCAPAActionById:', error);
    throw error;
  }
};

export const updateCAPAAction = async (id: string, updates: Partial<CAPAAction>): Promise<CAPAAction> => {
  try {
    // Map UI status to DB status if status is being updated
    const dbUpdates = {
      ...updates,
      status: updates.status ? mapStatusToDb(updates.status) : undefined
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA action:', error);
      throw error;
    }

    // Map the database status back to UI status
    return {
      ...data,
      status: mapStatusFromDb(data.status as string)
    };
  } catch (error) {
    console.error('Error in updateCAPAAction:', error);
    throw error;
  }
};

export const updateCAPAStatus = async (id: string, newStatus: CAPAStatus): Promise<void> => {
  try {
    // Map UI status to DB status
    const dbStatus = mapStatusToDb(newStatus);

    const { error } = await supabase
      .from('capa_actions')
      .update({ status: dbStatus })
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

export const fetchCAPAs = async (filters?: any): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        // Map UI status to DB status for filtering
        query = query.eq('status', mapStatusToDb(filters.status));
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

    // Map the database status values to UI status values
    const mappedData = data?.map(item => ({
      ...item,
      status: mapStatusFromDb(item.status as string)
    })) || [];

    return mappedData;
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

    // Map the database status to UI status
    return {
      ...data,
      status: mapStatusFromDb(data.status as string)
    };
  } catch (error) {
    console.error('Error in fetchCAPAById:', error);
    throw error;
  }
};

export const createCAPA = async (capaData: Omit<CAPA, 'id' | 'created_at' | 'updated_at' | 'lastUpdated'>): Promise<CAPA> => {
  try {
    // Map UI status to DB status before saving
    const dbCAPAData = {
      ...capaData,
      status: mapStatusToDb(capaData.status),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert([dbCAPAData])
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      throw error;
    }

    // Map the database status back to UI status
    return {
      ...data,
      status: mapStatusFromDb(data.status as string)
    };
  } catch (error) {
    console.error('Error in createCAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Map UI status to DB status if status is being updated
    const dbUpdates = {
      ...updates,
      status: updates.status ? mapStatusToDb(updates.status) : undefined,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      throw error;
    }

    // Map the database status back to UI status
    return {
      ...data,
      status: mapStatusFromDb(data.status as string)
    };
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
    
    // Initialize default structure to ensure all expected properties exist
    const statsResult = {
      total: capaData?.length || 0,
      byStatus: {
        open: 0,
        'in-progress': 0,
        closed: 0,
        verified: 0
      },
      byPriority: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      bySource: {
        audit: 0,
        haccp: 0,
        supplier: 0,
        complaint: 0,
        traceability: 0,
        nonconformance: 0
      },
      overdue: 0,
      recentItems: [],
      completionRates: {},
      effectivenessStats: {
        effective: 0,
        partiallyEffective: 0,
        ineffective: 0,
        notEvaluated: 0
      },
      averageTimeToClose: 0,
      averageClosureTime: 0,
      fsma204ComplianceRate: 0
    };
    
    // Process data to populate the stats
    if (capaData && capaData.length > 0) {
      // Calculate status counts
      capaData.forEach(capa => {
        // Status counts
        const statusKey = capa.status?.toLowerCase() || 'open';
        const status = statusKey === 'in progress' ? 'in-progress' : statusKey;
        if (statsResult.byStatus.hasOwnProperty(status)) {
          statsResult.byStatus[status]++;
        }
        
        // Priority counts
        const priority = capa.priority?.toLowerCase() || 'medium';
        if (statsResult.byPriority.hasOwnProperty(priority)) {
          statsResult.byPriority[priority]++;
        }
        
        // Source counts
        const source = capa.source?.toLowerCase() || 'audit';
        if (statsResult.bySource.hasOwnProperty(source)) {
          statsResult.bySource[source]++;
        }
        
        // Calculate overdue items
        const dueDate = capa.due_date ? new Date(capa.due_date) : null;
        const now = new Date();
        if (dueDate && dueDate < now && capa.status !== 'Closed' && capa.status !== 'Verified') {
          statsResult.overdue++;
        }
      });
      
      // Get the most recent 5 items
      statsResult.recentItems = capaData
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      // Calculate average time to close
      const closedCapas = capaData.filter(capa => capa.status === 'Closed' || capa.status === 'Verified');
      if (closedCapas.length > 0) {
        const totalDays = closedCapas.reduce((sum, capa) => {
          const createdDate = new Date(capa.created_at);
          const completedDate = capa.completion_date ? new Date(capa.completion_date) : new Date();
          const daysToClose = Math.ceil((completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + daysToClose;
        }, 0);
        
        statsResult.averageTimeToClose = Math.round(totalDays / closedCapas.length);
        statsResult.averageClosureTime = Math.round(totalDays / closedCapas.length);
      }
    }
    
    return statsResult;
  } catch (error) {
    console.error('Error in getCAPAStats:', error);
    // Return default structure even if there's an error to prevent undefined errors
    return {
      total: 0,
      byStatus: {
        open: 0,
        'in-progress': 0,
        closed: 0,
        verified: 0
      },
      byPriority: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      bySource: {
        audit: 0,
        haccp: 0,
        supplier: 0,
        complaint: 0,
        traceability: 0,
        nonconformance: 0
      },
      overdue: 0,
      recentItems: [],
      completionRates: {},
      effectivenessStats: {
        effective: 0,
        partiallyEffective: 0,
        ineffective: 0,
        notEvaluated: 0
      },
      averageTimeToClose: 0,
      averageClosureTime: 0,
      fsma204ComplianceRate: 0
    };
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
