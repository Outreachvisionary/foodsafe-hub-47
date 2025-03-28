
import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity } from '@/types/capa';

/**
 * Log a CAPA activity
 */
export const logCAPAActivity = async (activity: Omit<CAPAActivity, 'id' | 'performedAt'>): Promise<CAPAActivity> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .insert({
        capa_id: activity.capaId,
        action_type: activity.actionType,
        action_description: activity.actionDescription,
        performed_by: activity.performedBy,
        old_status: activity.oldStatus,
        new_status: activity.newStatus,
        metadata: activity.metadata || {}
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      capaId: data.capa_id,
      actionType: data.action_type,
      actionDescription: data.action_description,
      performedBy: data.performed_by,
      performedAt: data.performed_at,
      oldStatus: data.old_status,
      newStatus: data.new_status,
      metadata: data.metadata
    };
  } catch (err) {
    console.error('Error logging CAPA activity:', err);
    throw err;
  }
};

/**
 * Get CAPA activities for a specific CAPA
 */
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      capaId: item.capa_id,
      actionType: item.action_type,
      actionDescription: item.action_description,
      performedBy: item.performed_by,
      performedAt: item.performed_at,
      oldStatus: item.old_status,
      newStatus: item.new_status,
      metadata: item.metadata
    }));
  } catch (err) {
    console.error('Error fetching CAPA activities:', err);
    throw err;
  }
};
