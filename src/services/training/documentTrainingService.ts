
import { supabase } from '@/integrations/supabase/client';

export interface DocumentTrainingIntegration {
  id: string;
  document_id: string;
  training_session_id: string;
  trigger_type: 'document_update' | 'document_approval' | 'document_expiry';
  created_at: string;
  created_by: string;
}

export interface DocumentTrainingNotification {
  id: string;
  document_id: string;
  affected_users: string[];
  notification_type: 'training_required' | 'training_assigned' | 'training_overdue';
  message: string;
  created_at: string;
  sent: boolean;
}

export const handleDocumentUpdate = async (documentId: string, updateType: string): Promise<void> => {
  try {
    console.log(`Handling document update: ${documentId}, type: ${updateType}`);
    
    // Find affected users based on document access
    const { data: affectedUsers, error: usersError } = await supabase
      .from('document_access')
      .select('user_id')
      .eq('document_id', documentId);

    if (usersError) throw usersError;

    if (affectedUsers && affectedUsers.length > 0) {
      // Create training records for affected users
      const trainingRecords = affectedUsers
        .filter(user => user.user_id)
        .map(user => ({
          employee_id: user.user_id!,
          employee_name: 'Employee', // Would need to fetch from profiles
          session_id: documentId, // Using document_id as session_id for now
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          status: 'Not Started' as const
        }));

      if (trainingRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('training_records')
          .insert(trainingRecords);

        if (insertError) {
          console.error('Error creating training records:', insertError);
        }
      }
    }
  } catch (error) {
    console.error('Error handling document update:', error);
    throw error;
  }
};

export const getDocumentTrainingNotifications = async (): Promise<DocumentTrainingNotification[]> => {
  try {
    // This would typically query a notifications table
    // For now, return empty array as this is a placeholder
    return [];
  } catch (error) {
    console.error('Error fetching document training notifications:', error);
    return [];
  }
};

export default {
  handleDocumentUpdate,
  getDocumentTrainingNotifications
};
