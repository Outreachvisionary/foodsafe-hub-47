
import { supabase } from '@/integrations/supabase/client';
import { NCNotification } from '@/types/non-conformance';

export const fetchNCNotifications = async (nonConformanceId: string): Promise<NCNotification[]> => {
  const { data, error } = await supabase
    .from('nc_notifications')
    .select('*')
    .eq('non_conformance_id', nonConformanceId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching notifications for non-conformance ${nonConformanceId}:`, error);
    throw error;
  }
  
  return data as NCNotification[];
};

export const createNCNotification = async (notification: Omit<NCNotification, 'id' | 'is_read' | 'created_at'>): Promise<NCNotification> => {
  const { data, error } = await supabase
    .from('nc_notifications')
    .insert({
      ...notification,
      is_read: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
  
  return data as NCNotification;
};

export const markNCNotificationAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('nc_notifications')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) {
    console.error(`Error marking notification as read:`, error);
    throw error;
  }
};
