
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAFilterParams, CAPAStats } from '@/types/capa';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdDate: string;
  dueDate: string;
  assignedTo: string;
  source: string;
  sourceId: string;
}

interface CAPAFilterParams {
  sourceId?: string;
  source?: string;
  status?: string[];
  priority?: string[];
}

// Fetch CAPAs with optional filtering
export const fetchCAPAs = async (filters?: CAPAFilterParams): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      if (filters.sourceId) {
        query = query.eq('source_id', filters.sourceId);
      }
      
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      
      if (filters.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching CAPAs:', error);
      throw error;
    }
    
    // Transform the data to match the CAPA interface
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      status: item.status.toLowerCase(),
      priority: item.priority.toLowerCase(),
      createdDate: item.created_at,
      dueDate: item.due_date,
      assignedTo: item.assigned_to,
      source: item.source,
      sourceId: item.source_id || ''
    }));
  } catch (error) {
    console.error('Error in fetchCAPAs:', error);
    throw error;
  }
};

// Fetch a single CAPA by ID
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching CAPA with ID ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status.toLowerCase(),
      priority: data.priority.toLowerCase(),
      createdDate: data.created_at,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      source: data.source,
      sourceId: data.source_id || ''
    };
  } catch (error) {
    console.error(`Error in fetchCAPAById for ID ${id}:`, error);
    throw error;
  }
};

// Add the missing getCAPAStats function
export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const capas = await fetchCAPAs();
    
    // Initialize stats object
    const stats: CAPAStats = {
      total: capas.length,
      openCAPAs: 0,
      overdueCAPAs: 0,
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
      bySource: {},
      recentItems: capas.slice(0, 5) // Get 5 most recent CAPAs
    };
    
    const now = new Date();
    
    // Process each CAPA to calculate stats
    capas.forEach(capa => {
      // Count by status
      if (stats.byStatus.hasOwnProperty(capa.status)) {
        stats.byStatus[capa.status as keyof typeof stats.byStatus]++;
      }
      
      // Count open CAPAs
      if (capa.status === 'open' || capa.status === 'in-progress') {
        stats.openCAPAs++;
      }
      
      // Count by priority
      if (stats.byPriority.hasOwnProperty(capa.priority)) {
        stats.byPriority[capa.priority as keyof typeof stats.byPriority]++;
      }
      
      // Count by source
      stats.bySource[capa.source] = (stats.bySource[capa.source] || 0) + 1;
      
      // Count overdue CAPAs
      const dueDate = new Date(capa.dueDate);
      if (dueDate < now && (capa.status === 'open' || capa.status === 'in-progress')) {
        stats.overdueCAPAs++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error in getCAPAStats:', error);
    throw error;
  }
};

// Update CAPA function
export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Convert from our frontend model to database model
    const dbData: any = { ...capaData };
    
    // Map fields if necessary
    if (capaData.createdDate) dbData.created_at = capaData.createdDate;
    if (capaData.dueDate) dbData.due_date = capaData.dueDate;
    if (capaData.assignedTo) dbData.assigned_to = capaData.assignedTo;
    if (capaData.sourceId) dbData.source_id = capaData.sourceId;
    
    // Remove frontend-specific fields
    delete dbData.createdDate;
    delete dbData.dueDate;
    delete dbData.assignedTo;
    delete dbData.sourceId;
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating CAPA with ID ${id}:`, error);
      throw error;
    }
    
    // Transform the data back to frontend model
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status.toLowerCase(),
      priority: data.priority.toLowerCase(),
      createdDate: data.created_at,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      source: data.source,
      sourceId: data.source_id || ''
    };
  } catch (error) {
    console.error(`Error in updateCAPA for ID ${id}:`, error);
    throw error;
  }
};

// Default export for compatibility
const capaService = {
  fetchCAPAs,
  fetchCAPAById,
  getCAPAStats,
  updateCAPA
};

export default capaService;
