
// Update the imports and fix the effectivenessRating typing
import { CAPAStatus, CAPAEffectivenessRating, CAPA } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';
import { DbCAPAStatus, mapDbStatusToInternal } from './capaStatusMapper';

// Export DbCAPAStatus from the capaStatusMapper module
export type { DbCAPAStatus } from './capaStatusMapper';

export const fetchCAPAs = async (
  page: number = 1,
  pageSize: number = 10,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc',
  searchTerm: string = '',
  statusFilter: CAPAStatus | '' = '',
  priorityFilter: string = '',
  departmentFilter: string = ''
): Promise<{ data: CAPA[]; total: number; }> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*', { count: 'exact' });
    
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }
    
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    if (priorityFilter) {
      query = query.eq('priority', priorityFilter);
    }

    if (departmentFilter) {
      query = query.eq('department', departmentFilter);
    }
    
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    const transformedData = data ? data.map(transformDbCapaToClientCapa) : [];
    
    return {
      data: transformedData,
      total: count || 0,
    };
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

export const fetchCAPA = async (id: string): Promise<CAPA | null> => {
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
    
    return transformDbCapaToClientCapa(data);
  } catch (error) {
    console.error('Error fetching CAPA:', error);
    return null;
  }
};

// Add the deleteCAPA function
export const deleteCAPA = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting CAPA:', error);
    throw error;
  }
};

// Update the transformDbCapaToClientCapa function to handle effectiveness ratings
const transformDbCapaToClientCapa = (dbCapa: any): CAPA => {
  // Map effectiveness rating to ensure it matches the allowed values
  let effectivenessRating: CAPAEffectivenessRating | null = null;
  
  if (dbCapa.effectiveness_rating) {
    switch(dbCapa.effectiveness_rating) {
      case 'Effective':
        effectivenessRating = 'Effective';
        break;
      case 'Partially Effective':
      case 'Partially_Effective':
        effectivenessRating = 'Partially_Effective';
        break;
      case 'Not Effective':
      case 'Not_Effective':
        effectivenessRating = 'Not_Effective';
        break;
      default:
        effectivenessRating = null;
    }
  }

  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: mapDbStatusToInternal(dbCapa.status as DbCAPAStatus),
    priority: dbCapa.priority,
    createdAt: dbCapa.created_at,
    dueDate: dbCapa.due_date,
    completionDate: dbCapa.completion_date,
    verificationDate: dbCapa.verification_date,
    assignedTo: dbCapa.assigned_to,
    createdBy: dbCapa.created_by,
    source: dbCapa.source,
    rootCause: dbCapa.root_cause,
    correctiveAction: dbCapa.corrective_action,
    preventiveAction: dbCapa.preventive_action,
    department: dbCapa.department,
    effectivenessRating: effectivenessRating,
    effectivenessCriteria: dbCapa.effectiveness_criteria,
    verificationMethod: dbCapa.verification_method,
    verifiedBy: dbCapa.verified_by,
    fsma204Compliant: dbCapa.fsma204_compliant || false,
    effectivenessVerified: dbCapa.effectiveness_verified || false,
    sourceId: dbCapa.source_id,
  };
};
