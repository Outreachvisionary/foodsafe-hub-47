import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAEffectivenessRating, CAPASource, CAPAPriority, CAPAFetchParams, SourceReference } from '@/types/capa';
import { mapStatusFromDb } from './capaStatusService';

// Map database result to CAPA type
export const mapDbResultToCapa = (dbResult: any): CAPA => {
  return {
    id: dbResult.id,
    title: dbResult.title,
    description: dbResult.description || '',
    status: mapStatusFromDb(dbResult.status),
    source: dbResult.source as CAPASource,
    sourceId: dbResult.source_id,
    priority: dbResult.priority as CAPAPriority,
    assignedTo: dbResult.assigned_to,
    department: dbResult.department || '',
    dueDate: dbResult.due_date,
    completedDate: dbResult.completion_date || null,
    rootCause: dbResult.root_cause || '',
    correctiveAction: dbResult.corrective_action || '',
    preventiveAction: dbResult.preventive_action || '',
    verificationDate: dbResult.verification_date || null,
    effectivenessCriteria: dbResult.effectiveness_criteria || '',
    createdBy: dbResult.created_by,
    lastUpdated: dbResult.updated_at,
    fsma204Compliant: dbResult.fsma204_compliant || false,
    createdDate: dbResult.created_at,
    // You can add more fields as needed
  };
};

export const fetchCAPAById = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching CAPA:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching CAPA:', error);
    return null;
  }
};

export const fetchCAPAs = async (params?: CAPAFetchParams): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*')
      .order('dueDate', { ascending: false });

    // Convert status filter to match database representation
    if (params?.status) {
      if (Array.isArray(params.status)) {
        // Use mapStatusToDb for each status in the array when converting to DB values
        const dbStatuses = params.status.map(s => {
          // Convert from UI status (like "In Progress") to DB status (like "in_progress")
          if (s === 'Open') return 'open';
          if (s === 'In Progress') return 'in_progress';
          if (s === 'Closed') return 'closed'; 
          if (s === 'Verified') return 'verified';
          return 'open'; // Default
        });
        query = query.in('status', dbStatuses);
      } else {
        // Handle single status
        let dbStatus = 'open'; // Default
        if (params.status === 'Open') dbStatus = 'open';
        if (params.status === 'In Progress') dbStatus = 'in_progress';
        if (params.status === 'Closed') dbStatus = 'closed';
        if (params.status === 'Verified') dbStatus = 'verified';
        query = query.eq('status', dbStatus);
      }
    }

    // Convert source filter to match CAPASource type
    if (params?.source) {
      if (Array.isArray(params.source)) {
        query = query.in('source', params.source);
      } else {
        query = query.eq('source', params.source);
      }
    }

    // Convert priority filter
    if (params?.priority) {
      if (Array.isArray(params.priority)) {
        query = query.in('priority', params.priority);
      } else {
        query = query.eq('priority', params.priority);
      }
    }

    // Handle sourceId parameter
    if (params?.sourceId) {
      query = query.eq('source_id', params.sourceId);
    }

    // Handle assigned_to parameter
    if (params?.assignedTo) {
      query = query.eq('assigned_to', params.assignedTo);
    }

    // Handle department parameter
    if (params?.department) {
      query = query.eq('department', params.department);
    }

    // Handle search query
    if (params?.searchQuery) {
      const searchQuery = params.searchQuery.toLowerCase();
      query = query.ilike('title', `%${searchQuery}%`);
    }

    // Handle due date filter
    if (params?.dueDate) {
      query = query.eq('dueDate', params.dueDate);
    }

    // Handle pagination
    if (params?.limit && params?.page) {
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = startIndex + params.limit - 1;
      query = query.range(startIndex, endIndex);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching CAPAs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

export const createCAPA = async (capaData: Omit<CAPA, 'id'>): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .insert([capaData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    return null;
  }
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating CAPA:', error);
    return null;
  }
};

export const deleteCAPA = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting CAPA:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting CAPA:', error);
    return false;
  }
};

const capaFetchService = {
  fetchCAPAById,
  fetchCAPAs,
  createCAPA,
  updateCAPA,
  deleteCAPA
};

export default capaFetchService;
