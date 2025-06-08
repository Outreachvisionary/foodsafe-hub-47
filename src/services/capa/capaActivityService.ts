
import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { stringToCAPAStatus } from '@/utils/capaAdapters';

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
    // Convert enum values to database string literals
    const oldStatusStr = oldStatus ? convertStatusToDbString(oldStatus) : null;
    const newStatusStr = newStatus ? convertStatusToDbString(newStatus) : null;
    
    const activityData = {
      capa_id: capaId,
      action_type: actionType,
      action_description: actionDescription,
      performed_at: new Date().toISOString(),
      performed_by: performedBy,
      old_status: oldStatusStr as "Open" | "In Progress" | "Closed" | "Overdue" | "Pending Verification" | null,
      new_status: newStatusStr as "Open" | "In Progress" | "Closed" | "Overdue" | "Pending Verification" | null,
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

    // Convert database response back to typed format
    return {
      ...data,
      old_status: data.old_status ? stringToCAPAStatus(data.old_status) : undefined,
      new_status: data.new_status ? stringToCAPAStatus(data.new_status) : undefined,
      metadata: data.metadata as Record<string, any> || {}
    } as CAPAActivity;
  } catch (error) {
    console.error('Error in createCAPAActivity:', error);
    return null;
  }
};

// Helper function to convert enum to database string
const convertStatusToDbString = (status: CAPAStatus): string => {
  switch (status) {
    case CAPAStatus.Open:
      return 'Open';
    case CAPAStatus.In_Progress:
      return 'In Progress';
    case CAPAStatus.Under_Review:
      return 'Under Review';
    case CAPAStatus.Pending_Verification:
      return 'Pending Verification';
    case CAPAStatus.Closed:
      return 'Closed';
    case CAPAStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Open';
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

    // Convert database response back to typed format
    return (data || []).map(activity => ({
      ...activity,
      old_status: activity.old_status ? stringToCAPAStatus(activity.old_status) : undefined,
      new_status: activity.new_status ? stringToCAPAStatus(activity.new_status) : undefined,
      metadata: activity.metadata as Record<string, any> || {}
    })) as CAPAActivity[];
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

    // Convert database response back to typed format
    return (data || []).map(activity => ({
      ...activity,
      old_status: activity.old_status ? stringToCAPAStatus(activity.old_status) : undefined,
      new_status: activity.new_status ? stringToCAPAStatus(activity.new_status) : undefined,
      metadata: activity.metadata as Record<string, any> || {}
    })) as CAPAActivity[];
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
