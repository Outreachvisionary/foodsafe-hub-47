
import { supabase } from '@/integrations/supabase/client';
import { CAPAActivity, CAPAFetchParams } from '@/types/capa';
import { mapDbStatusToInternal } from './capaStatusMapper';

interface ActivityRow {
  id: string;
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_at: string;
  performed_by: string;
  old_status: string;
  new_status: string;
  metadata: any;
}

export const createCAPAActivity = async (
  capaId: string,
  actionType: string,
  description: string,
  userId: string,
  oldStatus?: string,
  newStatus?: string,
  metadata?: Record<string, any>
) => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .insert({
        capa_id: capaId,
        action_type: actionType,
        action_description: description,
        performed_by: userId,
        old_status: oldStatus,
        new_status: newStatus,
        metadata: metadata || {}
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating CAPA activity:', error);
    throw error;
  }
};

export const fetchCAPAActivities = async (params: CAPAFetchParams): Promise<CAPAActivity[]> => {
  try {
    let query = supabase
      .from('capa_activities')
      .select('*');

    if (params.capaId) {
      query = query.eq('capa_id', params.capaId);
    }

    if (params.actionType) {
      query = query.eq('action_type', params.actionType);
    }

    if (params.performedBy) {
      query = query.eq('performed_by', params.performedBy);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    query = query.order('performed_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Map the database rows to the CAPAActivity interface
    const activities = data.map((row: ActivityRow) => ({
      id: row.id,
      capaId: row.capa_id,
      actionType: row.action_type,
      actionDescription: row.action_description,
      performedAt: row.performed_at,
      performedBy: row.performed_by,
      oldStatus: row.old_status ? mapDbStatusToInternal(row.old_status) : undefined,
      newStatus: row.new_status ? mapDbStatusToInternal(row.new_status) : undefined,
      metadata: row.metadata || {}
    }));

    return activities;
  } catch (error) {
    console.error('Error fetching CAPA activities:', error);
    throw error;
  }
};
