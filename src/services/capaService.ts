
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAEffectivenessMetrics } from '@/types/capa';
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
    root_cause_eliminated: data.rootCauseEliminated === true ? true : false,
    preventive_measures_implemented: data.preventionMeasureEffective === true ? true : false,
    documentation_complete: data.documentationComplete === true ? true : false,
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
    rootCauseEliminated: result.root_cause_eliminated,
    documentationComplete: result.documentation_complete,
    preventionMeasureEffective: result.preventive_measures_implemented,
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
    root_cause_eliminated: data.rootCauseEliminated === true ? true : false,
    preventive_measures_implemented: data.preventionMeasureEffective === true ? true : false,
    documentation_complete: data.documentationComplete === true ? true : false,
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
    rootCauseEliminated: result.root_cause_eliminated,
    documentationComplete: result.documentation_complete,
    preventionMeasureEffective: result.preventive_measures_implemented,
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
    rootCauseEliminated: data.root_cause_eliminated,
    documentationComplete: data.documentation_complete,
    preventionMeasureEffective: data.preventive_measures_implemented,
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

export default {
  fetchCAPAById,
  updateCAPA,
  createCAPA,
  createCAPAEffectivenessReport,
  updateCAPAEffectivenessReport,
  getCAPAEffectivenessReport
};
