
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAEffectivenessMetrics, CAPAStats, CAPAFilter } from '@/types/capa';
import { mapStatusToDb, mapStatusFromDb, mapEffectivenessRatingToDb, mapEffectivenessRatingFromDb } from './capa/capaStatusService';

// Fetch CAPA by ID
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  const { data, error } = await supabase
    .from('capa_actions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  // Transform database response to match our CAPA interface
  return mapDBResponseToCAPA(data);
};

// Update CAPA
export const updateCAPA = async (id: string, capa: CAPA): Promise<CAPA> => {
  // Map status to database format
  const dbStatus = mapStatusToDb(capa.status);

  // Map effectiveness rating to database format if it exists
  const dbEffectivenessRating = capa.effectivenessRating 
    ? mapEffectivenessRatingToDb(capa.effectivenessRating) 
    : null;

  const { data, error } = await supabase
    .from('capa_actions')
    .update({
      title: capa.title,
      description: capa.description,
      root_cause: capa.rootCause,
      corrective_action: capa.correctiveAction,
      preventive_action: capa.preventiveAction,
      priority: capa.priority,
      due_date: capa.dueDate,
      status: dbStatus,
      effectiveness_verified: capa.effectivenessVerified,
      effectiveness_rating: dbEffectivenessRating,
      effectiveness_criteria: capa.effectivenessCriteria,
      assigned_to: capa.assignedTo,
      department: capa.department,
      completion_date: capa.completionDate,
      verification_date: capa.verificationDate,
      verification_method: capa.verificationMethod,
      verified_by: capa.verifiedBy,
      updated_at: new Date().toISOString(),
      fsma204_compliant: capa.isFsma204Compliant
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Transform database response to match our CAPA interface
  return mapDBResponseToCAPA(data);
};

// Create CAPA
export const createCAPA = async (capa: Omit<CAPA, 'id'>): Promise<CAPA> => {
  // Map status to database format
  const dbStatus = mapStatusToDb(capa.status);

  // Map effectiveness rating to database format if it exists
  const dbEffectivenessRating = capa.effectivenessRating 
    ? mapEffectivenessRatingToDb(capa.effectivenessRating) 
    : null;

  const { data, error } = await supabase
    .from('capa_actions')
    .insert({
      title: capa.title,
      description: capa.description,
      root_cause: capa.rootCause,
      corrective_action: capa.correctiveAction,
      preventive_action: capa.preventiveAction,
      priority: capa.priority,
      due_date: capa.dueDate,
      status: dbStatus,
      effectiveness_verified: capa.effectivenessVerified,
      effectiveness_rating: dbEffectivenessRating,
      effectiveness_criteria: capa.effectivenessCriteria,
      assigned_to: capa.assignedTo,
      department: capa.department,
      completion_date: capa.completionDate,
      verification_date: capa.verificationDate,
      verification_method: capa.verificationMethod,
      verified_by: capa.verifiedBy,
      created_by: capa.createdBy,
      created_at: new Date().toISOString(),
      source: capa.source,
      source_id: capa.sourceId,
      fsma204_compliant: capa.isFsma204Compliant
    })
    .select()
    .single();

  if (error) throw error;

  // Transform database response to match our CAPA interface
  return mapDBResponseToCAPA(data);
};

// Helper function to map database response to CAPA interface
const mapDBResponseToCAPA = (data: any): CAPA => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source,
    sourceId: data.source_id,
    rootCause: data.root_cause,
    correctiveAction: data.corrective_action,
    preventiveAction: data.preventive_action,
    priority: data.priority,
    dueDate: data.due_date,
    status: mapStatusFromDb(data.status),
    effectivenessVerified: data.effectiveness_verified,
    effectivenessRating: data.effectiveness_rating ? mapEffectivenessRatingFromDb(data.effectiveness_rating) : undefined,
    effectivenessCriteria: data.effectiveness_criteria,
    assignedTo: data.assigned_to,
    department: data.department,
    completionDate: data.completion_date,
    verificationDate: data.verification_date,
    verificationMethod: data.verification_method,
    verifiedBy: data.verified_by,
    createdBy: data.created_by,
    createdDate: data.created_at,
    lastUpdated: data.updated_at,
    isFsma204Compliant: data.fsma204_compliant,
    relatedDocuments: [],
    relatedTraining: [],
  };
};

// Create CAPA Effectiveness Report
export const createCAPAEffectivenessReport = async (data: CAPAEffectivenessMetrics): Promise<CAPAEffectivenessMetrics> => {
  // Convert boolean to numeric values where needed for database
  const dbData = {
    capa_id: data.capaId,
    assessment_date: data.assessmentDate,
    root_cause_eliminated: data.rootCauseEliminated === true,
    preventive_measures_implemented: data.preventionMeasureEffective === true,
    documentation_complete: data.documentationComplete === true,
    recurrence_check: data.recurrenceCheck ? 'Yes' : 'No',
    score: data.score,
    rating: mapEffectivenessRatingToDb(data.rating),
    notes: data.notes,
    created_by: data.createdBy
  };

  const { data: result, error } = await supabase
    .from('capa_effectiveness_assessments')
    .insert(dbData)
    .select()
    .single();

  if (error) throw error;

  // Map database response to our interface
  return {
    id: result.id,
    capaId: result.capa_id,
    rootCauseEliminated: Boolean(result.root_cause_eliminated),
    documentationComplete: Boolean(result.documentation_complete),
    preventionMeasureEffective: Boolean(result.preventive_measures_implemented),
    recurrenceCheck: result.recurrence_check === 'Yes',
    recurrenceChecked: result.recurrence_check === 'Yes' ? 1 : 0,
    rootCauseEliminated: result.root_cause_eliminated ? 1 : 0,
    documentationComplete: result.documentation_complete ? 1 : 0,
    preventionMeasureEffective: result.preventive_measures_implemented ? 1 : 0,
    overall: result.score,
    score: result.score,
    assessmentDate: result.assessment_date,
    notes: result.notes,
    createdBy: result.created_by,
    rating: mapEffectivenessRatingFromDb(result.rating)
  };
};

// Update CAPA Effectiveness Report
export const updateCAPAEffectivenessReport = async (id: string, data: CAPAEffectivenessMetrics): Promise<CAPAEffectivenessMetrics> => {
  // Convert boolean to numeric values where needed for database
  const dbData = {
    assessment_date: data.assessmentDate,
    root_cause_eliminated: Boolean(data.rootCauseEliminated),
    preventive_measures_implemented: Boolean(data.preventionMeasureEffective),
    documentation_complete: Boolean(data.documentationComplete),
    recurrence_check: data.recurrenceCheck ? 'Yes' : 'No',
    score: data.score,
    rating: mapEffectivenessRatingToDb(data.rating),
    notes: data.notes
  };

  const { data: result, error } = await supabase
    .from('capa_effectiveness_assessments')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Map database response to our interface
  return {
    id: result.id,
    capaId: result.capa_id,
    rootCauseEliminated: Boolean(result.root_cause_eliminated),
    documentationComplete: Boolean(result.documentation_complete),
    preventionMeasureEffective: Boolean(result.preventive_measures_implemented),
    recurrenceCheck: result.recurrence_check === 'Yes',
    recurrenceChecked: result.recurrence_check === 'Yes' ? 1 : 0,
    rootCauseEliminated: result.root_cause_eliminated ? 1 : 0,
    documentationComplete: result.documentation_complete ? 1 : 0,
    preventionMeasureEffective: result.preventive_measures_implemented ? 1 : 0,
    overall: result.score,
    score: result.score,
    assessmentDate: result.assessment_date,
    notes: result.notes,
    createdBy: result.created_by,
    rating: mapEffectivenessRatingFromDb(result.rating)
  };
};

// Get CAPA Effectiveness Report
export const getCAPAEffectivenessReport = async (capaId: string): Promise<CAPAEffectivenessMetrics | null> => {
  const { data, error } = await supabase
    .from('capa_effectiveness_assessments')
    .select('*')
    .eq('capa_id', capaId)
    .maybeSingle();

  if (error) throw error;
  
  if (!data) return null;

  // Map database response to our interface
  return {
    id: data.id,
    capaId: data.capa_id,
    rootCauseEliminated: Boolean(data.root_cause_eliminated),
    documentationComplete: Boolean(data.documentation_complete),
    preventionMeasureEffective: Boolean(data.preventive_measures_implemented),
    recurrenceCheck: data.recurrence_check === 'Yes',
    recurrenceChecked: data.recurrence_check === 'Yes' ? 1 : 0,
    rootCauseEliminated: data.root_cause_eliminated ? 1 : 0,
    documentationComplete: data.documentation_complete ? 1 : 0,
    preventionMeasureEffective: data.preventive_measures_implemented ? 1 : 0,
    overall: data.score,
    score: data.score,
    assessmentDate: data.assessment_date,
    notes: data.notes,
    createdBy: data.created_by,
    rating: mapEffectivenessRatingFromDb(data.rating)
  };
};

// Add these missing functions to fix the errors:

// Fetch CAPAs with optional filtering
export const fetchCAPAs = async (filters?: CAPAFilter): Promise<CAPA[]> => {
  let query = supabase.from('capa_actions').select('*');
  
  // Apply filters if provided
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      const dbStatuses = filters.status.map(status => mapStatusToDb(status));
      query = query.in('status', dbStatuses);
    }
    
    if (filters.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority);
    }
    
    if (filters.source && filters.source.length > 0) {
      query = query.in('source', filters.source);
    }
    
    if (filters.dueDate) {
      // Handle due date filtering logic
      const now = new Date().toISOString();
      
      if (filters.dueDate === 'overdue') {
        query = query.lt('due_date', now).not('status', 'in', ['Closed', 'Verified']);
      } else if (filters.dueDate === 'upcoming') {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        query = query.gt('due_date', now).lt('due_date', futureDate.toISOString());
      }
    }
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Map DB responses to CAPA interface
  return data.map(item => mapDBResponseToCAPA(item));
};

// Get CAPA statistics
export const getCAPAStats = async (): Promise<CAPAStats> => {
  // Fetch all CAPAs to calculate stats
  const { data, error } = await supabase
    .from('capa_actions')
    .select('*');
  
  if (error) throw error;
  
  const capas = data.map(item => mapDBResponseToCAPA(item));
  
  // Calculate stats
  const stats: CAPAStats = {
    total: capas.length,
    openCount: 0,
    closedCount: 0,
    overdueCount: 0,
    verifiedCount: 0,
    inProgressCount: 0,
    pendingVerificationCount: 0,
    byPriority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    bySource: {
      audit: 0,
      complaint: 0,
      'non-conformance': 0,
      internal: 0,
      customer: 0,
      regulatory: 0,
      supplier: 0,
      haccp: 0,
      traceability: 0
    },
    byStatus: {
      open: 0,
      'in-progress': 0,
      closed: 0,
      verified: 0,
      overdue: 0,
      'pending-verification': 0
    },
    effectivenessStats: {
      verified: 0,
      effective: 0,
      partiallyEffective: 0,
      ineffective: 0,
      notEvaluated: 0
    },
    overdue: 0,
    recentItems: [],
    averageTimeToClose: 0,
    averageClosureTime: 0,
    fsma204ComplianceRate: 0,
    completionRates: {}
  };
  
  // Calculate stats based on CAPAs
  const now = new Date();
  
  capas.forEach(capa => {
    // Status counts
    switch (capa.status) {
      case 'open':
        stats.openCount++;
        stats.byStatus.open++;
        break;
      case 'in-progress':
        stats.inProgressCount++;
        stats.byStatus['in-progress']++;
        break;
      case 'closed':
        stats.closedCount++;
        stats.byStatus.closed++;
        break;
      case 'verified':
        stats.verifiedCount++;
        stats.byStatus.verified++;
        break;
      case 'pending-verification':
        stats.pendingVerificationCount++;
        stats.byStatus['pending-verification']++;
        break;
    }
    
    // Priority counts
    if (capa.priority) {
      stats.byPriority[capa.priority as keyof typeof stats.byPriority]++;
    }
    
    // Source counts
    if (capa.source) {
      stats.bySource[capa.source as keyof typeof stats.bySource]++;
    }
    
    // Check if overdue
    if (capa.dueDate && new Date(capa.dueDate) < now && 
        (capa.status === 'open' || capa.status === 'in-progress')) {
      stats.overdueCount++;
      stats.byStatus.overdue++;
    }
    
    // Add to recent items (limit to 5)
    if (stats.recentItems.length < 5) {
      stats.recentItems.push({
        id: capa.id,
        title: capa.title,
        status: capa.status,
        dueDate: capa.dueDate,
        priority: capa.priority,
        createdDate: capa.createdDate
      });
    }
    
    // Effectiveness stats
    if (capa.effectivenessRating) {
      switch (capa.effectivenessRating) {
        case 'effective':
          stats.effectivenessStats.effective++;
          break;
        case 'partially-effective':
          stats.effectivenessStats.partiallyEffective++;
          break;
        case 'ineffective':
          stats.effectivenessStats.ineffective++;
          break;
      }
      
      if (capa.effectivenessVerified) {
        stats.effectivenessStats.verified++;
      }
    } else {
      stats.effectivenessStats.notEvaluated++;
    }
    
    // FSMA 204 compliance
    if (capa.isFsma204Compliant) {
      stats.fsma204ComplianceRate++;
    }
  });
  
  // Calculate percentages and averages
  if (capas.length > 0) {
    stats.fsma204ComplianceRate = Math.round((stats.fsma204ComplianceRate / capas.length) * 100);
    
    // Calculate average closure time
    const closedCapas = capas.filter(capa => capa.status === 'closed' || capa.status === 'verified');
    if (closedCapas.length > 0) {
      let totalDays = 0;
      closedCapas.forEach(capa => {
        if (capa.createdDate && capa.completionDate) {
          const startDate = new Date(capa.createdDate);
          const endDate = new Date(capa.completionDate);
          const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          totalDays += days;
        }
      });
      stats.averageClosureTime = Math.round(totalDays / closedCapas.length);
    }
  }
  
  return stats;
};

// Get potential CAPAs
export const getPotentialCAPAs = async (): Promise<any[]> => {
  // In a real implementation, this would analyze various data sources
  // to suggest potential CAPAs. For now, return mock data.
  
  return [
    {
      id: 'auto-1',
      title: 'Critical temperature deviation in cold storage',
      description: 'Temperature logs show repeated deviations above 5°C in cold storage unit #3',
      source: 'haccp',
      sourceId: 'ccplog-123',
      severity: 'critical',
      suggestedPriority: 'high',
      detectedDate: new Date().toISOString(),
      suggestedActions: 'Investigate cooling system malfunction and implement temperature monitoring alerts',
      relatedIncidents: 2,
      confidence: 0.95
    },
    {
      id: 'auto-2',
      title: 'Multiple foreign material complaints from retail customers',
      description: 'Three customer complaints reporting plastic fragments in product batch #A2245',
      source: 'complaint',
      sourceId: 'comp-456',
      severity: 'high',
      suggestedPriority: 'high',
      detectedDate: new Date().toISOString(),
      suggestedActions: 'Investigate manufacturing process for potential plastic contamination points',
      relatedIncidents: 3,
      confidence: 0.82
    }
  ];
};

export default {
  fetchCAPAById,
  updateCAPA,
  createCAPA,
  createCAPAEffectivenessReport,
  updateCAPAEffectivenessReport,
  getCAPAEffectivenessReport,
  fetchCAPAs,
  getCAPAStats,
  getPotentialCAPAs
};
