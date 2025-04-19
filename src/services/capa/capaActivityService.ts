
import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity, CAPAStatus } from '@/types/capa';
import { mapStatusToDb, DbCAPAStatus } from './capaStatusService';

// Table name used for CAPA activities
const TABLE_NAME = 'capa_activities';

export const logCAPAActivity = async (
  capaId: string,
  actionType: string,
  actionDescription: string,
  performedBy: string,
  oldStatus?: CAPAStatus,
  newStatus?: CAPAStatus,
  metadata?: Record<string, any>
): Promise<CAPAActivity> => {
  try {
    // Format the data for Supabase
    const activityData = {
      capa_id: capaId,
      action_type: actionType,
      action_description: actionDescription,
      performed_by: performedBy,
      old_status: oldStatus ? mapStatusToDb(oldStatus) : undefined,
      new_status: newStatus ? mapStatusToDb(newStatus) : undefined,
      metadata: metadata ? JSON.stringify(metadata) : null
    };

    // Use insert with typecasting to handle the DB format expectations
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(activityData as any)
      .select()
      .single();

    if (error) throw error;

    // Parse metadata from JSON string to object if it exists
    const parsedMetadata = data.metadata ? 
      (typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata) : 
      undefined;

    return {
      id: data.id,
      capaId: data.capa_id,
      actionType: data.action_type,
      actionDescription: data.action_description,
      performedBy: data.performed_by,
      performedAt: data.performed_at,
      oldStatus: data.old_status as CAPAStatus,
      newStatus: data.new_status as CAPAStatus,
      metadata: parsedMetadata
    };
  } catch (error) {
    console.error('Error logging CAPA activity:', error);
    throw error;
  }
};

export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => {
      // Parse metadata from JSON string to object if it exists
      const parsedMetadata = item.metadata ? 
        (typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata) : 
        undefined;

      return {
        id: item.id,
        capaId: item.capa_id,
        actionType: item.action_type,
        actionDescription: item.action_description,
        performedBy: item.performed_by,
        performedAt: item.performed_at,
        oldStatus: item.old_status as CAPAStatus,
        newStatus: item.new_status as CAPAStatus,
        metadata: parsedMetadata
      };
    });
  } catch (error) {
    console.error('Error fetching CAPA activities:', error);
    throw error;
  }
};
