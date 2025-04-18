
import { supabase } from '@/integrations/supabase/client';

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

// Default export for compatibility
const capaService = {
  fetchCAPAs,
  fetchCAPAById
};

export default capaService;
