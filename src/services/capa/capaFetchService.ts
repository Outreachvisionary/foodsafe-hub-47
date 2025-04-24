
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAFetchParams } from '@/types/capa';
import { mapStatusToInternal } from '@/services/capa/capaStatusService';

// Function to fetch CAPAs with filtering options
export const fetchCAPAs = async (params: CAPAFetchParams = {}): Promise<CAPA[]> => {
  try {
    let query = supabase.from('capa_actions').select('*');

    // Apply filters
    if (params.status && params.status !== 'All') {
      query = query.eq('status', params.status);
    }

    if (params.priority && params.priority !== 'All') {
      query = query.eq('priority', params.priority);
    }

    if (params.assignedTo && params.assignedTo !== 'All') {
      query = query.eq('assigned_to', params.assignedTo);
    }

    if (params.source && params.source !== 'All') {
      query = query.eq('source', params.source);
    }

    if (params.searchQuery) {
      query = query.or(`title.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`);
    }

    // Date filters
    if (params.startDate) {
      query = query.gte('created_at', params.startDate);
    }

    if (params.endDate) {
      query = query.lte('due_date', params.endDate);
    }

    // Sorting
    if (params.sortBy) {
      const direction = params.sortDirection || 'asc';
      query = query.order(params.sortBy, { ascending: direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: mapStatusToInternal(item.status),
      priority: item.priority,
      createdAt: item.created_at,
      dueDate: item.due_date,
      completionDate: item.completion_date,
      verificationDate: item.verification_date,
      assignedTo: item.assigned_to,
      createdBy: item.created_by,
      source: item.source,
      rootCause: item.root_cause,
      correctiveAction: item.corrective_action,
      preventiveAction: item.preventive_action,
      department: item.department,
      verificationMethod: item.verification_method,
      effectivenessCriteria: item.effectiveness_criteria,
      effectivenessRating: item.effectiveness_rating,
      verifiedBy: item.verified_by,
      isFsma204Compliant: item.fsma204_compliant
    }));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

// Function to delete a CAPA
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
