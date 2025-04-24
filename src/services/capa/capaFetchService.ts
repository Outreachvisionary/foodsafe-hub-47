
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAEffectivenessRating } from '@/types/capa';
import { mapInternalStatusToDb } from './capaStatusMapper';

// Helper function to handle type conversions from DB format to app format
const convertDbToAppFormat = (dbCapa: any): CAPA => {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: dbCapa.status === 'In Progress' ? 'In_Progress' : 
            dbCapa.status === 'Pending Verification' ? 'Pending_Verification' : dbCapa.status as CAPAStatus,
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
    effectivenessRating: dbCapa.effectiveness_rating === 'Highly Effective' ? 'Highly_Effective' :
                        dbCapa.effectiveness_rating === 'Partially Effective' ? 'Partially_Effective' :
                        dbCapa.effectiveness_rating === 'Not Effective' ? 'Not_Effective' :
                        dbCapa.effectiveness_rating as CAPAEffectivenessRating,
    effectivenessCriteria: dbCapa.effectiveness_criteria,
    verificationMethod: dbCapa.verification_method,
    verifiedBy: dbCapa.verified_by,
    fsma204Compliant: dbCapa.fsma204_compliant,
    effectivenessVerified: dbCapa.effectiveness_verified,
    sourceId: dbCapa.source_id,
    sourceReference: dbCapa.source_reference,
    relatedDocuments: dbCapa.related_documents || [],
    relatedTraining: dbCapa.related_training || []
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
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

// Get CAPA by ID
export const getCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(`Failed to fetch CAPA: ${error.message}`);
    
    return convertDbToAppFormat(data);
  } catch (error) {
    console.error(`Error fetching CAPA ${id}:`, error);
    throw error;
  }
};

// Delete CAPA
export const deleteCAPA = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('capa_actions')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`Failed to delete CAPA: ${error.message}`);
  } catch (error) {
    console.error(`Error deleting CAPA ${id}:`, error);
    throw error;
  }
};

// Export the function for getCAPAById for other modules to use
export { getCAPAById };
