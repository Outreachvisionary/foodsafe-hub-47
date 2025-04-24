
import { supabase } from "@/integrations/supabase/client";
import { CAPA, CAPAFetchParams, CAPAStatus, mapDbStatusToInternal } from "@/types/capa";

// Mock function to fetch CAPAs with filtering
export const fetchCAPAs = async (params: CAPAFetchParams): Promise<CAPA[]> => {
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

    // Apply date range filters if provided
    if (params.startDate) {
      query = query.gte('created_at', params.startDate);
    }
    
    if (params.endDate) {
      query = query.lte('created_at', params.endDate);
    }
    
    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }
    
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }
    
    // Apply sorting
    if (params.sortBy) {
      const direction = params.sortDirection || 'desc';
      query = query.order(params.sortBy, { ascending: direction === 'asc' });
    } else {
      // Default sort by created_at descending
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform database records to CAPA objects
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: mapDbStatusToInternal(item.status),
      priority: item.priority,
      createdAt: item.created_at,
      dueDate: item.due_date,
      completionDate: item.completion_date,
      assignedTo: item.assigned_to,
      createdBy: item.created_by,
      source: item.source,
      rootCause: item.root_cause,
      correctiveAction: item.corrective_action,
      preventiveAction: item.preventive_action
    }));
    
  } catch (error) {
    console.error("Error fetching CAPAs:", error);
    throw error;
  }
};
