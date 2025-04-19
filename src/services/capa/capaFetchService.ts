import { supabase } from '@/integrations/supabase/client';
import { 
  CAPA, 
  CAPAFetchParams, 
  CAPAStatus, 
  CAPAPriority, 
  CAPASource,
  DbCAPAStatus,
  mapDbStatusToInternal
} from '@/types/capa';

// Convert DB row to CAPA interface
export const mapDbRowToCapa = (row: any): CAPA => {
  const dbStatus = row.status as DbCAPAStatus;
  
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: mapDbStatusToInternal(dbStatus as DbCAPAStatus),
    priority: row.priority.toLowerCase() as CAPAPriority,
    source: row.source as CAPASource,
    sourceId: row.source_id,
    assignedTo: row.assigned_to,
    department: row.department,
    dueDate: row.due_date,
    rootCause: row.root_cause,
    correctiveAction: row.corrective_action,
    preventiveAction: row.preventive_action,
    effectivenessCriteria: row.effectiveness_criteria,
    completionDate: row.completion_date,
    createdBy: row.created_by,
    createdDate: row.created_at,
    lastUpdated: row.updated_at,
    isFsma204Compliant: row.is_fsma204_compliant || false,
    verificationMethod: row.verification_method,
    verificationDate: row.verification_date,
    verifiedBy: row.verified_by,
    effectivenessVerified: row.effectiveness_verified || false,
    effectivenessRating: row.effectiveness_rating
  };
};

// For use in other services
export const mapDbResultToCapa = mapDbRowToCapa;

export const fetchCAPAs = async (params?: CAPAFetchParams): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters based on params
    if (params) {
      if (params.status) {
        if (Array.isArray(params.status)) {
          // Handle array of statuses - convert to database format
          const statusValues = params.status.map(s => {
            if (typeof s === 'string') {
              // Convert from CAPAStatus enum to database format
              return s.replace('-', '_');
            }
            return s;
          });
          query = query.in('status', statusValues);
        } else if (params.status) {
          // Single status filter - convert to database format
          const statusValue = typeof params.status === 'string' 
            ? params.status.replace('-', '_')
            : params.status;
          query = query.eq('status', statusValue);
        }
      }

      if (params.priority) {
        if (Array.isArray(params.priority)) {
          query = query.in('priority', params.priority);
        } else {
          query = query.eq('priority', params.priority);
        }
      }

      if (params.source) {
        if (Array.isArray(params.source)) {
          query = query.in('source', params.source);
        } else {
          query = query.eq('source', params.source);
        }
      }

      if (params.assignedTo) {
        query = query.eq('assigned_to', params.assignedTo);
      }

      if (params.department) {
        query = query.eq('department', params.department);
      }

      // Handle date ranges if they exist in params
      if (params.from) {
        query = query.gte('created_at', params.from);
      }
      
      if (params.to) {
        query = query.lte('created_at', params.to);
      }

      // Handle search if it exists in params
      if (params.searchQuery) {
        query = query.or(`title.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`);
      }

      // Limit results if specified
      if (params.limit) {
        query = query.limit(params.limit);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching CAPAs:', error);
      throw new Error(error.message);
    }

    // Map database rows to CAPA interface
    return (data || []).map(mapDbRowToCapa);
  } catch (error) {
    console.error('Error in fetchCAPAs:', error);
    throw error;
  }
};

export const createCAPA = async (capaData: Omit<CAPA, 'id' | 'createdDate' | 'lastUpdated'>): Promise<CAPA> => {
  try {
    // Map our interface to database column names
    const dbCapa = {
      title: capaData.title,
      description: capaData.description,
      status: capaData.status.replace('-', '_'), // Convert to DB format
      source: capaData.source,
      source_id: capaData.sourceId,
      priority: capaData.priority,
      assigned_to: capaData.assignedTo,
      department: capaData.department,
      due_date: capaData.dueDate,
      root_cause: capaData.rootCause,
      corrective_action: capaData.correctiveAction,
      preventive_action: capaData.preventiveAction,
      effectiveness_criteria: capaData.effectivenessCriteria,
      completion_date: capaData.completionDate,
      created_by: capaData.createdBy,
      is_fsma204_compliant: capaData.isFsma204Compliant,
      verification_method: capaData.verificationMethod,
      verification_date: capaData.verificationDate,
      verified_by: capaData.verifiedBy,
      effectiveness_verified: capaData.effectivenessVerified,
      effectiveness_rating: capaData.effectivenessRating
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert([dbCapa])
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      throw new Error(error.message);
    }

    return mapDbRowToCapa(data);
  } catch (error) {
    console.error('Error in createCAPA:', error);
    throw error;
  }
};

export const fetchCAPAById = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching CAPA by ID:', error);
      throw new Error(error.message);
    }

    return mapDbRowToCapa(data);
  } catch (error) {
    console.error('Error in fetchCAPAById:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Construct the update object, mapping from our interface to DB columns
    const updateObject: any = {};
    
    if (capaData.title) updateObject.title = capaData.title;
    if (capaData.description) updateObject.description = capaData.description;
    if (capaData.status) updateObject.status = capaData.status.replace('-', '_'); // Convert to DB format
    if (capaData.priority) updateObject.priority = capaData.priority;
    if (capaData.assignedTo) updateObject.assigned_to = capaData.assignedTo;
    if (capaData.department) updateObject.department = capaData.department;
    if (capaData.dueDate) updateObject.due_date = capaData.dueDate;
    if (capaData.rootCause) updateObject.root_cause = capaData.rootCause;
    if (capaData.correctiveAction) updateObject.corrective_action = capaData.correctiveAction;
    if (capaData.preventiveAction) updateObject.preventive_action = capaData.preventiveAction;
    if (capaData.effectivenessCriteria) updateObject.effectiveness_criteria = capaData.effectivenessCriteria;
    if (capaData.completionDate) updateObject.completion_date = capaData.completionDate;
    if (capaData.isFsma204Compliant !== undefined) updateObject.is_fsma204_compliant = capaData.isFsma204Compliant;
    if (capaData.verificationMethod) updateObject.verification_method = capaData.verificationMethod;
    if (capaData.verificationDate) updateObject.verification_date = capaData.verificationDate;
    if (capaData.verifiedBy) updateObject.verified_by = capaData.verifiedBy;
    if (capaData.effectivenessVerified !== undefined) updateObject.effectiveness_verified = capaData.effectivenessVerified;
    if (capaData.effectivenessRating) updateObject.effectiveness_rating = capaData.effectivenessRating;
    
    // Always update the updated_at timestamp
    updateObject.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('capa_actions')
      .update(updateObject)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      throw new Error(error.message);
    }

    return mapDbRowToCapa(data);
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
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteCAPA:', error);
    throw error;
  }
};

// Export utility functions for mapDbToCapa
export { castToCapaStatus, castToCapaPriority };
