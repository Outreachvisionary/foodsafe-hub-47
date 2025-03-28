
import { supabase } from '@/integrations/supabase/client';
import { CAPA } from '@/types/capa';
import { mapStatusFromDb } from './capaStatusService';

/**
 * Fetch all CAPA items with optional filtering
 */
export const fetchCAPAs = async (filters?: {
  status?: string;
  priority?: string;
  source?: string;
  dueDate?: string;
  searchQuery?: string;
}): Promise<CAPA[]> => {
  let query = supabase
    .from('capa_actions')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters if provided
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      // Map frontend status to database status format
      const dbStatus = filters.status === 'in-progress' ? 'In Progress' : 
                       filters.status.charAt(0).toUpperCase() + filters.status.slice(1);
      query = query.ilike('status', dbStatus);
    }

    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }

    if (filters.source && filters.source !== 'all') {
      query = query.eq('source', filters.source);
    }

    if (filters.dueDate && filters.dueDate !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      
      if (filters.dueDate === 'overdue') {
        query = query.lt('due_date', today);
      } else if (filters.dueDate === 'today') {
        query = query.eq('due_date', today);
      } else if (filters.dueDate === 'upcoming') {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        query = query
          .gt('due_date', today)
          .lte('due_date', nextWeek.toISOString().split('T')[0]);
      }
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%, description.ilike.%${filters.searchQuery}%`);
    }
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
  
  // Map database records to CAPA type
  return mapDbResultsToCapas(data);
};

/**
 * Fetch a single CAPA by ID
 */
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  const { data, error } = await supabase
    .from('capa_actions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching CAPA with ID ${id}:`, error);
    throw error;
  }
  
  return mapDbResultToCapa(data);
};

/**
 * Map a single database record to a CAPA object
 */
export const mapDbResultToCapa = (data: any): CAPA => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source,
    sourceId: data.source_id || '',
    priority: data.priority,
    status: mapStatusFromDb(data.status),
    assignedTo: data.assigned_to,
    department: '', // Not available in current database schema
    dueDate: data.due_date,
    createdDate: data.created_at,
    lastUpdated: data.updated_at,
    completedDate: data.completion_date,
    rootCause: data.root_cause || '',
    correctiveAction: data.corrective_action || '',
    preventiveAction: data.preventive_action || '',
    verificationMethod: '', // Not available in current database schema
    verificationDate: data.verification_date,
    verifiedBy: '', // Not available in current database schema
    effectivenessRating: undefined, // Not available in current database schema
    effectivenessScore: undefined, // Not available in current database schema
    relatedDocuments: [], // Not available in current database schema
    relatedTraining: [], // Not available in current database schema
    fsma204Compliant: false // Not available in current database schema
  };
};

/**
 * Map multiple database records to CAPA objects
 */
export const mapDbResultsToCapas = (data: any[]): CAPA[] => {
  return data.map(item => mapDbResultToCapa(item));
};
