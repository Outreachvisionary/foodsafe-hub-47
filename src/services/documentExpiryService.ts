
import { supabase } from '@/integrations/supabase/client';

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
      
      // Here you would call your edge function to send emails
      // This is a placeholder for the actual email sending logic
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

export default {
  sendDocumentExpiryNotifications
};
