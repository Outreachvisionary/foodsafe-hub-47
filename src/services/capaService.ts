
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStats, CAPAActivity } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';

// Fetch all CAPAs or filtered by parameters
export const getCAPAs = async (filters?: any): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capa_actions').select('*');
    
    if (filters) {
      // Apply filters if provided
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPAs:', error);
      throw error;
    }
    
    // Convert database records to CAPA type
    const capas = data.map(item => ({
      ...item,
      id: item.id,
      status: item.status as CAPAStatus,
      priority: item.priority as CAPAPriority,
      source: item.source as CAPASource,
    }));
    
    return capas as CAPA[];
  } catch (error) {
    console.error('Error in getCAPAs:', error);
    // Return empty array on error
    return [];
  }
};

// Get a specific CAPA by ID
export const getCAPA = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching CAPA ${id}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    // Convert to CAPA type
    const capa: CAPA = {
      ...data,
      id: data.id,
      status: data.status as CAPAStatus,
      priority: data.priority as CAPAPriority,
      source: data.source as CAPASource,
    };
    
    return capa;
  } catch (error) {
    console.error('Error in getCAPA:', error);
    return null;
  }
};

// Update a CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error(`Error updating CAPA ${id}:`, error);
      throw error;
    }
    
    // Convert to CAPA type
    const updatedCAPA: CAPA = {
      ...data,
      id: data.id,
      status: data.status as CAPAStatus,
      priority: data.priority as CAPAPriority,
      source: data.source as CAPASource,
    };
    
    return updatedCAPA;
  } catch (error) {
    console.error('Error in updateCAPA:', error);
    throw error;
  }
};

// Get CAPA activities by CAPA ID
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching activities for CAPA ${capaId}:`, error);
      throw error;
    }
    
    return data as CAPAActivity[];
  } catch (error) {
    console.error('Error in getCAPAActivities:', error);
    return [];
  }
};

// Get statistics for CAPAs
export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const { data: allCapas, error } = await supabase
      .from('capa_actions')
      .select('*');
    
    if (error) {
      console.error('Error fetching CAPAs for stats:', error);
      throw error;
    }
    
    // Initialize statistics object
    const stats: CAPAStats = {
      total: allCapas.length,
      open: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      byPriority: {} as Record<CAPAPriority, number>,
      bySource: {} as Record<CAPASource, number>,
      byDepartment: {},
      recentActivities: []
    };
    
    // Initialize counters for each priority and source
    Object.values(CAPAPriority).forEach(priority => {
      stats.byPriority[priority] = 0;
    });
    
    Object.values(CAPASource).forEach(source => {
      stats.bySource[source] = 0;
    });
    
    // Calculate statistics
    allCapas.forEach(capa => {
      // Count by status
      switch (capa.status) {
        case CAPAStatus.Open:
          stats.open++;
          break;
        case CAPAStatus.InProgress:
          stats.inProgress++;
          break;
        case CAPAStatus.Completed:
        case CAPAStatus.Verified:
        case CAPAStatus.Closed:
          stats.completed++;
          break;
        case CAPAStatus.Overdue:
          stats.overdue++;
          break;
      }
      
      // Count by priority
      if (capa.priority) {
        stats.byPriority[capa.priority as CAPAPriority] = 
          (stats.byPriority[capa.priority as CAPAPriority] || 0) + 1;
      }
      
      // Count by source
      if (capa.source) {
        stats.bySource[capa.source as CAPASource] = 
          (stats.bySource[capa.source as CAPASource] || 0) + 1;
      }
      
      // Count by department
      if (capa.department) {
        stats.byDepartment[capa.department] = 
          (stats.byDepartment[capa.department] || 0) + 1;
      }
    });
    
    // Get recent activities
    const { data: recentActivities } = await supabase
      .from('capa_activities')
      .select('*')
      .order('performed_at', { ascending: false })
      .limit(5);
    
    if (recentActivities) {
      stats.recentActivities = recentActivities as CAPAActivity[];
    }
    
    return stats;
  } catch (error) {
    console.error('Error in getCAPAStats:', error);
    
    // Return empty stats on error
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      byPriority: {} as Record<CAPAPriority, number>,
      bySource: {} as Record<CAPASource, number>,
      byDepartment: {},
      recentActivities: []
    };
  }
};

// Create a new CAPA
export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .insert([capaData])
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating CAPA:', error);
      throw error;
    }
    
    // Convert to CAPA type
    const newCAPA: CAPA = {
      ...data,
      id: data.id,
      status: data.status as CAPAStatus,
      priority: data.priority as CAPAPriority,
      source: data.source as CAPASource,
    };
    
    return newCAPA;
  } catch (error) {
    console.error('Error in createCAPA:', error);
    throw error;
  }
};
