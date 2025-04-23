import { supabase } from '@/integrations/supabase/client';
import { CAPA } from '@/types/capa';

// Fetch a single CAPA by ID
export const getCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Map database fields to CAPA interface
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      source: data.source,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      createdBy: data.created_by,
      createdAt: data.created_at,
      createdDate: data.created_at, // Alias for createdAt
      lastUpdated: data.updated_at,
      effectivenessCriteria: data.effectiveness_criteria,
      sourceId: data.source_id,
      department: data.department,
      verificationMethod: data.verification_method,
      verifiedBy: data.verified_by,
      completionDate: data.completion_date,
      verificationDate: data.verification_date,
      effectivenessRating: data.effectiveness_rating,
      effectivenessVerified: data.effectiveness_verified,
      isFsma204Compliant: data.fsma204_compliant,
      // Default empty arrays for related items to avoid null checks
      relatedDocuments: [],
      relatedTraining: []
    };
  } catch (error) {
    console.error('Error fetching CAPA:', error);
    throw error;
  }
};

// Update a CAPA
export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    // Transform CAPA interface to database fields
    const dbData = {
      title: capaData.title,
      description: capaData.description,
      status: capaData.status,
      priority: capaData.priority,
      source: capaData.source,
      root_cause: capaData.rootCause,
      corrective_action: capaData.correctiveAction,
      preventive_action: capaData.preventiveAction,
      due_date: capaData.dueDate,
      assigned_to: capaData.assignedTo,
      updated_at: new Date().toISOString(),
      effectiveness_criteria: capaData.effectivenessCriteria,
      department: capaData.department,
      verification_method: capaData.verificationMethod,
      verified_by: capaData.verifiedBy,
      completion_date: capaData.completionDate,
      verification_date: capaData.verificationDate,
      effectiveness_rating: capaData.effectivenessRating,
      effectiveness_verified: capaData.effectivenessVerified,
      fsma204_compliant: capaData.isFsma204Compliant
    };

    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Map response back to CAPA interface
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      source: data.source,
      rootCause: data.root_cause,
      correctiveAction: data.corrective_action,
      preventiveAction: data.preventive_action,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      createdBy: data.created_by,
      createdAt: data.created_at,
      createdDate: data.created_at, // Alias for createdAt
      lastUpdated: data.updated_at,
      effectivenessCriteria: data.effectiveness_criteria,
      sourceId: data.source_id,
      department: data.department,
      verificationMethod: data.verification_method,
      verifiedBy: data.verified_by,
      completionDate: data.completion_date,
      verificationDate: data.verification_date,
      effectivenessRating: data.effectiveness_rating,
      effectivenessVerified: data.effectiveness_verified,
      isFsma204Compliant: data.fsma204_compliant,
      // Default empty arrays for related items
      relatedDocuments: [],
      relatedTraining: []
    };
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

// Alias for backward compatibility
export const fetchCAPAById = getCAPAById;

// Export more functions here...
