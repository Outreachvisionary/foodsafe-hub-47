
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
    status: mapDbStatusToInternal(dbStatus),
    priority: (row.priority || 'medium').toLowerCase() as CAPAPriority,
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
          // For DB, convert each status to the correct DB format
          const dbStatusValues = params.status.map(s => {
            // Need to convert from internal format to database format
            if (typeof s === 'string') {
              // Convert based on the mapping in your types file
              return s.toLowerCase().replace(/-/g, '_');
            }
            return s;
          });
          query = query.in('status', dbStatusValues as any);
        } else if (params.status) {
          // Single status filter - convert to database format
          const dbStatusValue = typeof params.status === 'string' 
            ? params.status.toLowerCase().replace(/-/g, '_')
            : params.status;
          query = query.eq('status', dbStatusValue as any);
        }
      }

      if (params.priority) {
        if (Array.isArray(params.priority)) {
          query = query.in('priority', params.priority as any);
        } else {
          query = query.eq('priority', params.priority as any);
        }
      }

      if (params.source) {
        if (Array.isArray(params.source)) {
          query = query.in('source', params.source as any);
        } else {
          query = query.eq('source', params.source as any);
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

// We're no longer exporting these as they've been moved to types/capa.ts
// export { castToCapaStatus, castToCapaPriority };
