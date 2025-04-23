
import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus } from '@/types/capa';

// Define CAPA activity interface
export interface CAPAActivity {
  id: string;
  capaId: string;
  actionType: string;
  actionDescription: string;
  performedAt: string;
  performedBy: string;
  oldStatus?: CAPAStatus;
  newStatus?: CAPAStatus;
  metadata?: Record<string, any>;
}

// Define DB CAPA Status type - matching the database enum values
type DbCAPAStatus = "Open" | "In Progress" | "Closed" | "Overdue" | "Pending Verification";

// Map internal status to DB status
const mapStatusToDb = (status: string): DbCAPAStatus => {
  switch (status.toLowerCase()) {
    case 'open': return 'Open';
    case 'in progress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'overdue': return 'Overdue';
    case 'pending verification': return 'Pending Verification';
    default: return 'Open'; // Default fallback
  }
};

// Map DB status to internal status
const mapDbStatusToInternal = (dbStatus: DbCAPAStatus): CAPAStatus => {
  switch (dbStatus) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending Verification': return 'Pending Verification';
    default: return dbStatus as CAPAStatus;
  }
};

export const recordCAPAActivity = async (activity: {
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  old_status?: string;
  new_status?: string;
  metadata?: Record<string, any>;
}): Promise<void> => {
  try {
    // Convert status values to DB format if they exist
    const dbActivity = {
      ...activity,
      old_status: activity.old_status ? mapStatusToDb(activity.old_status) : undefined,
      new_status: activity.new_status ? mapStatusToDb(activity.new_status) : undefined,
      // Ensure metadata is properly formatted for database
      metadata: activity.metadata ? JSON.stringify(activity.metadata) : null
    };

    const { error } = await supabase
      .from('capa_activities')
      .insert(dbActivity);

    if (error) throw error;
  } catch (error) {
    console.error('Error recording CAPA activity:', error);
    throw error;
  }
};

export const fetchCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('capa_activities')
      .select('*')
      .eq('capa_id', capaId)
      .order('performed_at', { ascending: false });

    if (error) throw error;

    // Map database results to CAPAActivity interface with proper parsing of JSON
    return (data || []).map(item => ({
      id: item.id,
      capaId: item.capa_id,
      actionType: item.action_type,
      actionDescription: item.action_description,
      performedAt: item.performed_at,
      performedBy: item.performed_by,
      oldStatus: item.old_status ? mapDbStatusToInternal(item.old_status as DbCAPAStatus) : undefined,
      newStatus: item.new_status ? mapDbStatusToInternal(item.new_status as DbCAPAStatus) : undefined,
      metadata: typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata || {}
    }));
  } catch (error) {
    console.error('Error fetching CAPA activities:', error);
    throw error;
  }
};
