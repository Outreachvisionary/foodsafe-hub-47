
/**
 * CAPA Fetch Service
 * 
 * Service for fetching CAPA data from the database
 */

import { supabase } from '@/integrations/supabase/client';
import { CAPA } from '@/types/capa';
import { mapStatusFromDb, mapEffectivenessRatingFromDb } from './capaStatusMapper';

/**
 * Fetches all CAPAs from the database
 */
export const fetchAllCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(adaptCAPAFromDb);
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
};

/**
 * Fetches a single CAPA by ID
 */
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!data) throw new Error(`CAPA with ID ${id} not found`);
    
    return adaptCAPAFromDb(data);
  } catch (error) {
    console.error(`Error fetching CAPA with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Adapts a CAPA from the database format to the application format
 */
export const adaptCAPAFromDb = (dbCapa: any): CAPA => {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: mapStatusFromDb(dbCapa.status),
    priority: dbCapa.priority,
    source: dbCapa.source,
    sourceReference: dbCapa.source_reference || '',
    rootCause: dbCapa.root_cause,
    correctiveAction: dbCapa.corrective_action,
    preventiveAction: dbCapa.preventive_action,
    assignedTo: dbCapa.assigned_to,
    createdBy: dbCapa.created_by,
    createdAt: dbCapa.created_at,
    dueDate: dbCapa.due_date,
    department: dbCapa.department,
    completionDate: dbCapa.completion_date,
    effectivenessCriteria: dbCapa.effectiveness_criteria,
    attachments: dbCapa.attachments || [],
    comments: dbCapa.comments || [],
    fsma204Compliant: dbCapa.fsma204_compliant,
    location: dbCapa.location,
    verificationMethod: dbCapa.verification_method,
    effectivenessVerified: dbCapa.effectiveness_verified,
    effectivenessRating: dbCapa.effectiveness_rating ? 
      mapEffectivenessRatingFromDb(dbCapa.effectiveness_rating) : 
      undefined,
    verifiedBy: dbCapa.verified_by,
    verificationDate: dbCapa.verification_date,
    verificationComments: dbCapa.verification_comments,
  };
};

export default {
  fetchAllCAPAs,
  fetchCAPAById,
  adaptCAPAFromDb
};
