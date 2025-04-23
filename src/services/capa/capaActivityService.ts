
import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity, CAPAStatus, mapStatusToDb } from '@/types/capa';

export const logCAPAActivity = async (
  capaId: string,
  actionType: string,
  actionDescription: string,
  performedBy: string,
  oldStatus?: CAPAStatus,
  newStatus?: CAPAStatus,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const activityData = {
      capa_id: capaId,
      action_type: actionType,
      action_description: actionDescription,
      performed_by: performedBy,
      old_status: oldStatus ? mapStatusToDb(oldStatus) : null,
      new_status: newStatus ? mapStatusToDb(newStatus) : null,
      metadata: metadata || {}
    };

    const { error } = await supabase
      .from('capa_activities')
      .insert(activityData);

    if (error) {
      console.error('Error logging CAPA activity:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to log CAPA activity:', error);
    // Don't re-throw the error to avoid breaking the main flow
  }
};

export const fetchCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });

    if (error) {
      console.error('Error fetching CAPA activities:', error);
      throw error;
    }

    // Map DB columns to CAPAActivity interface
    return (data || []).map(item => ({
      id: item.id,
      capaId: item.capa_id,
      actionType: item.action_type,
      actionDescription: item.action_description,
      performedAt: item.performed_at,
      performedBy: item.performed_by,
      oldStatus: item.old_status ? mapDbStatusToInternal(item.old_status) : undefined,
      newStatus: item.new_status ? mapDbStatusToInternal(item.new_status) : undefined,
      metadata: item.metadata
    }));
  } catch (error) {
    console.error('Error in fetchCAPAActivities:', error);
    return [];
  }
};
