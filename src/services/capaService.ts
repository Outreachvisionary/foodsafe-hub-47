
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus } from '@/types/capa';
import { getCAPAById as fetchCAPAById } from './capa/capaFetchService';
import { mapInternalStatusToDb } from './capa/capaStatusMapper';

// Re-export the function from capaFetchService for backward compatibility
export const getCAPAById = fetchCAPAById;

export const createCAPA = async (capaData: Partial<CAPA>) => {
  try {
    // Map the status to DB format if it exists
    const status = capaData.status ? mapInternalStatusToDb(capaData.status) : 'Open';
    
    const dbCAPAData = {
      title: capaData.title,
      description: capaData.description,
      priority: capaData.priority,
      status: status,
      created_at: capaData.createdAt || new Date().toISOString(),
      due_date: capaData.dueDate,
      assigned_to: capaData.assignedTo,
      created_by: capaData.createdBy,
      source: capaData.source,
      root_cause: capaData.rootCause,
      corrective_action: capaData.correctiveAction,
      preventive_action: capaData.preventiveAction,
      department: capaData.department,
      effectiveness_criteria: capaData.effectivenessCriteria,
      source_id: capaData.sourceId,
      // Only include these fields if they exist
      ...(capaData.completionDate && { completion_date: capaData.completionDate }),
      ...(capaData.verificationDate && { verification_date: capaData.verificationDate }),
      ...(capaData.effectivenessRating && { effectiveness_rating: capaData.effectivenessRating }),
      ...(capaData.verificationMethod && { verification_method: capaData.verificationMethod }),
      ...(capaData.verifiedBy && { verified_by: capaData.verifiedBy }),
      ...(capaData.fsma204Compliant !== undefined && { fsma204_compliant: capaData.fsma204Compliant }),
      ...(capaData.effectivenessVerified !== undefined && { effectiveness_verified: capaData.effectivenessVerified }),
      ...(capaData.sourceReference && { source_reference: capaData.sourceReference })
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .insert([dbCAPAData])
      .select()
      .single();

    if (error) {
      throw new Error(`Could not create CAPA: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

export const updateCAPA = async (id: string, capaData: Partial<CAPA>) => {
  try {
    const updateData: { [key: string]: any } = {};

    if (capaData.title !== undefined) {
      updateData.title = capaData.title;
    }
    if (capaData.description !== undefined) {
      updateData.description = capaData.description;
    }
    if (capaData.status !== undefined) {
      updateData.status = mapInternalStatusToDb(capaData.status);
    }
    if (capaData.priority !== undefined) {
      updateData.priority = capaData.priority;
    }
    if (capaData.dueDate !== undefined) {
      updateData.due_date = capaData.dueDate;
    }
    if (capaData.completionDate !== undefined) {
      updateData.completion_date = capaData.completionDate;
    }
    if (capaData.verificationDate !== undefined) {
      updateData.verification_date = capaData.verificationDate;
    }
    if (capaData.assignedTo !== undefined) {
      updateData.assigned_to = capaData.assignedTo;
    }
    if (capaData.source !== undefined) {
      updateData.source = capaData.source;
    }
    if (capaData.rootCause !== undefined) {
      updateData.root_cause = capaData.rootCause;
    }
    if (capaData.correctiveAction !== undefined) {
      updateData.corrective_action = capaData.correctiveAction;
    }
    if (capaData.preventiveAction !== undefined) {
      updateData.preventive_action = capaData.preventiveAction;
    }
    if (capaData.department !== undefined) {
      updateData.department = capaData.department;
    }
    if (capaData.effectivenessRating !== undefined) {
      updateData.effectiveness_rating = capaData.effectivenessRating;
    }
    if (capaData.effectivenessCriteria !== undefined) {
      updateData.effectiveness_criteria = capaData.effectivenessCriteria;
    }
    if (capaData.verificationMethod !== undefined) {
      updateData.verification_method = capaData.verificationMethod;
    }
    if (capaData.verifiedBy !== undefined) {
      updateData.verified_by = capaData.verifiedBy;
    }
    if (capaData.fsma204Compliant !== undefined) {
      updateData.fsma204_compliant = capaData.fsma204Compliant;
    }
    if (capaData.effectivenessVerified !== undefined) {
      updateData.effectiveness_verified = capaData.effectivenessVerified;
    }
    if (capaData.sourceId !== undefined) {
      updateData.source_id = capaData.sourceId;
    }
    if (capaData.sourceReference !== undefined) {
      updateData.source_reference = capaData.sourceReference;
    }

    const { data, error } = await supabase
      .from('capa_actions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Could not update CAPA: ${error.message}`);
    }

    return data as CAPA;
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

// Re-export the deleteCAPA function from capaFetchService
export { deleteCAPA } from './capa/capaFetchService';

// Add the getCAPAs function that was missing
export { getCAPAs } from './capa/capaFetchService';
