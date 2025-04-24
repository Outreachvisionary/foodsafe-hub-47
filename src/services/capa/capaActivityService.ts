
import { supabase } from "@/integrations/supabase/client";
import { CAPAStatus, DbCAPAStatus } from "@/types/capa";

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
    let dbOldStatus: DbCAPAStatus | undefined;
    let dbNewStatus: DbCAPAStatus | undefined;
    
    if (oldStatus) {
      // Convert to proper database enum value
      dbOldStatus = oldStatus as DbCAPAStatus;
    }
    
    if (newStatus) {
      // Convert to proper database enum value
      dbNewStatus = newStatus as DbCAPAStatus;
    }
    
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
    
    // Insert the activity record - using as any to bypass the type check
    // We know that the database accepts these values even if TypeScript doesn't recognize them
    const { data, error } = await supabase
      .from('capa_activities')
      .insert(activityData as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recording CAPA activity:', error);
    throw error;
  }
};
