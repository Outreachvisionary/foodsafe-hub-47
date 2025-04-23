
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus } from '@/types/capa';
import { mapStatusToDb, mapDbStatusToInternal } from './capaStatusMapper';

export const updateCAPAStatus = async (
  capaId: string,
  newStatus: CAPAStatus,
  userId: string,
  comment?: string
): Promise<CAPA | null> => {
  try {
    const { data: capa, error: fetchError } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', capaId)
      .single();

    if (fetchError) throw fetchError;
    if (!capa) throw new Error('CAPA not found');

    const { error: updateError } = await supabase
      .from('capa_actions')
      .update({
        status: mapStatusToDb(newStatus),
        updated_at: new Date().toISOString(),
      })
      .eq('id', capaId);

    if (updateError) throw updateError;

    // Record the activity
    const activityData = {
      capa_id: capaId,
      action_type: 'status_change',
      action_description: `Status updated to ${newStatus}`,
      performed_by: userId,
      old_status: capa.status,
      new_status: mapStatusToDb(newStatus),
      metadata: comment ? { comment } : undefined
    };

    const { error: activityError } = await supabase
      .from('capa_activities')
      .insert(activityData);

    if (activityError) throw activityError;

    // Fetch the updated CAPA
    const { data: updatedCapa, error: refetchError } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', capaId)
      .single();

    if (refetchError) throw refetchError;
    if (!updatedCapa) throw new Error('Failed to fetch updated CAPA');

    return {
      id: updatedCapa.id,
      title: updatedCapa.title,
      description: updatedCapa.description,
      status: mapDbStatusToInternal(updatedCapa.status),
      priority: updatedCapa.priority,
      source: updatedCapa.source,
      dueDate: updatedCapa.due_date,
      createdAt: updatedCapa.created_at,
      lastUpdated: updatedCapa.updated_at,
      rootCause: updatedCapa.root_cause,
      correctiveAction: updatedCapa.corrective_action,
      preventiveAction: updatedCapa.preventive_action,
      assignedTo: updatedCapa.assigned_to,
      createdBy: updatedCapa.created_by,
      department: updatedCapa.department,
      verificationMethod: updatedCapa.verification_method,
      verifiedBy: updatedCapa.verified_by,
      completionDate: updatedCapa.completion_date,
      verificationDate: updatedCapa.verification_date,
      effectivenessRating: updatedCapa.effectiveness_rating,
      effectivenessVerified: updatedCapa.effectiveness_verified,
      isFsma204Compliant: updatedCapa.fsma204_compliant
    };
  } catch (error) {
    console.error('Error updating CAPA status:', error);
    throw error;
  }
};
