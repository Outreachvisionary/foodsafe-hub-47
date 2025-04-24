
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus } from '@/types/capa';
import { DbCAPAStatus, mapInternalStatusToDb } from './capaStatusMapper';
import { recordCAPAActivity } from './capaActivityService';

export const updateCAPAStatus = async (
  capaId: string, 
  newStatus: CAPAStatus, 
  userId: string, 
  comments?: string
): Promise<CAPA> => {
  try {
    // Get current CAPA to record the current status before updating
    const { data: currentCAPA, error: fetchError } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', capaId)
      .single();
    
    if (fetchError) throw new Error(`Failed to fetch current CAPA: ${fetchError.message}`);
    
    const currentStatus = currentCAPA.status;
    const dbNewStatus = mapInternalStatusToDb(newStatus);
    
    // Prepare additional fields for specific status changes
    const additionalFields: Record<string, any> = {};
    
    if (newStatus === 'In_Progress' && currentStatus !== 'In Progress') {
      // No additional fields needed for now
    }
    
    if (newStatus === 'Closed' && currentStatus !== 'Closed') {
      additionalFields.completion_date = new Date().toISOString();
    }
    
    if (newStatus === 'Pending_Verification' && currentStatus !== 'Pending Verification') {
      // This could set a verification due date, etc.
    }
    
    if (newStatus === 'Verified' && currentStatus !== 'Verified') {
      additionalFields.verification_date = new Date().toISOString();
      additionalFields.verified_by = userId;
      additionalFields.effectiveness_verified = true;
    }
    
    // Update the CAPA with new status and any additional fields
    const { data, error } = await supabase
      .from('capa_actions')
      .update({
        status: dbNewStatus,
        ...additionalFields,
        updated_at: new Date().toISOString()
      })
      .eq('id', capaId)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update CAPA status: ${error.message}`);
    
    // Record the activity
    await recordCAPAActivity({
      capa_id: capaId,
      old_status: currentStatus === 'In Progress' ? 'In_Progress' as CAPAStatus :
                 currentStatus === 'Pending Verification' ? 'Pending_Verification' as CAPAStatus :
                 currentStatus as CAPAStatus,
      new_status: newStatus,
      action_type: 'status_change',
      action_description: comments || `Status updated from ${currentStatus} to ${dbNewStatus}`,
      performed_by: userId,
      metadata: { comments }
    });

    // Convert database format to app format
    const convertedData: CAPA = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status === 'In Progress' ? 'In_Progress' :
              data.status === 'Pending Verification' ? 'Pending_Verification' : data.status as CAPAStatus,
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
      effectivenessRating: data.effectiveness_rating,
      effectivenessCriteria: data.effectiveness_criteria,
      verificationMethod: data.verification_method,
      verifiedBy: data.verified_by,
      fsma204Compliant: data.fsma204_compliant,
      effectivenessVerified: data.effectiveness_verified,
      sourceId: data.source_id,
      sourceReference: data.source_reference,
      relatedDocuments: data.related_documents || [],
      relatedTraining: data.related_training || []
    };

    return convertedData;
  } catch (error) {
    console.error('Error updating CAPA status:', error);
    throw error;
  }
};
