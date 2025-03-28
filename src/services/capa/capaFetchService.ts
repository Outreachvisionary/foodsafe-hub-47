
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAFetchParams, CAPASource, CAPAPriority, SourceReference } from '@/types/capa';
import { mapStatusFromDb } from './capaStatusService';

/**
 * Map database result to CAPA object
 */
export const mapDbResultToCapa = (data: any): CAPA => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source as CAPASource,
    sourceId: data.source_id,
    priority: data.priority as CAPAPriority,
    status: mapStatusFromDb(data.status),
    assignedTo: data.assigned_to,
    department: data.department || '',
    dueDate: data.due_date,
    createdDate: data.created_at,
    lastUpdated: data.updated_at,
    completedDate: data.completion_date,
    rootCause: data.root_cause || '',
    correctiveAction: data.corrective_action || '',
    preventiveAction: data.preventive_action || '',
    verificationMethod: data.verification_method || undefined,
    verificationDate: data.verification_date,
    verifiedBy: data.assigned_to,
    effectivenessRating: data.effectiveness_verified ? 'Effective' : undefined,
    effectivenessScore: data.effectiveness_criteria 
      ? (typeof data.effectiveness_criteria === 'string' 
          ? JSON.parse(data.effectiveness_criteria).score || 0
          : data.effectiveness_criteria.score || 0)
      : undefined,
    fsma204Compliant: false
  };
};

/**
 * Fetch CAPAs with optional filtering
 */
export const fetchCAPAs = async (params?: CAPAFetchParams): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*');
    
    // Apply filters if provided
    if (params) {
      if (params.status && params.status !== 'all') {
        const dbStatus = params.status === 'open' 
          ? ['Open', 'Overdue'] 
          : params.status === 'in-progress' 
            ? ['In Progress'] 
            : params.status === 'closed' 
              ? ['Closed'] 
              : ['Pending Verification'];
        
        query = query.in('status', dbStatus as any);
      }
      
      if (params.priority && params.priority !== 'all') {
        query = query.eq('priority', params.priority);
      }
      
      if (params.source && params.source !== 'all') {
        query = query.eq('source', params.source);
      }
      
      if (params.sourceId) {
        query = query.eq('source_id', params.sourceId);
      }
      
      if (params.dueDate && params.dueDate !== 'all') {
        const now = new Date();
        
        if (params.dueDate === 'overdue') {
          query = query.lt('due_date', now.toISOString());
        } else if (params.dueDate === 'today') {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          query = query
            .gte('due_date', today.toISOString().split('T')[0])
            .lt('due_date', tomorrow.toISOString().split('T')[0]);
        } else if (params.dueDate === 'this-week') {
          const today = new Date();
          const endOfWeek = new Date(today);
          endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
          
          query = query
            .gte('due_date', today.toISOString().split('T')[0])
            .lt('due_date', endOfWeek.toISOString().split('T')[0]);
        } else if (params.dueDate === 'this-month') {
          const today = new Date();
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          
          query = query
            .gte('due_date', today.toISOString().split('T')[0])
            .lt('due_date', endOfMonth.toISOString().split('T')[0]);
        }
      }
      
      if (params.assignedTo) {
        query = query.eq('assigned_to', params.assignedTo);
      }
      
      if (params.department) {
        query = query.eq('department', params.department);
      }
      
      // Search by title or description if searchQuery is provided
      if (params.searchQuery) {
        const searchTerm = `%${params.searchQuery}%`;
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
      }
      
      // Apply pagination if specified - used with limit() instead of direct operator
      if (params.limit) {
        query = query.limit(params.limit);
      }
    }
    
    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPAs:', error);
      throw error;
    }
    
    // Map the database results to the CAPA interface
    return data.map(item => mapDbResultToCapa(item));
    
  } catch (err) {
    console.error('Error in fetchCAPAs function:', err);
    throw err;
  }
};

/**
 * Fetch CAPA by ID
 */
export const fetchCAPAById = async (capaId: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', capaId)
      .single();
    
    if (error) {
      console.error('Error fetching CAPA by ID:', error);
      throw error;
    }
    
    // Get source reference data if available
    const sourceReference = await getSourceReference(data.source, data.source_id);
    
    // Map the database result to the CAPA interface and include the source reference
    const capa = mapDbResultToCapa(data);
    capa.sourceReference = sourceReference;
    return capa;
    
  } catch (err) {
    console.error('Error in fetchCAPAById function:', err);
    throw err;
  }
};

/**
 * Get details about the source of a CAPA
 */
async function getSourceReference(sourceType: string, sourceId: string): Promise<SourceReference | undefined> {
  if (!sourceId || !sourceType) return undefined;
  
  try {
    switch (sourceType) {
      case 'complaint': {
        const { data, error } = await supabase
          .from('complaints')
          .select('id, title, description, reported_date, status')
          .eq('id', sourceId)
          .single();
        
        if (error || !data) return undefined;
        
        return {
          id: data.id,
          type: 'complaint',
          title: data.title,
          description: data.description,
          date: data.reported_date,
          status: data.status,
          url: `/complaint-management/${data.id}`
        };
      }
      
      case 'audit': {
        const { data, error } = await supabase
          .from('audit_findings')
          .select('id, description, audit_id, severity, created_at, status')
          .eq('id', sourceId)
          .single();
        
        if (error || !data) return undefined;
        
        return {
          id: data.id,
          type: 'audit',
          title: `Audit Finding: ${data.description.substring(0, 50)}...`,
          description: data.description,
          date: data.created_at,
          status: data.status,
          url: `/internal-audits/${data.audit_id}`
        };
      }
      
      case 'nonconformance': {
        const { data, error } = await supabase
          .from('non_conformances')
          .select('id, title, description, reported_date, status')
          .eq('id', sourceId)
          .single();
        
        if (error || !data) return undefined;
        
        return {
          id: data.id,
          type: 'nonconformance',
          title: data.title,
          description: data.description,
          date: data.reported_date,
          status: data.status,
          url: `/non-conformance/${data.id}`
        };
      }
      
      default:
        return undefined;
    }
  } catch (err) {
    console.error('Error getting source reference:', err);
    return undefined;
  }
}
