
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus } from '@/types/capa';
import { mapInternalStatusToDb } from './capaStatusMapper';

export interface CAPAActivity {
  id?: string;
  capa_id: string;
  performed_at?: string;
  old_status?: CAPAStatus;
  new_status?: CAPAStatus;
  action_type: string;
  action_description: string;
  performed_by: string;
  metadata?: Record<string, any>;
}

export const recordCAPAActivity = async (activity: CAPAActivity): Promise<void> => {
  try {
    // Map statuses to database format
    const oldStatus = activity.old_status ? mapInternalStatusToDb(activity.old_status) : undefined;
    const newStatus = activity.new_status ? mapInternalStatusToDb(activity.new_status) : undefined;
    
    const { error } = await supabase
      .from('capa_activities')
      .insert({
        capa_id: activity.capa_id,
        old_status: oldStatus,
        new_status: newStatus,
        action_type: activity.action_type,
        action_description: activity.action_description,
        performed_by: activity.performed_by,
        performed_at: new Date().toISOString(),
        metadata: activity.metadata
      });

    if (error) throw new Error(`Error recording CAPA activity: ${error.message}`);
  } catch (error) {
    console.error('Failed to record CAPA activity:', error);
    throw error;
  }
};

export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });

    if (error) throw new Error(`Error fetching CAPA activities: ${error.message}`);
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch CAPA activities:', error);
    throw error;
  }
};
