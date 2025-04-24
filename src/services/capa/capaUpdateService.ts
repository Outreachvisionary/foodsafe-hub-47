
import { supabase } from "@/integrations/supabase/client";
import { recordCAPAActivity } from "./capaActivityService";
import { CAPAStatus, DbCAPAStatus } from "@/types/capa";
 
export const updateCAPAStatus = async (
  capaId: string, 
  newStatus: CAPAStatus, 
  userId: string,
  notes?: string
) => {
  try {
    // Map the status if necessary to match the database enum
    let dbStatus: DbCAPAStatus;
    
    switch (newStatus) {
      case 'Open': 
        dbStatus = 'Open';
        break;
      case 'In Progress': 
        dbStatus = 'In Progress';
        break;
      case 'Closed': 
        dbStatus = 'Closed';
        break;
      case 'Overdue': 
        dbStatus = 'Overdue';
        break;
      case 'Pending Verification': 
        dbStatus = 'Pending Verification';
        break;
      default:
        dbStatus = 'Open';
    }
    
    // Get the current status
    const { data: currentCAPA, error: fetchError } = await supabase
      .from('capa_actions')
      .select('status')
      .eq('id', capaId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const oldStatus = currentCAPA?.status;
    
    // Update the CAPA record
    const { data, error } = await supabase
      .from('capa_actions')
      .update({ 
        status: dbStatus,
        updated_at: new Date().toISOString(),
        completion_date: newStatus === 'Closed' ? new Date().toISOString() : undefined 
      })
      .eq('id', capaId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Record the status change activity
    await recordCAPAActivity(
      capaId,
      'status_change',
      `Status changed from ${oldStatus} to ${dbStatus}`,
      userId,
      oldStatus,
      dbStatus,
      { notes }
    );
    
    return data;
  } catch (error) {
    console.error('Error updating CAPA status:', error);
    throw error;
  }
};
