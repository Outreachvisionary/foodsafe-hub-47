
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

Deno.serve(async (req) => {
  // Prevent unauthorized access - only allow scheduled invocations
  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ') || !authHeader.includes(supabaseServiceKey)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get documents expiring in the next 30 days
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
      return new Response(
        JSON.stringify({ message: 'No documents expiring in the next 30 days' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
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
    
    // Send emails and update document status
    const emailResults = [];
    
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
      
      // Format document list for email
      const documentsList = docs.map(doc => {
        const expiryDate = new Date(doc.expiry_date).toLocaleDateString();
        const daysUntilExpiry = Math.ceil((new Date(doc.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${doc.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${doc.type}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${expiryDate}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${daysUntilExpiry} days</td>
          </tr>
        `;
      }).join('');
      
      // Send email using Resend
      const emailResult = await resend.emails.send({
        from: 'Food Safety Management System <notifications@foodsafetyapp.com>',
        to: [email],
        subject: `Document Expiry Notice - ${supplierName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Document Expiry Notice</h2>
            <p>Dear ${supplierName},</p>
            <p>This is an automated notification to inform you that the following documents are expiring within the next 30 days:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Document Name</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Type</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Expiry Date</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Days Remaining</th>
                </tr>
              </thead>
              <tbody>
                ${documentsList}
              </tbody>
            </table>
            
            <p style="margin-top: 20px;">Please update these documents before they expire to maintain compliance with our supplier requirements.</p>
            
            <p>Thank you,<br>Food Safety Team</p>
          </div>
        `,
      });
      
      emailResults.push(emailResult);
      
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
    
    return new Response(
      JSON.stringify({
        success: true,
        notificationCount: Object.keys(supplierDocuments).length,
        documentCount: documents.length,
        emailResults
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending document expiry notifications:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
