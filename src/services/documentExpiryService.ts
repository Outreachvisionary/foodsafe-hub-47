import { supabase } from '@/integrations/supabase/client';

// Temporarily commenting out document_notifications table interaction 
// since it seems the table might not exist or have a different structure
// We'll need to update this when we have the proper table structure

// Function to check for documents expiring soon
export const checkExpiringDocuments = async () => {
  try {
    const today = new Date();
    
    // Get documents with expiry dates in the next 30 days
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, expiry_date, custom_notification_days')
      .gte('expiry_date', today.toISOString())
      .lte('expiry_date', new Date(today.setDate(today.getDate() + 30)).toISOString());
    
    if (error) {
      console.error('Error checking for expiring documents:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in checkExpiringDocuments:', error);
    throw error;
  }
};

// Function to create expiry notifications
export const createExpiryNotifications = async (documentId: string, daysUntilExpiry: number) => {
  try {
    // Fetch document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('title, expiry_date, created_by')
      .eq('id', documentId)
      .single();
    
    if (docError) {
      console.error('Error fetching document details:', docError);
      throw docError;
    }
    
    // Create notification message
    const message = `Document "${document.title}" will expire in ${daysUntilExpiry} days (on ${new Date(document.expiry_date).toLocaleDateString()}).`;
    
    // We should handle this differently since document_notifications might not exist
    // or might have a different structure than expected
    // For now, we'll just return the message
    
    return {
      documentId,
      message,
      daysUntilExpiry
    };
    
    /* Commenting out until we confirm the correct table structure
    // Create notification record
    const { data, error } = await supabase
      .from('document_notifications')
      .insert({
        document_id: documentId,
        message,
        notification_type: 'expiry',
        recipient_email: 'document_owner@example.com', // Should be fetched from user records
        recipient_name: 'Document Owner' // Should be fetched from user records
      });
    
    if (error) {
      console.error('Error creating document expiry notification:', error);
      throw error;
    }
    
    return data;
    */
  } catch (error) {
    console.error('Error in createExpiryNotifications:', error);
    throw error;
  }
};

// Function to send email notifications for expiring documents
export const sendDocumentExpiryNotifications = async () => {
  try {
    // Get all documents that are expiring in the next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { data: documents, error } = await supabase
      .from('supplier_documents')
      .select(`
        *,
        suppliers (name, contact_email)
      `)
      .lte('expiry_date', thirtyDaysFromNow.toISOString())
      .gt('expiry_date', new Date().toISOString())
      .eq('status', 'Valid');
    
    if (error) throw error;
    
    if (!documents || documents.length === 0) {
      console.log('No documents expiring in the next 30 days');
      return;
    }
    
    // Group documents by supplier for consolidated emails
    const supplierDocuments: Record<string, any[]> = {};
    
    documents.forEach(doc => {
      const supplierEmail = doc.suppliers?.contact_email;
      if (supplierEmail) {
        if (!supplierDocuments[supplierEmail]) {
          supplierDocuments[supplierEmail] = [];
        }
        supplierDocuments[supplierEmail].push(doc);
      }
    });
    
    // For each supplier, call the email notification edge function
    for (const [email, docs] of Object.entries(supplierDocuments)) {
      const supplierName = docs[0].suppliers?.name || 'Supplier';
      
      // Update document status to "Expiring Soon"
      for (const doc of docs) {
        await supabase
          .from('supplier_documents')
          .update({
            status: 'Expiring Soon',
            updated_at: new Date().toISOString()
          })
          .eq('id', doc.id);
      }
      
      // Call the edge function to send the email notification
      const { data, error: fnError } = await supabase.functions.invoke('document-expiry-notification', {
        body: {
          to: email,
          supplierName: supplierName,
          documents: docs.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            expiryDate: doc.expiry_date
          }))
        }
      });
      
      if (fnError) {
        console.error('Error invoking document-expiry-notification function:', fnError);
        throw fnError;
      }
      
      console.log(`Email notification sent to ${email} for ${docs.length} expiring documents`);
      
      // Record notification in the database
      await supabase
        .from('document_notifications')
        .insert({
          recipient_email: email,
          recipient_name: supplierName,
          subject: 'Document Expiration Notice',
          content: `You have ${docs.length} document(s) expiring in the next 30 days.`,
          sent_at: new Date().toISOString(),
          document_ids: docs.map(doc => doc.id)
        });
    }
    
    return {
      success: true,
      notificationCount: Object.keys(supplierDocuments).length,
      documentCount: documents.length
    };
  } catch (error) {
    console.error('Error sending document expiry notifications:', error);
    throw error;
  }
};

// Function to check for documents that have expired and update their status
export const updateExpiredDocumentStatus = async () => {
  try {
    const today = new Date().toISOString();
    
    // Get all documents that have expired
    const { data: documents, error } = await supabase
      .from('supplier_documents')
      .select('*')
      .lt('expiry_date', today)
      .in('status', ['Valid', 'Expiring Soon']);
    
    if (error) throw error;
    
    if (!documents || documents.length === 0) {
      console.log('No newly expired documents found');
      return { success: true, expiredCount: 0 };
    }
    
    // Update the status of each expired document
    for (const doc of documents) {
      await supabase
        .from('supplier_documents')
        .update({
          status: 'Expired',
          updated_at: today
        })
        .eq('id', doc.id);
    }
    
    return {
      success: true,
      expiredCount: documents.length
    };
  } catch (error) {
    console.error('Error updating expired document status:', error);
    throw error;
  }
};

export default {
  sendDocumentExpiryNotifications,
  updateExpiredDocumentStatus
};
