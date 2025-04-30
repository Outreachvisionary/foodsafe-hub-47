
import { CAPA, CAPAStats, CAPAFilter, CAPAActivity } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { createEmptyCAPAPriorityRecord, createEmptyCAPASourceRecord } from '@/utils/typeAdapters';

/**
 * Fetch CAPAs with optional filtering
 */
export const getCAPAs = async (filter?: CAPAFilter): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capa_actions').select('*');
    
    if (filter) {
      if (filter.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        const statusStrings = statuses.map(status => status.toString().replace(/_/g, ' '));
        query = query.in('status', statusStrings);
      }
      
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
        const priorityStrings = priorities.map(priority => priority.toString());
        query = query.in('priority', priorityStrings);
      }
      
      if (filter.source) {
        const sources = Array.isArray(filter.source) ? filter.source : [filter.source];
        const sourceStrings = sources.map(source => source.toString().replace(/_/g, ' '));
        query = query.in('source', sourceStrings);
      }
      
      if (filter.department) {
        const departments = Array.isArray(filter.department) ? filter.department : [filter.department];
        query = query.in('department', departments);
      }
      
      if (filter.dateRange) {
        if (filter.dateRange.start) {
          query = query.gte('created_at', filter.dateRange.start);
        }
        if (filter.dateRange.end) {
          query = query.lte('created_at', filter.dateRange.end);
        }
      }
      
      if (filter.searchTerm) {
        query = query.or(`title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as CAPA[] || [];
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

/**
 * Get a specific CAPA by ID
 */
export const getCAPA = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as CAPA;
  } catch (error) {
    console.error(`Error fetching CAPA ${id}:`, error);
    return null;
  }
};

/**
 * Get CAPA activities
 */
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });
    
    if (error) throw error;
    
    return data as CAPAActivity[] || [];
  } catch (error) {
    console.error(`Error fetching activities for CAPA ${capaId}:`, error);
    return [];
  }
};

/**
 * Create a new CAPA
 */
export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .insert([capaData])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as CAPA;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    return null;
  }
};

/**
 * Update an existing CAPA
 */
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as CAPA;
  } catch (error) {
    console.error(`Error updating CAPA ${id}:`, error);
    return null;
  }
};

/**
 * Get recent CAPAs for dashboard
 */
export const getRecentCAPAs = async (limit: number = 5): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data as CAPA[] || [];
  } catch (error) {
    console.error('Error fetching recent CAPAs:', error);
    return [];
  }
};

/**
 * Get CAPA statistics
 */
export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*');
    
    if (error) throw error;
    
    const stats: CAPAStats = {
      total: data.length,
      open: data.filter(capa => capa.status === 'Open').length,
      inProgress: data.filter(capa => capa.status === 'In Progress').length,
      completed: data.filter(capa => capa.status === 'Completed').length,
      overdue: data.filter(capa => {
        if (!capa.due_date) return false;
        return new Date(capa.due_date) < new Date() && ['Open', 'In Progress'].includes(capa.status);
      }).length,
      byPriority: createEmptyCAPAPriorityRecord(),
      bySource: createEmptyCAPASourceRecord(),
      byDepartment: {},
      recentActivities: []
    };
    
    // Process priority stats
    data.forEach(capa => {
      // Handle priorities
      const priority = capa.priority as string;
      if (priority) {
        const enumKey = priority.replace(/ /g, '') as CAPAPriority;
        if (stats.byPriority[enumKey] !== undefined) {
          stats.byPriority[enumKey]++;
        }
      }
      
      // Handle sources
      const source = capa.source as string;
      if (source) {
        const enumKey = source.replace(/ /g, '_') as CAPASource;
        if (stats.bySource[enumKey] !== undefined) {
          stats.bySource[enumKey]++;
        }
      }
      
      // Handle departments
      const department = capa.department as string;
      if (department) {
        if (!stats.byDepartment[department]) {
          stats.byDepartment[department] = 0;
        }
        stats.byDepartment[department]++;
      }
    });
    
    // Get recent activities
    const { data: activities, error: actError } = await supabase
      .from('capa_activities')
      .select('*')
      .order('performed_at', { ascending: false })
      .limit(10);
    
    if (!actError && activities) {
      stats.recentActivities = activities;
    }
    
    return stats;
  } catch (error) {
    console.error('Error fetching CAPA stats:', error);
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      byPriority: createEmptyCAPAPriorityRecord(),
      bySource: createEmptyCAPASourceRecord(),
      byDepartment: {},
      recentActivities: []
    };
  }
};
