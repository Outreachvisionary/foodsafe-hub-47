
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';
import { getCAPAById as fetchCAPAById } from './capaFetchService';
import { mapInternalStatusToDb, DbCAPAStatus } from './capaStatusMapper';

// Re-export the function from capaFetchService for backward compatibility
export const getCAPAById = fetchCAPAById;

export const createCAPA = async (capaData: Partial<CAPA>) => {
  try {
    // Map the status to DB format if it exists
    const status = capaData.status ? mapInternalStatusToDb(capaData.status) : 'Open';
    
    // Map effectiveness rating if present to DB format
    let effectivenessRating: string | undefined = undefined;
    if (capaData.effectivenessRating) {
      switch (capaData.effectivenessRating) {
        case 'Partially_Effective':
          effectivenessRating = 'Partially Effective';
          break;
        case 'Not_Effective':
          effectivenessRating = 'Not Effective';
          break;
        case 'Highly_Effective':
          effectivenessRating = 'Highly Effective';
          break;
        default:
          effectivenessRating = capaData.effectivenessRating;
      }
    }
    
    // Create an object that follows the database schema
    const dbCAPAData: any = {
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
      source_reference: capaData.sourceReference,
      // Only include these fields if they exist
      ...(capaData.completionDate && { completion_date: capaData.completionDate }),
      ...(capaData.verificationDate && { verification_date: capaData.verificationDate }),
      ...(effectivenessRating && { effectiveness_rating: effectivenessRating }),
      ...(capaData.verificationMethod && { verification_method: capaData.verificationMethod }),
      ...(capaData.verifiedBy && { verified_by: capaData.verifiedBy }),
      ...(capaData.fsma204Compliant !== undefined && { fsma204_compliant: capaData.fsma204Compliant }),
      ...(capaData.effectivenessVerified !== undefined && { effectiveness_verified: capaData.effectivenessVerified })
    };

    // Cast to any to bypass TypeScript checking since we've verified our data
    const { data, error } = await supabase
      .from('capa_actions')
      .insert([dbCAPAData] as any)
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
      // Map effectiveness rating to DB format
      switch (capaData.effectivenessRating) {
        case 'Partially_Effective':
          updateData.effectiveness_rating = 'Partially Effective';
          break;
        case 'Not_Effective':
          updateData.effectiveness_rating = 'Not Effective';
          break;
        case 'Highly_Effective':
          updateData.effectiveness_rating = 'Highly Effective';
          break;
        default:
          updateData.effectiveness_rating = capaData.effectivenessRating;
      }
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

    // Cast to any to bypass TypeScript checking since we've verified our data
    const { data, error } = await supabase
      .from('capa_actions')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Could not update CAPA: ${error.message}`);
    }

    // Since we're converting from DB format to the CAPA type, we can cast safely after transformation
    const capaResult: CAPA = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status === 'In Progress' ? 'In_Progress' :
              data.status === 'Pending Verification' ? 'Pending_Verification' : 
              data.status as CAPAStatus,
      priority: data.priority,
      createdAt: data.created_at,
      dueDate: data.due_date,
      completionDate: data.completion_date,
      verificationDate: data.verification_date,
      assignedTo: data.assigned_to,
      createdBy: data.created_by,
      source: data.source,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      department: data.department,
      effectivenessRating: data.effectiveness_rating === 'Partially Effective' ? 'Partially_Effective' :
                          data.effectiveness_rating === 'Not Effective' ? 'Not_Effective' :
                          data.effectiveness_rating === 'Highly Effective' ? 'Highly_Effective' :
                          data.effectiveness_rating as CAPAEffectivenessRating,
      effectivenessCriteria: data.effectiveness_criteria,
      verificationMethod: data.verification_method,
      verifiedBy: data.verified_by,
      fsma204Compliant: data.fsma204_compliant,
      effectivenessVerified: data.effectiveness_verified,
      sourceId: data.source_id,
      sourceReference: data.source_reference || '',
      relatedDocuments: [],
      relatedTraining: []
    };

    return capaResult;
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

// Re-export the deleteCAPA function from capaFetchService
export { deleteCAPA } from './capaFetchService';

// Add the getCAPAs function that was missing
export { getCAPAs } from './capaFetchService';
