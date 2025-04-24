
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus } from '@/types/capa';
import { DbCAPAStatus, mapInternalStatusToDb, mapDbStatusToInternal } from './capaStatusMapper';

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
    
    // Insert using the fields that match the database schema
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
    
    // Map database status values to internal application status values
    return data.map(activity => ({
      id: activity.id,
      capa_id: activity.capa_id,
      performed_at: activity.performed_at,
      old_status: activity.old_status ? mapDbStatusToInternal(activity.old_status as DbCAPAStatus) : undefined,
      new_status: activity.new_status ? mapDbStatusToInternal(activity.new_status as DbCAPAStatus) : undefined,
      action_type: activity.action_type,
      action_description: activity.action_description,
      performed_by: activity.performed_by,
      metadata: activity.metadata
    }));
  } catch (error) {
    console.error('Failed to fetch CAPA activities:', error);
    throw error;
  }
};
