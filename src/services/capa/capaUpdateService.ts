
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus } from '@/types/capa';
import { mapInternalStatusToDb } from './capaStatusMapper';
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
      old_status: currentCAPA.status,
      new_status: newStatus,
      action_type: 'status_change',
      action_description: comments || `Status updated from ${currentCAPA.status} to ${dbNewStatus}`,
      performed_by: userId,
      metadata: { comments }
    });

    return data;
  } catch (error) {
    console.error('Error updating CAPA status:', error);
    throw error;
  }
};
