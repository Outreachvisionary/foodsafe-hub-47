
import { CAPA, CAPAStats, CAPAFilter } from '@/types/capa';
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
