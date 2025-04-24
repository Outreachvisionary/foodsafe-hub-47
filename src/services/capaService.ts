
import { supabase } from "@/integrations/supabase/client";
import { CAPA, CAPAStatus } from "@/types/capa";

// Get a single CAPA by ID
export const getCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return adaptCAPAFromDb(data);
  } catch (error) {
    console.error('Error fetching CAPA by ID:', error);
    throw error;
  }
};

// Get all CAPAs with optional filtering
export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_actions')
      .select('*');
    
    if (error) throw error;
    return data.map(item => adaptCAPAFromDb(item));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

// Create a new CAPA
export const createCAPA = async (capaData: Partial<CAPA>): Promise<CAPA> => {
  try {
    const dbData = adaptCAPAToDb(capaData);
    
    const { data, error } = await supabase
      .from('capa_actions')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    return adaptCAPAFromDb(data);
  } catch (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
};

// Update an existing CAPA
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  try {
    const dbData = adaptCAPAToDb(updates);
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return adaptCAPAFromDb(data);
  } catch (error) {
    console.error('Error updating CAPA:', error);
    throw error;
  }
};

// Helper function to adapt database CAPA format to application format
const adaptCAPAFromDb = (dbData: any): CAPA => {
  return {
    id: dbData.id,
    title: dbData.title,
    description: dbData.description,
    status: dbData.status as CAPAStatus,
    priority: dbData.priority,
    createdAt: dbData.created_at,
    dueDate: dbData.due_date,
    completionDate: dbData.completion_date,
    verificationDate: dbData.verification_date,
    assignedTo: dbData.assigned_to,
    createdBy: dbData.created_by,
    source: dbData.source,
    rootCause: dbData.root_cause,
    correctiveAction: dbData.corrective_action,
    preventiveAction: dbData.preventive_action,
    department: dbData.department,
    verificationMethod: dbData.verification_method,
    effectivenessCriteria: dbData.effectiveness_criteria,
    effectivenessRating: dbData.effectiveness_rating,
    verifiedBy: dbData.verified_by,
    isFsma204Compliant: dbData.fsma204_compliant,
    // These would require additional queries to populate
    relatedDocuments: [],
    relatedTraining: []
  };
};

// Helper function to adapt application CAPA format to database format
const adaptCAPAToDb = (capaData: Partial<CAPA>): any => {
  return {
    ...(capaData.title && { title: capaData.title }),
    ...(capaData.description && { description: capaData.description }),
    ...(capaData.status && { status: capaData.status }),
    ...(capaData.priority && { priority: capaData.priority }),
    ...(capaData.dueDate && { due_date: capaData.dueDate }),
    ...(capaData.completionDate && { completion_date: capaData.completionDate }),
    ...(capaData.verificationDate && { verification_date: capaData.verificationDate }),
    ...(capaData.assignedTo && { assigned_to: capaData.assignedTo }),
    ...(capaData.createdBy && { created_by: capaData.createdBy }),
    ...(capaData.source && { source: capaData.source }),
    ...(capaData.rootCause && { root_cause: capaData.rootCause }),
    ...(capaData.correctiveAction && { corrective_action: capaData.correctiveAction }),
    ...(capaData.preventiveAction && { preventive_action: capaData.preventiveAction }),
    ...(capaData.department && { department: capaData.department }),
    ...(capaData.verificationMethod && { verification_method: capaData.verificationMethod }),
    ...(capaData.effectivenessCriteria && { effectiveness_criteria: capaData.effectivenessCriteria }),
    ...(capaData.effectivenessRating && { effectiveness_rating: capaData.effectivenessRating }),
    ...(capaData.verifiedBy && { verified_by: capaData.verifiedBy }),
    ...(capaData.isFsma204Compliant !== undefined && { fsma204_compliant: capaData.isFsma204Compliant })
  };
};

export const mapStatusToInternal = (status: string) => {
  // Map external status to internal status format
  switch(status) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Verified': 
    case 'Pending Verification': return 'Pending Verification';
    default: return 'Open';
  }
};

// Export other needed functions
export default {
  getCAPAById,
  mapStatusToInternal,
  getCAPAs,
  createCAPA,
  updateCAPA
};
