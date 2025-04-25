import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity, CAPAStatus } from '@/types/capa';
import { ensureRecord } from '@/utils/jsonUtils';
import { mapInternalStatusToDb, mapDbStatusToInternal } from './capaStatusMapper';

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
    
    const payload: any = {
      action_type,
      action_description,
      performed_by,
      old_status: old_status ? mapInternalStatusToDb(old_status) : null,
      new_status: new_status ? mapInternalStatusToDb(new_status) : null,
      metadata,
      capa_id
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
    
    const activities: CAPAActivity[] = data.map(activity => ({
      id: activity.id,
      capa_id: activity.capa_id,
      performed_at: activity.performed_at,
      old_status: activity.old_status ? mapDbStatusToInternal(activity.old_status as DbCAPAStatus) : undefined,
      new_status: activity.new_status ? mapDbStatusToInternal(activity.new_status as DbCAPAStatus) : undefined,
      action_type: activity.action_type,
      action_description: activity.action_description,
      performed_by: activity.performed_by,
      metadata: ensureRecord(activity.metadata)
    }));
    
    return activities;
  } catch (error) {
    console.error('Error in getCAPAActivities:', error);
    throw error;
  }
};
