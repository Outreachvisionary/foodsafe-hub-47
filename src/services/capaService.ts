
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAFilterParams, CAPAStats, CAPAEffectivenessMetrics } from '@/types/capa';

// Fetch CAPAs with optional filtering
export const fetchCAPAs = async (filters?: CAPAFilterParams): Promise<CAPA[]> => {
  try {
    let query = supabase
      .from('capa_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      if (filters.sourceId) {
        query = query.eq('source_id', filters.sourceId);
      }
      
      if (filters.source) {
        if (Array.isArray(filters.source)) {
          query = query.in('source', filters.source);
        } else {
          query = query.eq('source', filters.source);
        }
      }
      
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }
      
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          query = query.in('priority', filters.priority);
        } else {
          query = query.eq('priority', filters.priority);
        }
      }

      if (filters.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching CAPAs:', error);
      throw error;
    }
    
    // Transform the data to match the CAPA interface
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      status: item.status.toLowerCase(),
      priority: item.priority.toLowerCase(),
      createdDate: item.created_at,
      dueDate: item.due_date,
      completionDate: item.completion_date,
      assignedTo: item.assigned_to,
      source: item.source,
      sourceId: item.source_id || '',
      rootCause: item.root_cause || '',
      correctiveAction: item.corrective_action || '',
      preventiveAction: item.preventive_action || '',
      effectivenessCriteria: item.effectiveness_criteria || '',
      verificationDate: item.verification_date,
      effectivenessVerified: item.effectiveness_verified || false,
      createdBy: item.created_by,
      lastUpdated: item.updated_at,
      department: item.department || '',
      fsma204Compliant: item.fsma204_compliant || false,
      verificationMethod: item.verification_method,
      verifiedBy: item.verified_by
    }));
  } catch (error) {
    console.error('Error in fetchCAPAs:', error);
    throw error;
  }
};

// Fetch a single CAPA by ID
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching CAPA with ID ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status.toLowerCase(),
      priority: data.priority.toLowerCase(),
      createdDate: data.created_at,
      dueDate: data.due_date,
      completionDate: data.completion_date || null,
      assignedTo: data.assigned_to,
      source: data.source,
      sourceId: data.source_id || '',
      rootCause: data.root_cause || '',
      correctiveAction: data.corrective_action || '',
      preventiveAction: data.preventive_action || '',
      effectivenessCriteria: data.effectiveness_criteria || '',
      verificationDate: data.verification_date,
      effectivenessVerified: data.effectiveness_verified || false,
      createdBy: data.created_by,
      lastUpdated: data.updated_at,
      department: data.department || '',
      fsma204Compliant: data.fsma204_compliant || false,
      verificationMethod: data.verification_method,
      verifiedBy: data.verified_by
    };
  } catch (error) {
    console.error(`Error in fetchCAPAById for ID ${id}:`, error);
    throw error;
  }
};

// Add the missing getCAPAStats function
export const getCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const capas = await fetchCAPAs();
    
    // Initialize stats object
    const stats: CAPAStats = {
      total: capas.length,
      openCAPAs: 0,
      overdueCAPAs: 0,
      byStatus: {
        open: 0,
        'in-progress': 0,
        closed: 0,
        verified: 0
      },
      byPriority: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      bySource: {},
      recentItems: capas.slice(0, 5), // Get 5 most recent CAPAs
      overdue: 0,
      averageClosureTime: 0,
      fsma204ComplianceRate: 0
    };
    
    const now = new Date();
    
    // Process each CAPA to calculate stats
    capas.forEach(capa => {
      // Count by status
      if (stats.byStatus.hasOwnProperty(capa.status)) {
        stats.byStatus[capa.status]++;
      }
      
      // Count open CAPAs
      if (capa.status === 'open' || capa.status === 'in-progress') {
        stats.openCAPAs++;
      }
      
      // Count by priority
      if (stats.byPriority.hasOwnProperty(capa.priority)) {
        stats.byPriority[capa.priority]++;
      }
      
      // Count by source
      stats.bySource[capa.source] = (stats.bySource[capa.source] || 0) + 1;
      
      // Count overdue CAPAs
      const dueDate = new Date(capa.dueDate);
      if (dueDate < now && (capa.status === 'open' || capa.status === 'in-progress')) {
        stats.overdueCAPAs++;
        stats.overdue++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error in getCAPAStats:', error);
    throw error;
  }
};

// Create CAPA function
export const createCAPA = async (capaData: Omit<CAPA, 'id' | 'createdDate' | 'lastUpdated'>): Promise<CAPA> => {
  try {
    // Convert from our frontend model to database model
    const dbData: any = {
      title: capaData.title,
      description: capaData.description,
      status: capaData.status,
      priority: capaData.priority,
      source: capaData.source,
      source_id: capaData.sourceId,
      assigned_to: capaData.assignedTo,
      due_date: capaData.dueDate,
      department: capaData.department || '',
      root_cause: capaData.rootCause || '',
      corrective_action: capaData.correctiveAction || '',
      preventive_action: capaData.preventiveAction || '',
      fsma204_compliant: capaData.fsma204Compliant || false,
      created_by: capaData.createdBy || 'System'
    };
    
    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating CAPA:', error);
      throw error;
    }
    
    // Transform the data back to frontend model
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status.toLowerCase(),
      priority: data.priority.toLowerCase(),
      createdDate: data.created_at,
      dueDate: data.due_date,
      completionDate: data.completion_date || null,
      assignedTo: data.assigned_to,
      source: data.source,
      sourceId: data.source_id || '',
      rootCause: data.root_cause || '',
      correctiveAction: data.corrective_action || '',
      preventiveAction: data.preventive_action || '',
      createdBy: data.created_by,
      lastUpdated: data.updated_at,
      department: data.department || '',
      fsma204Compliant: data.fsma204_compliant || false
    };
  } catch (error) {
    console.error('Error in createCAPA:', error);
    throw error;
  }
};

// Update CAPA function
export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Convert from our frontend model to database model
    const dbData: any = { ...capaData };
    
    // Map fields if necessary
    if (capaData.completionDate) dbData.completion_date = capaData.completionDate;
    if (capaData.sourceId) dbData.source_id = capaData.sourceId;
    if (capaData.rootCause) dbData.root_cause = capaData.rootCause;
    if (capaData.correctiveAction) dbData.corrective_action = capaData.correctiveAction;
    if (capaData.preventiveAction) dbData.preventive_action = capaData.preventiveAction;
    if (capaData.effectivenessCriteria) dbData.effectiveness_criteria = capaData.effectivenessCriteria;
    if (capaData.effectivenessVerified !== undefined) dbData.effectiveness_verified = capaData.effectivenessVerified;
    if (capaData.verificationDate) dbData.verification_date = capaData.verificationDate;
    if (capaData.verificationMethod) dbData.verification_method = capaData.verificationMethod;
    if (capaData.verifiedBy) dbData.verified_by = capaData.verifiedBy;
    if (capaData.fsma204Compliant !== undefined) dbData.fsma204_compliant = capaData.fsma204Compliant;
    if (capaData.assignedTo) dbData.assigned_to = capaData.assignedTo;
    
    // Remove frontend-specific fields
    delete dbData.createdDate;
    delete dbData.completionDate;
    delete dbData.sourceId;
    delete dbData.rootCause;
    delete dbData.correctiveAction;
    delete dbData.preventiveAction;
    delete dbData.effectivenessCriteria;
    delete dbData.effectivenessVerified;
    delete dbData.lastUpdated;
    delete dbData.verificationDate;
    delete dbData.verificationMethod;
    delete dbData.verifiedBy;
    delete dbData.fsma204Compliant;
    delete dbData.assignedTo;
    delete dbData.relatedDocuments;
    delete dbData.relatedTraining;
    delete dbData.sourceReference;
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating CAPA with ID ${id}:`, error);
      throw error;
    }
    
    // Transform the data back to frontend model
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status.toLowerCase(),
      priority: data.priority.toLowerCase(),
      createdDate: data.created_at,
      dueDate: data.due_date,
      completionDate: data.completion_date || null,
      assignedTo: data.assigned_to,
      source: data.source,
      sourceId: data.source_id || '',
      rootCause: data.root_cause || '',
      correctiveAction: data.corrective_action || '',
      preventiveAction: data.preventive_action || '',
      effectivenessCriteria: data.effectiveness_criteria || '',
      effectivenessVerified: data.effectiveness_verified || false,
      createdBy: data.created_by,
      lastUpdated: data.updated_at,
      department: data.department || '',
      fsma204Compliant: data.fsma204_compliant || false,
      verificationDate: data.verification_date,
      verificationMethod: data.verification_method,
      verifiedBy: data.verified_by
    };
  } catch (error) {
    console.error(`Error in updateCAPA for ID ${id}:`, error);
    throw error;
  }
};

// Add the deleteCAPA function
export const deleteCAPA = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting CAPA with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteCAPA for ID ${id}:`, error);
    throw error;
  }
};

// Add function to get potential CAPAs for AutomatedCAPAGenerator
export const getPotentialCAPAs = async (): Promise<any[]> => {
  try {
    // This would typically query your database for non-conformances, complaints,
    // or other issues that might need CAPAs. For now we'll return mock data.
    return [
      {
        id: 'potential-1',
        title: 'Temperature Control Failure - Cold Storage Unit #3',
        description: 'Cold storage unit #3 exceeded critical temperature limit of 4°C for more than 2 hours.',
        source: 'haccp',
        sourceId: 'haccp-123',
        date: new Date().toISOString(),
        severity: 'critical',
        confidence: 0.95
      },
      {
        id: 'potential-2',
        title: 'Metal Detection Calibration Issue',
        description: 'Metal detector on line 2 failed calibration test; may have allowed contaminated products to pass.',
        source: 'non_conformance',
        sourceId: 'nc-456',
        date: new Date().toISOString(),
        severity: 'major',
        confidence: 0.88
      }
    ];
  } catch (error) {
    console.error('Error in getPotentialCAPAs:', error);
    return [];
  }
};

// Add the getEffectivenessMetrics and saveEffectivenessMetrics functions
export const getEffectivenessMetrics = async (capaId: string): Promise<CAPAEffectivenessMetrics | null> => {
  try {
    const { data, error } = await supabase
      .from('capa_effectiveness_assessments')
      .select('*')
      .eq('capa_id', capaId)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return null;
      }
      console.error(`Error fetching effectiveness metrics for CAPA ${capaId}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      capaId: data.capa_id,
      score: data.score,
      rootCauseEliminated: data.root_cause_eliminated,
      documentationComplete: data.documentation_complete,
      preventionMeasureEffective: data.preventive_measures_implemented,
      recurrenceCheck: !!data.recurrence_check,
      assessmentDate: data.assessment_date,
      notes: data.notes,
      createdBy: data.created_by,
      rating: data.rating
    };
  } catch (error) {
    console.error(`Error in getEffectivenessMetrics for CAPA ${capaId}:`, error);
    return null;
  }
};

export const saveEffectivenessMetrics = async (metrics: CAPAEffectivenessMetrics): Promise<CAPAEffectivenessMetrics> => {
  try {
    const dbData = {
      capa_id: metrics.capaId,
      score: metrics.score,
      root_cause_eliminated: metrics.rootCauseEliminated,
      documentation_complete: metrics.documentationComplete,
      preventive_measures_implemented: metrics.preventionMeasureEffective,
      recurrence_check: metrics.recurrenceCheck ? 'Yes' : 'No',
      assessment_date: metrics.assessmentDate,
      notes: metrics.notes,
      created_by: metrics.createdBy,
      rating: metrics.rating
    };
    
    const { data, error } = await supabase
      .from('capa_effectiveness_assessments')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving CAPA effectiveness metrics:', error);
      throw error;
    }
    
    return {
      id: data.id,
      capaId: data.capa_id,
      score: data.score,
      rootCauseEliminated: data.root_cause_eliminated,
      documentationComplete: data.documentation_complete,
      preventionMeasureEffective: data.preventive_measures_implemented,
      recurrenceCheck: !!data.recurrence_check,
      assessmentDate: data.assessment_date,
      notes: data.notes,
      createdBy: data.created_by,
      rating: data.rating
    };
  } catch (error) {
    console.error('Error in saveEffectivenessMetrics:', error);
    throw error;
  }
};

// Default export for compatibility
const capaService = {
  fetchCAPAs,
  fetchCAPAById,
  getCAPAStats,
  updateCAPA,
  createCAPA,
  deleteCAPA,
  getPotentialCAPAs,
  getEffectivenessMetrics,
  saveEffectivenessMetrics
};

export default capaService;
