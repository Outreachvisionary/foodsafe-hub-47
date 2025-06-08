
import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { capaStatusToString } from '@/utils/typeAdapters';

/**
 * Creates a new CAPA activity entry
 */
export const createCAPAActivity = async (
  capaId: string,
  actionType: string,
  actionDescription: string,
  performedBy: string,
  oldStatus?: CAPAStatus,
  newStatus?: CAPAStatus,
  metadata?: Record<string, any>
): Promise<CAPAActivity | null> => {
  try {
    const activityData = {
      capa_id: capaId,
      action_type: actionType,
      action_description: actionDescription,
      performed_at: new Date().toISOString(),
      performed_by: performedBy,
      old_status: oldStatus ? capaStatusToString(oldStatus) as any : null,
      new_status: newStatus ? capaStatusToString(newStatus) as any : null,
      metadata: metadata || {}
    };
    
    const { data, error } = await supabase
      .from('capa_activities')
      .insert(activityData)
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA activity:', error);
      throw error;
    }

    return data as CAPAActivity;
  } catch (error) {
    console.error('Error in createCAPAActivity:', error);
    return null;
  }
};

/**
 * Gets all activities for a specific CAPA
 */
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

    return data as CAPAActivity[] || [];
  } catch (error) {
    console.error('Error in getCAPAActivities:', error);
    return [];
  }
};

/**
 * Gets recent activities across all CAPAs
 */
export const getRecentCAPAActivities = async (limit: number = 10): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .order('performed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent CAPA activities:', error);
      throw error;
    }

    return data as CAPAActivity[] || [];
  } catch (error) {
    console.error('Error in getRecentCAPAActivities:', error);
    return [];
  }
};

export default {
  createCAPAActivity,
  getCAPAActivities,
  getRecentCAPAActivities
};
