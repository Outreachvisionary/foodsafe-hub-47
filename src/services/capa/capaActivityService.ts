
import { supabase } from "@/integrations/supabase/client";
import { mapStatusToDb } from "@/services/capa/capaStatusMapper";

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
    // Convert status strings to database enum values if provided
    const dbOldStatus = oldStatus ? mapStatusToDb(oldStatus) : undefined;
    const dbNewStatus = newStatus ? mapStatusToDb(newStatus) : undefined;
    
    const activityData = {
      capa_id: capaId,
      action_type: actionType,
      action_description: actionDescription,
      performed_by: performedBy,
      performed_at: new Date().toISOString(),
      old_status: dbOldStatus,
      new_status: dbNewStatus,
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
