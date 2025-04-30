
import { supabase } from '@/integrations/supabase/client';
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';
import { convertDatabaseCAPAToModel, createEmptyCAPAPriorityRecord, createEmptyCAPASourceRecord } from '@/utils/typeAdapters';

// Interface for CAPA statistics
export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<CAPASource, number>;
  byDepartment: Record<string, number>;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
  recentActivities: any[];
}

// Interface for CAPA filter parameters
export interface CAPAFilter {
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  department?: string;
  assignedTo?: string;
  dueStartDate?: string;
  dueEndDate?: string;
  searchTerm?: string;
}

// Get a list of CAPAs based on filter criteria
export const getCAPAs = async (filter?: CAPAFilter): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capas').select('*');
    
    if (filter) {
      if (filter.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        // Convert enum values to strings for the database
        const statusStrings = statuses.map(status => status.toString().replace(/_/g, ' '));
        query = query.in('status', statusStrings);
      }
      
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
        query = query.in('priority', priorities);
      }
      
      if (filter.source) {
        const sources = Array.isArray(filter.source) ? filter.source : [filter.source];
        query = query.in('source', sources);
      }
      
      if (filter.department) {
        query = query.eq('department', filter.department);
      }
      
      if (filter.assignedTo) {
        query = query.eq('assigned_to', filter.assignedTo);
      }
      
      if (filter.dueStartDate) {
        query = query.gte('due_date', filter.dueStartDate);
      }
      
      if (filter.dueEndDate) {
        query = query.lte('due_date', filter.dueEndDate);
      }
      
      if (filter.searchTerm) {
        query = query.or(`title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
      }
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPAs:', error);
      return [];
    }
    
    // Convert database models to application models
    return (data || []).map(dbCapa => convertDatabaseCAPAToModel(dbCapa));
  } catch (error) {
    console.error('Exception fetching CAPAs:', error);
    return [];
  }
};

// Get a single CAPA by ID
export const getCAPA = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching CAPA:', error);
      return null;
    }
    
    return convertDatabaseCAPAToModel(data);
  } catch (error) {
    console.error('Exception fetching CAPA:', error);
    return null;
  }
};

// Create a new CAPA
export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    // Set default values for required fields
    const newCAPA = {
      status: CAPAStatus.Open,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...capaData
    };
    
    const { data, error } = await supabase
      .from('capas')
      .insert([newCAPA])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating CAPA:', error);
      return null;
    }
    
    return convertDatabaseCAPAToModel(data);
  } catch (error) {
    console.error('Exception creating CAPA:', error);
    return null;
  }
};

// Update an existing CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    // Always update the 'updated_at' timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('capas')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating CAPA:', error);
      return null;
    }
    
    return convertDatabaseCAPAToModel(data);
  } catch (error) {
    console.error('Exception updating CAPA:', error);
    return null;
  }
};

// Delete a CAPA
export const deleteCAPA = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('capas')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting CAPA:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception deleting CAPA:', error);
    return false;
  }
};

// Get recent CAPAs (e.g., for dashboard)
export const getRecentCAPAs = async (limit: number = 5): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent CAPAs:', error);
      return [];
    }
    
    return (data || []).map(dbCapa => convertDatabaseCAPAToModel(dbCapa));
  } catch (error) {
    console.error('Exception fetching recent CAPAs:', error);
    return [];
  }
};

// Get CAPA activities for a specific CAPA
export const getCAPAActivities = async (capaId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPA activities:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching CAPA activities:', error);
    return [];
  }
};

// Get CAPA statistics
export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    // Get all CAPAs
    const allCAPAs = await getCAPAs();
    
    // Initialize counters
    const byPriority = createEmptyCAPAPriorityRecord();
    const bySource = createEmptyCAPASourceRecord();
    const byStatus: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    
    let openCount = 0;
    let closedCount = 0;
    let overdueCount = 0;
    let pendingVerificationCount = 0;
    
    // Process each CAPA
    allCAPAs.forEach(capa => {
      // Count by priority
      if (capa.priority && byPriority[capa.priority]) {
        byPriority[capa.priority]++;
      }
      
      // Count by source
      if (capa.source && bySource[capa.source]) {
        bySource[capa.source]++;
      }
      
      // Count by status
      const status = capa.status?.toString() || '';
      byStatus[status] = (byStatus[status] || 0) + 1;
      
      // Count by department
      if (capa.department) {
        byDepartment[capa.department] = (byDepartment[capa.department] || 0) + 1;
      }
      
      // Count by month
      const month = capa.created_at.substring(0, 7); // YYYY-MM
      byMonth[month] = (byMonth[month] || 0) + 1;
      
      // Aggregate counts
      if (capa.status === CAPAStatus.Open || capa.status === CAPAStatus.InProgress) {
        openCount++;
      } else if (capa.status === CAPAStatus.Closed || capa.status === CAPAStatus.Completed) {
        closedCount++;
      }
      
      if (capa.status === CAPAStatus.Overdue) {
        overdueCount++;
      }
      
      if (capa.status === CAPAStatus.PendingVerification) {
        pendingVerificationCount++;
      }
    });
    
    // Calculate effectiveness rate
    const effectivenessRate = allCAPAs.length > 0 
      ? Math.round((closedCount / allCAPAs.length) * 100) 
      : 0;
    
    return {
      total: allCAPAs.length,
      openCount,
      closedCount,
      overdueCount,
      pendingVerificationCount,
      effectivenessRate,
      byPriority,
      bySource,
      byDepartment,
      byStatus,
      byMonth,
      recentActivities: [] // This would typically come from a separate API call
    };
  } catch (error) {
    console.error('Exception calculating CAPA stats:', error);
    return {
      total: 0,
      openCount: 0,
      closedCount: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      effectivenessRate: 0,
      byPriority: createEmptyCAPAPriorityRecord(),
      bySource: createEmptyCAPASourceRecord(),
      byDepartment: {},
      byStatus: {},
      byMonth: {},
      recentActivities: []
    };
  }
};
