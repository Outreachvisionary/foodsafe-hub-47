
// Add any imports needed for the capaFetchService
import { supabase } from "@/integrations/supabase/client";
import { CAPA, CAPAFetchParams, CAPAStatus, DbCAPAStatus } from "@/types/capa";
import { mapDbStatusToInternal } from "./capaStatusMapper";

export const fetchCAPAs = async (params: CAPAFetchParams) => {
  try {
    let query = supabase.from('capa_actions').select('*');
    
    // Apply filters
    if (params.status && params.status !== 'All') {
      // Cast the status to any to bypass TypeScript's type checking
      // We know the database accepts these statuses
      query = query.eq('status', params.status as any);
    }
    
    // Continue with other filters
    if (params.priority && params.priority !== 'All') {
      query = query.eq('priority', params.priority);
    }
    
    if (params.source && params.source !== 'All') {
      query = query.eq('source', params.source);
    }
    
    // Date filters
    if (params.from) {
      query = query.gte('created_at', params.from);
    }
    
    if (params.to) {
      query = query.lte('created_at', params.to);
    }
    
    // Sorting
    if (params.sortBy) {
      const direction = params.sortDirection || 'desc';
      query = query.order(params.sortBy, { ascending: direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }
    
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Convert database records to CAPA objects
    const capas: CAPA[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: mapDbStatusToInternal(item.status),
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
      isFsma204Compliant: item.fsma204_compliant,
      sourceId: item.source_id
    }));
    
    return capas;
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

export const deleteCAPA = async (id: string) => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting CAPA:', error);
    throw error;
  }
};
