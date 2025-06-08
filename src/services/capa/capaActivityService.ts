
import { CAPAActivity } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { stringToCAPAStatus } from '@/utils/typeAdapters';
import { supabase } from '@/integrations/supabase/client';

// Function to record CAPA activity
export const recordCAPAActivity = async (activityData: {
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  old_status?: string;
  new_status?: string;
  metadata?: Record<string, any>;
}) => {
  try {
    const activity = {
      capa_id: activityData.capa_id,
      action_type: activityData.action_type,
      action_description: activityData.action_description,
      performed_at: new Date().toISOString(),
      performed_by: activityData.performed_by,
      old_status: activityData.old_status ? stringToCAPAStatus(activityData.old_status) : undefined,
      new_status: activityData.new_status ? stringToCAPAStatus(activityData.new_status) : undefined,
      metadata: activityData.metadata
    };

    const { data, error } = await supabase
      .from('capa_activities')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      old_status: data.old_status ? stringToCAPAStatus(data.old_status) : undefined,
      new_status: data.new_status ? stringToCAPAStatus(data.new_status) : undefined,
    } as CAPAActivity;
  } catch (error) {
    console.error('Error recording CAPA activity:', error);
    throw error;
  }
};

// Function to get CAPA activities
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(activity => ({
      ...activity,
      old_status: activity.old_status ? stringToCAPAStatus(activity.old_status) : undefined,
      new_status: activity.new_status ? stringToCAPAStatus(activity.new_status) : undefined,
    })) as CAPAActivity[];
  } catch (error) {
    console.error('Error fetching CAPA activities:', error);
    return [];
  }
};
