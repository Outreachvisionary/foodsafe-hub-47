
import { CAPA } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';
import { stringToCAPASource } from '@/utils/typeAdapters';
import { CAPAStatus } from '@/types/enums';

export const updateCAPA = async (
  id: string,
  capaData: Partial<CAPA>
): Promise<CAPA | null> => {
  try {
    // Convert string to CAPASource enum if needed
    if (capaData.source && typeof capaData.source === 'string') {
      capaData.source = stringToCAPASource(capaData.source);
    }
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(capaData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      throw error;
    }

    // Make sure we return properly typed data
    const result: CAPA = {
      ...data,
      status: data.status as CAPAStatus,
    };

    return result;
  } catch (error) {
    console.error('Failed to update CAPA:', error);
    return null;
  }
};

export const completeCAPA = async (
  id: string,
  completionDetails: {
    completionNotes: string;
    completedBy: string;
    effectivenessCriteriaMet?: boolean;
  }
): Promise<CAPA | null> => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('capa_actions')
      .update({
        status: 'Completed',
        completion_date: now,
        effectiveness_criteria_met: completionDetails.effectivenessCriteriaMet || false,
        completion_notes: completionDetails.completionNotes,
        completed_by: completionDetails.completedBy,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error completing CAPA:', error);
      throw error;
    }

    // Log the completion activity
    await supabase.from('capa_activities').insert({
      capa_id: id,
      action_type: 'status_change',
      action_description: `CAPA marked as Completed by ${completionDetails.completedBy}`,
      performed_by: completionDetails.completedBy,
      old_status: 'In_Progress',
      new_status: 'Completed',
      performed_at: now
    });

    // Make sure we return properly typed data
    const result: CAPA = {
      ...data,
      status: data.status as CAPAStatus,
    };

    return result;
  } catch (error) {
    console.error('Failed to complete CAPA:', error);
    return null;
  }
};
