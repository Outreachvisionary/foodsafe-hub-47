
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPASource, CAPAPriority, CAPAStatus, DbCAPAStatus, CAPAEffectivenessRating, mapStatusToDb, mapEffectivenessRatingToDb, mapDbStatusToInternal } from '@/types/capa';

/**
 * Create a new CAPA record
 */
export async function createCAPA(capaData: Omit<CAPA, 'id'>): Promise<CAPA> {
  try {
    // Convert status to database format
    const dbStatus: DbCAPAStatus = mapStatusToDb(capaData.status);
    
    // Map effectiveness rating to DB format if provided
    let dbEffectivenessRating: string | undefined;
    if (capaData.effectivenessRating) {
      dbEffectivenessRating = mapEffectivenessRatingToDb(capaData.effectivenessRating);
    }
    
    // Prepare data for database insertion
    const insertData: any = {
      title: capaData.title,
      description: capaData.description,
      status: dbStatus,
      priority: capaData.priority,
      source: capaData.source,
      source_id: capaData.sourceId,
      assigned_to: capaData.assignedTo,
      department: capaData.department,
      due_date: capaData.dueDate,
      created_by: capaData.createdBy,
      created_date: capaData.createdDate,
      last_updated: capaData.lastUpdated || new Date().toISOString(),
      is_fsma204_compliant: capaData.isFsma204Compliant || false,
      effectiveness_verified: capaData.effectivenessVerified || false
    };
    
    // Add optional fields if they exist
    if (capaData.rootCause) insertData.root_cause = capaData.rootCause;
    if (capaData.correctiveAction) insertData.corrective_action = capaData.correctiveAction;
    if (capaData.preventiveAction) insertData.preventive_action = capaData.preventiveAction;
    if (capaData.effectivenessCriteria) insertData.effectiveness_criteria = capaData.effectivenessCriteria;
    if (capaData.completionDate) insertData.completion_date = capaData.completionDate;
    if (capaData.verificationMethod) insertData.verification_method = capaData.verificationMethod;
    if (capaData.verificationDate) insertData.verification_date = capaData.verificationDate;
    if (capaData.verifiedBy) insertData.verified_by = capaData.verifiedBy;
    if (dbEffectivenessRating) insertData.effectiveness_rating = dbEffectivenessRating;
    if (capaData.sourceReference) insertData.source_reference = capaData.sourceReference;
    if (capaData.relatedDocuments) insertData.related_documents = capaData.relatedDocuments;
    if (capaData.relatedTraining) insertData.related_training = capaData.relatedTraining;

    // Insert into database
    const { data, error } = await supabase
      .from('capas')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      throw error;
    }

    // Transform response to match CAPA interface
    const newCapa: CAPA = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: mapDbStatusToInternal(data.status as DbCAPAStatus),
      priority: data.priority as CAPAPriority,
      source: data.source as CAPASource,
      sourceId: data.source_id,
      assignedTo: data.assigned_to,
      department: data.department,
      dueDate: data.due_date,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      effectivenessCriteria: data.effectiveness_criteria,
      completionDate: data.completion_date,
      createdBy: data.created_by,
      createdDate: data.created_date,
      lastUpdated: data.last_updated,
      isFsma204Compliant: data.is_fsma204_compliant,
      verificationMethod: data.verification_method,
      verificationDate: data.verification_date,
      verifiedBy: data.verified_by,
      effectivenessVerified: data.effectiveness_verified,
      effectivenessRating: data.effectiveness_rating,
      sourceReference: data.source_reference,
      relatedDocuments: data.related_documents,
      relatedTraining: data.related_training
    };

    return newCapa;
  } catch (error) {
    console.error('Error in createCAPA:', error);
    throw error;
  }
}

/**
 * Update a CAPA record
 */
export async function updateCAPA(id: string, capaData: Partial<CAPA>): Promise<CAPA> {
  try {
    // Convert status to database format if provided
    let dbStatus: DbCAPAStatus | undefined;
    if (capaData.status) {
      dbStatus = mapStatusToDb(capaData.status);
    }

    // Map effectiveness rating to DB format if provided
    let dbEffectivenessRating: string | undefined;
    if (capaData.effectivenessRating) {
      dbEffectivenessRating = mapEffectivenessRatingToDb(capaData.effectivenessRating);
    }

    // Prepare data for database update
    const updateData: any = {
      ...capaData,
      status: dbStatus,
      effectiveness_rating: dbEffectivenessRating,
      last_updated: new Date().toISOString()
    };

    // Remove fields that should not be directly updated
    delete updateData.id;
    delete updateData.created_date;
    delete updateData.lastUpdated; // Use last_updated instead
    delete updateData.effectivenessRating; // Use effectiveness_rating instead
    delete updateData.status; // Use the mapped status
    
    // Convert field names to snake_case for database
    if (updateData.sourceId !== undefined) {
      updateData.source_id = updateData.sourceId;
      delete updateData.sourceId;
    }
    
    if (updateData.assignedTo !== undefined) {
      updateData.assigned_to = updateData.assignedTo;
      delete updateData.assignedTo;
    }
    
    if (updateData.dueDate !== undefined) {
      updateData.due_date = updateData.dueDate;
      delete updateData.dueDate;
    }
    
    if (updateData.rootCause !== undefined) {
      updateData.root_cause = updateData.rootCause;
      delete updateData.rootCause;
    }
    
    if (updateData.correctiveAction !== undefined) {
      updateData.corrective_action = updateData.correctiveAction;
      delete updateData.correctiveAction;
    }
    
    if (updateData.preventiveAction !== undefined) {
      updateData.preventive_action = updateData.preventiveAction;
      delete updateData.preventiveAction;
    }
    
    if (updateData.effectivenessCriteria !== undefined) {
      updateData.effectiveness_criteria = updateData.effectivenessCriteria;
      delete updateData.effectivenessCriteria;
    }
    
    if (updateData.completionDate !== undefined) {
      updateData.completion_date = updateData.completionDate;
      delete updateData.completionDate;
    }
    
    if (updateData.createdBy !== undefined) {
      updateData.created_by = updateData.createdBy;
      delete updateData.createdBy;
    }
    
    if (updateData.createdDate !== undefined) {
      updateData.created_date = updateData.createdDate;
      delete updateData.createdDate;
    }
    
    if (updateData.isFsma204Compliant !== undefined) {
      updateData.is_fsma204_compliant = updateData.isFsma204Compliant;
      delete updateData.isFsma204Compliant;
    }
    
    if (updateData.verificationMethod !== undefined) {
      updateData.verification_method = updateData.verificationMethod;
      delete updateData.verificationMethod;
    }
    
    if (updateData.verificationDate !== undefined) {
      updateData.verification_date = updateData.verificationDate;
      delete updateData.verificationDate;
    }
    
    if (updateData.verifiedBy !== undefined) {
      updateData.verified_by = updateData.verifiedBy;
      delete updateData.verifiedBy;
    }
    
    if (updateData.effectivenessVerified !== undefined) {
      updateData.effectiveness_verified = updateData.effectivenessVerified;
      delete updateData.effectivenessVerified;
    }
    
    if (updateData.sourceReference !== undefined) {
      updateData.source_reference = updateData.sourceReference;
      delete updateData.sourceReference;
    }
    
    if (updateData.relatedDocuments !== undefined) {
      updateData.related_documents = updateData.relatedDocuments;
      delete updateData.relatedDocuments;
    }
    
    if (updateData.relatedTraining !== undefined) {
      updateData.related_training = updateData.relatedTraining;
      delete updateData.relatedTraining;
    }

    // Perform the update
    const { data, error } = await supabase
      .from('capas')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      throw error;
    }

    // Transform the response to match the CAPA interface
    const updatedCapa: CAPA = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority as CAPAPriority,
      source: data.source as CAPASource,
      sourceId: data.source_id,
      assignedTo: data.assigned_to,
      department: data.department,
      dueDate: data.due_date,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      effectivenessCriteria: data.effectiveness_criteria,
      completionDate: data.completion_date,
      createdBy: data.created_by,
      createdDate: data.created_date,
      lastUpdated: data.last_updated,
      isFsma204Compliant: data.is_fsma204_compliant,
      verificationMethod: data.verification_method,
      verificationDate: data.verification_date,
      verifiedBy: data.verified_by,
      effectivenessVerified: data.effectiveness_verified,
      effectivenessRating: data.effectiveness_rating as CAPAEffectivenessRating,
      sourceReference: data.source_reference,
      relatedDocuments: data.related_documents,
      relatedTraining: data.related_training
    };

    return updatedCapa;
  } catch (error) {
    console.error('Error in updateCAPA:', error);
    throw error;
  }
}

/**
 * Delete a CAPA record
 */
export async function deleteCAPA(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('capas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting CAPA:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteCAPA:', error);
    throw error;
  }
}
