
import { CAPA } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';
import { stringToCAPASource, stringToCAPAStatus, stringToCAPAPriority, stringToEffectivenessRating, capaStatusToString } from '@/utils/capaAdapters';
import { CAPAStatus } from '@/types/enums';

export const updateCAPA = async (
  id: string,
  capaData: Partial<CAPA>
): Promise<CAPA | null> => {
  try {
    // Convert enum values to strings for database
    const dbData: any = { ...capaData };
    
    if (capaData.status) {
      dbData.status = capaStatusToString(capaData.status);
    }
    if (capaData.priority) {
      dbData.priority = capaData.priority.toString();
    }
    if (capaData.source) {
      dbData.source = capaData.source.toString();
    }
    if (capaData.effectiveness_rating) {
      dbData.effectiveness_rating = capaData.effectiveness_rating.toString();
    }
    
    const { data, error } = await supabase
      .from('capa_actions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      throw error;
    }

    // Convert back to typed result
    const result: CAPA = {
      ...data,
      status: stringToCAPAStatus(data.status),
      priority: stringToCAPAPriority(data.priority),
      source: stringToCAPASource(data.source),
      effectiveness_rating: data.effectiveness_rating ? stringToEffectivenessRating(data.effectiveness_rating) : undefined,
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
        status: 'Closed', // Use database string value
        completion_date: now,
        effectiveness_verified: completionDetails.effectivenessCriteriaMet || false,
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
      old_status: 'In Progress',
      new_status: 'Closed',
      performed_at: now
    });

    // Convert back to typed result
    const result: CAPA = {
      ...data,
      status: stringToCAPAStatus(data.status),
      priority: stringToCAPAPriority(data.priority),
      source: stringToCAPASource(data.source),
      effectiveness_rating: data.effectiveness_rating ? stringToEffectivenessRating(data.effectiveness_rating) : undefined,
    };

    return result;
  } catch (error) {
    console.error('Failed to complete CAPA:', error);
    return null;
  }
};
