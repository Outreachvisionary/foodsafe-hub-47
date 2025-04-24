
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';
import { DbCAPAStatus, mapDbStatusToInternal } from './capaStatusMapper';

// Helper function to handle type conversions from DB format to app format
const convertDbToAppFormat = (dbCapa: any): CAPA => {
  // Convert status strings like 'In Progress' to app format 'In_Progress'
  let status: CAPAStatus;
  switch (dbCapa.status) {
    case 'In Progress':
      status = 'In_Progress';
      break;
    case 'Pending Verification':
      status = 'Pending_Verification';
      break;
    default:
      status = dbCapa.status as CAPAStatus;
  }

  // Convert effectiveness rating strings
  let effectivenessRating: CAPAEffectivenessRating | undefined;
  if (dbCapa.effectiveness_rating) {
    switch (dbCapa.effectiveness_rating) {
      case 'Highly Effective':
        effectivenessRating = 'Highly_Effective';
        break;
      case 'Partially Effective':
        effectivenessRating = 'Partially_Effective';
        break;
      case 'Not Effective':
        effectivenessRating = 'Not_Effective';
        break;
      default:
        effectivenessRating = dbCapa.effectiveness_rating as CAPAEffectivenessRating;
    }
  }

  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: status,
    priority: dbCapa.priority,
    createdAt: dbCapa.created_at,
    dueDate: dbCapa.due_date,
    completionDate: dbCapa.completion_date,
    verificationDate: dbCapa.verification_date,
    assignedTo: dbCapa.assigned_to,
    createdBy: dbCapa.created_by,
    source: dbCapa.source,
    rootCause: dbCapa.root_cause,
    correctiveAction: dbCapa.corrective_action,
    preventiveAction: dbCapa.preventive_action,
    department: dbCapa.department,
    effectivenessRating: effectivenessRating,
    effectivenessCriteria: dbCapa.effectiveness_criteria,
    verificationMethod: dbCapa.verification_method,
    verifiedBy: dbCapa.verified_by,
    fsma204Compliant: dbCapa.fsma204_compliant,
    effectivenessVerified: dbCapa.effectiveness_verified,
    sourceId: dbCapa.source_id,
    sourceReference: dbCapa.source_reference || '',
    relatedDocuments: [],
    relatedTraining: []
  };
};

// Get all CAPAs
export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*');

    if (error) throw new Error(`Failed to fetch CAPAs: ${error.message}`);
    return data.map(convertDbToAppFormat);
  } catch (error) {
    console.error('Error in getCAPAs:', error);
    throw error;
  }
};

// Get a single CAPA by ID
export const getCAPAById = async (capaId: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', capaId)
      .single();

    if (error) throw new Error(`Failed to fetch CAPA: ${error.message}`);
    return convertDbToAppFormat(data);
  } catch (error) {
    console.error('Error in getCAPAById:', error);
    throw error;
  }
};

// Delete a CAPA by ID
export const deleteCAPA = async (capaId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', capaId);

    if (error) throw new Error(`Failed to delete CAPA: ${error.message}`);
  } catch (error) {
    console.error('Error in deleteCAPA:', error);
    throw error;
  }
};
