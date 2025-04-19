
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
    sourceId: dbResult.source_id || '',
    priority: dbResult.priority as CAPAPriority,
    assignedTo: dbResult.assigned_to,
    department: dbResult.department || '',
    dueDate: dbResult.due_date,
    completionDate: dbResult.completion_date || null,
    rootCause: dbResult.root_cause || '',
    correctiveAction: dbResult.corrective_action || '',
    preventiveAction: dbResult.preventive_action || '',
    verificationDate: dbResult.verification_date || null,
    effectivenessCriteria: dbResult.effectiveness_criteria || '',
    createdBy: dbResult.created_by,
    lastUpdated: dbResult.updated_at,
    fsma204Compliant: dbResult.fsma204_compliant || false,
    createdDate: dbResult.created_at,
    effectivenessVerified: dbResult.effectiveness_verified || false,
    effectivenessRating: dbResult.effectiveness_rating as CAPAEffectivenessRating || undefined,
    verificationMethod: dbResult.verification_method || '',
    verifiedBy: dbResult.verified_by || '',
    isFsma204Compliant: dbResult.fsma204_compliant || false,
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

    return mapDbResultToCapa(data);
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
      .order('due_date', { ascending: false });

    // Convert status filter to match database representation
    if (params?.status) {
      if (Array.isArray(params.status)) {
        // Use mapStatusToDb for each status in the array when converting to DB values
        const dbStatuses = params.status.map(s => {
          // Convert from UI status (like "in-progress") to DB status (like "in_progress")
          if (s === 'open') return 'open';
          if (s === 'in-progress') return 'in_progress';
          if (s === 'closed') return 'closed'; 
          if (s === 'verified') return 'verified';
          if (s === 'pending-verification') return 'pending_verification';
          if (s === 'cancelled') return 'cancelled';
          return 'open'; // Default
        });
        query = query.in('status', dbStatuses);
      } else {
        // Handle single status
        let dbStatus = 'open'; // Default
        if (params.status === 'open') dbStatus = 'open';
        if (params.status === 'in-progress') dbStatus = 'in_progress';
        if (params.status === 'closed') dbStatus = 'closed';
        if (params.status === 'verified') dbStatus = 'verified';
        if (params.status === 'pending-verification') dbStatus = 'pending_verification';
        if (params.status === 'cancelled') dbStatus = 'cancelled';
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
      query = query.eq('due_date', params.dueDate);
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

    // Map database results to CAPA type
    return (data || []).map(item => mapDbResultToCapa(item));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

export const createCAPA = async (capaData: Omit<CAPA, 'id'>): Promise<CAPA | null> => {
  try {
    // Map from our CAPA type to database schema
    const dbData = {
      title: capaData.title,
      description: capaData.description,
      status: capaData.status.replace(/-/g, '_'), // Convert "in-progress" to "in_progress"
      source: capaData.source,
      source_id: capaData.sourceId,
      priority: capaData.priority,
      assigned_to: capaData.assignedTo,
      department: capaData.department,
      due_date: capaData.dueDate,
      completion_date: capaData.completionDate,
      root_cause: capaData.rootCause,
      corrective_action: capaData.correctiveAction,
      preventive_action: capaData.preventiveAction,
      verification_date: capaData.verificationDate,
      effectiveness_criteria: capaData.effectivenessCriteria,
      created_by: capaData.createdBy,
      fsma204_compliant: capaData.fsma204Compliant || false,
      effectiveness_verified: capaData.effectivenessVerified || false,
      effectiveness_rating: capaData.effectivenessRating,
      verification_method: capaData.verificationMethod,
      verified_by: capaData.verifiedBy
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      return null;
    }

    return mapDbResultToCapa(data);
  } catch (error) {
    console.error('Error creating CAPA:', error);
    return null;
  }
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    // Map from our CAPA type to database schema
    const dbUpdates: Record<string, any> = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.status !== undefined) dbUpdates.status = updates.status.replace(/-/g, '_');
    if (updates.source !== undefined) dbUpdates.source = updates.source;
    if (updates.sourceId !== undefined) dbUpdates.source_id = updates.sourceId;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.completionDate !== undefined) dbUpdates.completion_date = updates.completionDate;
    if (updates.rootCause !== undefined) dbUpdates.root_cause = updates.rootCause;
    if (updates.correctiveAction !== undefined) dbUpdates.corrective_action = updates.correctiveAction;
    if (updates.preventiveAction !== undefined) dbUpdates.preventive_action = updates.preventiveAction;
    if (updates.verificationDate !== undefined) dbUpdates.verification_date = updates.verificationDate;
    if (updates.effectivenessCriteria !== undefined) dbUpdates.effectiveness_criteria = updates.effectivenessCriteria;
    if (updates.fsma204Compliant !== undefined) dbUpdates.fsma204_compliant = updates.fsma204Compliant;
    if (updates.effectivenessVerified !== undefined) dbUpdates.effectiveness_verified = updates.effectivenessVerified;
    if (updates.effectivenessRating !== undefined) dbUpdates.effectiveness_rating = updates.effectivenessRating;
    if (updates.verificationMethod !== undefined) dbUpdates.verification_method = updates.verificationMethod;
    if (updates.verifiedBy !== undefined) dbUpdates.verified_by = updates.verifiedBy;

    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      return null;
    }

    return mapDbResultToCapa(data);
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
