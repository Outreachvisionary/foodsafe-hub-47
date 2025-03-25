
import { supabase } from '@/integrations/supabase/client';
import { NCActivity } from '@/types/non-conformance';

export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  const { data, error } = await supabase
    .from('nc_activities')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('performed_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching activities for non-conformance ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCActivity[];
};

// Create a log entry that's not related to status change
export const createNCActivity = async (activity: Omit<NCActivity, 'id'>): Promise<NCActivity> => {
  const { data, error } = await supabase
    .from('nc_activities')
    .insert(activity)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating activity log:', error);
    throw error;
  }
  
  return data as NCActivity;
};
