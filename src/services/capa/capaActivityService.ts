
import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity, CAPAStatus } from '@/types/capa';

interface RecordCAPAActivityParams {
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  old_status?: CAPAStatus;
  new_status?: CAPAStatus;
  metadata?: Record<string, any>;
}

export const recordCAPAActivity = async (params: RecordCAPAActivityParams): Promise<void> => {
  try {
    const {
      capa_id,
      action_type,
      action_description,
      performed_by,
      old_status,
      new_status,
      metadata = {}
    } = params;
    
    // Create payload that matches the database schema
    const payload = {
      capa_id,
      action_type,
      action_description,
      performed_by,
      old_status,
      new_status,
      metadata
    };
    
    const { error } = await supabase
      .from('capa_activities')
      .insert(payload);
    
    if (error) {
      console.error('Error recording CAPA activity:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in recordCAPAActivity:', error);
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
    
    if (error) {
      console.error('Error fetching CAPA activities:', error);
      throw error;
    }
    
    // Transform database records to application format with proper typing
    const activities: CAPAActivity[] = data.map(activity => ({
      id: activity.id,
      capa_id: activity.capa_id,
      performed_at: activity.performed_at,
      old_status: activity.old_status as CAPAStatus,
      new_status: activity.new_status as CAPAStatus,
      action_type: activity.action_type,
      action_description: activity.action_description,
      performed_by: activity.performed_by,
      metadata: activity.metadata || {}
    }));
    
    return activities;
  } catch (error) {
    console.error('Error in getCAPAActivities:', error);
    throw error;
  }
};
