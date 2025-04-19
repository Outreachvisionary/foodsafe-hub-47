
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAEffectivenessRating, CAPASource, CAPAPriority } from '@/types/capa';

export interface CAPAFetchParams {
  status?: CAPAStatus | CAPAStatus[];
  source?: CAPASource | CAPASource[];
  priority?: CAPAPriority | CAPAPriority[];
  sourceId?: string;
  assignedTo?: string;
  department?: string;
  searchQuery?: string;
  dueDate?: string;
  limit?: number;
  page?: number;
}

export interface SourceReference {
  id: string;
  type: string;
  name: string;
}

// Map database status to frontend status 
export const mapStatusFromDb = (dbStatus: string): CAPAStatus => {
  switch(dbStatus) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'verified': return 'Verified';
    default: return 'Open';
  }
};

// Map frontend status to database status
export const mapStatusToDb = (status: CAPAStatus): string => {
  switch(status) {
    case 'Open': return 'open';
    case 'In Progress': return 'in_progress';
    case 'Closed': return 'closed';
    case 'Verified': return 'verified';
    case 'Overdue': return 'open'; // Map overdue to open in DB, handle overdue status in frontend
    case 'Pending Verification': return 'in_progress'; // Map pending verification to in_progress
    default: return 'open';
  }
};

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
  };
};

// Convert CAPA to database format
export const mapCapaToDb = (capa: Partial<CAPA>) => {
  const dbRecord: Record<string, any> = {};
  
  if (capa.title !== undefined) dbRecord.title = capa.title;
  if (capa.description !== undefined) dbRecord.description = capa.description;
  if (capa.source !== undefined) dbRecord.source = capa.source;
  if (capa.sourceId !== undefined) dbRecord.source_id = capa.sourceId;
  if (capa.priority !== undefined) dbRecord.priority = capa.priority;
  if (capa.status !== undefined) dbRecord.status = mapStatusToDb(capa.status);
  if (capa.assignedTo !== undefined) dbRecord.assigned_to = capa.assignedTo;
  if (capa.department !== undefined) dbRecord.department = capa.department;
  if (capa.dueDate !== undefined) dbRecord.due_date = capa.dueDate;
  if (capa.completionDate !== undefined) dbRecord.completion_date = capa.completionDate;
  if (capa.rootCause !== undefined) dbRecord.root_cause = capa.rootCause;
  if (capa.correctiveAction !== undefined) dbRecord.corrective_action = capa.correctiveAction;
  if (capa.preventiveAction !== undefined) dbRecord.preventive_action = capa.preventiveAction;
  if (capa.verificationDate !== undefined) dbRecord.verification_date = capa.verificationDate;
  if (capa.effectivenessCriteria !== undefined) dbRecord.effectiveness_criteria = capa.effectivenessCriteria;
  if (capa.fsma204Compliant !== undefined) dbRecord.fsma204_compliant = capa.fsma204Compliant;
  
  return dbRecord;
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
        // Convert frontend statuses to DB statuses
        const dbStatuses = params.status.map(status => mapStatusToDb(status));
        query = query.in('status', dbStatuses);
      } else {
        // Handle single status
        const dbStatus = mapStatusToDb(params.status);
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

export const createCAPA = async (capaData: Omit<CAPA, 'id' | 'createdDate' | 'lastUpdated'>): Promise<CAPA | null> => {
  try {
    // Convert frontend model to database format
    const dbData = mapCapaToDb(capaData);
    
    // Ensure required fields are present
    if (!dbData.created_by) {
      dbData.created_by = (await supabase.auth.getUser()).data.user?.id || 'system';
    }

    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbData)
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
    // Convert frontend model to database format
    const dbUpdates = mapCapaToDb(updates);

    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating CAPA with ID ${id}:`, error);
      return null;
    }

    return mapDbResultToCapa(data);
  } catch (error) {
    console.error(`Error updating CAPA with ID ${id}:`, error);
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
      console.error(`Error deleting CAPA with ID ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting CAPA with ID ${id}:`, error);
    return false;
  }
};

export const getCAPAStats = async (): Promise<Record<string, any>> => {
  try {
    // Fetch all CAPAs for stats calculation
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*');

    if (error) {
      console.error('Error fetching CAPA stats:', error);
      return {};
    }

    const capas = (data || []).map(item => mapDbResultToCapa(item));
    
    // Calculate status distribution
    const statusCounts = capas.reduce((acc: Record<string, number>, capa) => {
      acc[capa.status] = (acc[capa.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate priority distribution
    const priorityCounts = capas.reduce((acc: Record<string, number>, capa) => {
      acc[capa.priority] = (acc[capa.priority] || 0) + 1;
      return acc;
    }, {});

    // Calculate source distribution
    const sourceCounts = capas.reduce((acc: Record<string, number>, capa) => {
      acc[capa.source] = (acc[capa.source] || 0) + 1;
      return acc;
    }, {});

    // Calculate overdue CAPAs
    const currentDate = new Date();
    const overdueCAPAs = capas.filter(capa => 
      capa.status !== 'Closed' && 
      capa.status !== 'Verified' && 
      new Date(capa.dueDate) < currentDate
    );

    return {
      total: capas.length,
      statusDistribution: statusCounts,
      priorityDistribution: priorityCounts,
      sourceDistribution: sourceCounts,
      overdue: overdueCAPAs.length,
      overdueCAPAs
    };
  } catch (error) {
    console.error('Error calculating CAPA stats:', error);
    return {};
  }
};

export const getPotentialCAPAs = async (): Promise<any[]> => {
  try {
    // This would normally query multiple tables to find issues that might need CAPA
    // For now, we'll return mock data that simulates potential CAPA issues
    const { data: nonConformances, error: ncError } = await supabase
      .from('non_conformances')
      .select('*')
      .is('capa_id', null)
      .eq('status', 'Confirmed');

    const { data: complaints, error: complaintError } = await supabase
      .from('complaints')
      .select('*')
      .is('capa_id', null)
      .eq('status', 'validated');

    if (ncError || complaintError) {
      console.error('Error fetching potential CAPAs:', ncError || complaintError);
      return [];
    }

    // Transform to potential CAPA suggestions
    const ncPotentialCAPAs = (nonConformances || []).map(nc => ({
      id: nc.id,
      source: 'Non-Conformance' as CAPASource,
      title: nc.title,
      description: nc.description,
      priority: nc.priority || 'medium',
      suggestedAction: `Address non-conformance: ${nc.title}`
    }));

    const complaintPotentialCAPAs = (complaints || []).map(complaint => ({
      id: complaint.id,
      source: 'Customer Complaint' as CAPASource,
      title: complaint.title,
      description: complaint.description,
      priority: complaint.priority || 'medium',
      suggestedAction: `Address customer complaint: ${complaint.title}`
    }));

    return [...ncPotentialCAPAs, ...complaintPotentialCAPAs];
  } catch (error) {
    console.error('Error fetching potential CAPAs:', error);
    return [];
  }
};

// Export the functions as a service object as well
const capaService = {
  fetchCAPAById,
  fetchCAPAs,
  createCAPA,
  updateCAPA,
  deleteCAPA,
  getCAPAStats,
  getPotentialCAPAs
};

export default capaService;
