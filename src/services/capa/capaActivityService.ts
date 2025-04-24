
import { supabase } from "@/integrations/supabase/client";

export const recordCAPAActivity = async (
  capaId: string,
  actionType: string,
  actionDescription: string,
  performedBy: string,
  oldStatus?: string, 
  newStatus?: string,
  metadata?: Record<string, any>
) => {
  try {
    const activityData = {
      capa_id: capaId,
      action_type: actionType,
      action_description: actionDescription,
      performed_by: performedBy,
      performed_at: new Date().toISOString(),
      old_status: oldStatus,
      new_status: newStatus,
      metadata: metadata || {}
    };
    
    // Insert the activity record
    const { data, error } = await supabase
      .from('capa_activities')
      .insert(activityData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recording CAPA activity:', error);
    throw error;
  }
};
