
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';

interface DocumentNotificationData {
  document_id: string;
  recipient_name: string; 
  recipient_email: string;
  document_title: string;
  expiry_date: string;
  days_until_expiry: number;
  notification_type: 'expiry_warning' | 'expired';
}

/**
 * Check documents for upcoming expiration and send notifications
 */
export const sendExpiryNotifications = async () => {
  try {
    // Get documents that are expiring soon or already expired
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .lt('expiry_date', thirtyDaysFromNow.toISOString())
      .gt('expiry_date', new Date().toISOString());
    
    if (error) throw error;
    
    if (!documents || documents.length === 0) {
      console.log('No documents expiring soon');
      return [];
    }
    
    console.log(`Found ${documents.length} documents expiring soon`);
    
    // For each document, create a notification record
    const notifications: DocumentNotificationData[] = [];
    
    for (const document of documents) {
      const expiryDate = new Date(document.expiry_date);
      const currentDate = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Get document approvers or owner to notify
      const recipients = document.approvers || [document.created_by];
      
      for (const recipient of recipients) {
        notifications.push({
          document_id: document.id,
          recipient_name: recipient,
          recipient_email: recipient, // In a real implementation, you would get the email from the user profile
          document_title: document.title,
          expiry_date: document.expiry_date,
          days_until_expiry: daysUntilExpiry,
          notification_type: 'expiry_warning'
        });
      }
    }
    
    // In a real implementation, you would insert these notifications into a database table
    // and send emails. For now, we'll just return them.
    console.log(`Created ${notifications.length} notifications`);
    return notifications;
  } catch (error) {
    console.error('Error sending document expiry notifications:', error);
    throw error;
  }
};

/**
 * Get documents that will expire within a specified number of days
 */
export const getDocumentsExpiringWithinDays = async (days: number = 30): Promise<Document[]> => {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .lt('expiry_date', targetDate.toISOString())
      .gt('expiry_date', new Date().toISOString());
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error getting documents expiring within ${days} days:`, error);
    throw error;
  }
};

/**
 * Get expired documents
 */
export const getExpiredDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .lt('expiry_date', new Date().toISOString());
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting expired documents:', error);
    throw error;
  }
};
