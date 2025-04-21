
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAPriority, mapStatusToDb, DbCAPAStatus } from '@/types/capa';
import { mapDbResultToCapa } from './capaFetchService';

/**
 * Create a new CAPA
 */
export const createCAPA = async (capa: Omit<CAPA, 'id' | 'createdDate' | 'lastUpdated'>): Promise<CAPA> => {
  const dbStatus = mapStatusToDb(capa.status);
  
  // Map CAPA type to database schema
  const dbRecord = {
    title: capa.title,
    description: capa.description,
    source: capa.source,
    source_id: capa.sourceId,
    priority: capa.priority,
    status: dbStatus,
    assigned_to: capa.assignedTo,
    due_date: capa.dueDate,
    completion_date: capa.completionDate,
    root_cause: capa.rootCause,
    corrective_action: capa.correctiveAction,
    preventive_action: capa.preventiveAction,
    verification_date: capa.verificationDate,
    effectiveness_criteria: capa.effectivenessCriteria || '',
    effectiveness_verified: capa.effectivenessVerified || false,
    created_by: (await supabase.auth.getUser()).data.user?.id || 'system',
    is_fsma204_compliant: capa.isFsma204Compliant || false,
    department: capa.department,
    verification_method: capa.verificationMethod,
    verified_by: capa.verifiedBy,
    effectiveness_rating: capa.effectivenessRating
  };

  // Use type casting since the DB schema might have additional validation
  const { data, error } = await supabase
    .from('capa_actions')
    .insert(dbRecord as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
  
  // Return the created CAPA with generated ID and timestamps
  return mapDbResultToCapa(data);
};

/**
 * Update an existing CAPA
 */
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  // Map CAPA type to database schema
  const dbUpdates: any = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.source !== undefined) dbUpdates.source = updates.source;
  if (updates.sourceId !== undefined) dbUpdates.source_id = updates.sourceId;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.status !== undefined) {
    // Convert frontend status to the format expected by the database
    dbUpdates.status = mapStatusToDb(updates.status);
  }
  if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
  if (updates.completionDate !== undefined) dbUpdates.completion_date = updates.completionDate;
  if (updates.rootCause !== undefined) dbUpdates.root_cause = updates.rootCause;
  if (updates.correctiveAction !== undefined) dbUpdates.corrective_action = updates.correctiveAction;
  if (updates.preventiveAction !== undefined) dbUpdates.preventive_action = updates.preventiveAction;
  if (updates.verificationDate !== undefined) dbUpdates.verification_date = updates.verificationDate;
  if (updates.effectivenessCriteria !== undefined) dbUpdates.effectiveness_criteria = updates.effectivenessCriteria;
  if (updates.effectivenessVerified !== undefined) dbUpdates.effectiveness_verified = updates.effectivenessVerified;
  if (updates.effectivenessRating !== undefined) dbUpdates.effectiveness_rating = updates.effectivenessRating;
  if (updates.isFsma204Compliant !== undefined) dbUpdates.is_fsma204_compliant = updates.isFsma204Compliant;
  if (updates.department !== undefined) dbUpdates.department = updates.department;
  if (updates.verificationMethod !== undefined) dbUpdates.verification_method = updates.verificationMethod;
  if (updates.verifiedBy !== undefined) dbUpdates.verified_by = updates.verifiedBy;

  // Use type casting for the update operation since the database schema might have additional validation
  const { data, error } = await supabase
    .from('capa_actions')
    .update(dbUpdates as any)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating CAPA with ID ${id}:`, error);
    throw error;
  }
  
  // Return the updated CAPA
  return mapDbResultToCapa(data);
};

/**
 * Delete a CAPA
 */
export const deleteCAPA = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('capa_actions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting CAPA with ID ${id}:`, error);
    throw error;
  }
};
