
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  expiryDate: string;
}

interface NotificationRequest {
  to: string;
  supplierName: string;
  documents: DocumentInfo[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the request body
    const { to, supplierName, documents }: NotificationRequest = await req.json();

    if (!to || !supplierName || !documents || documents.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: to, supplierName, or documents",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format document list for email
    const documentList = documents.map(doc => {
      const expiryDate = new Date(doc.expiryDate).toLocaleDateString();
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${doc.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${doc.type}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${expiryDate}</td>
        </tr>
      `;
    }).join("");

    // Calculate days until expiry for the first document (for subject line)
    const firstExpiryDate = new Date(documents[0].expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((firstExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create email content
    const subject = `Important: ${documents.length} Document${documents.length > 1 ? 's' : ''} Expiring in ${daysUntilExpiry} days`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid #ff9800;">
          <h1 style="margin-top: 0; color: #e65100;">Document Expiration Notice</h1>
          <p>Dear ${supplierName},</p>
          <p>This is to inform you that the following document(s) will expire in the next ${daysUntilExpiry} days. 
          Please take appropriate action to renew these documents to maintain compliance.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Document Name</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Type</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              ${documentList}
            </tbody>
          </table>
          
          <p>Please upload the renewed documents as soon as possible to avoid compliance issues.</p>
          <p>If you have already renewed these documents, please disregard this message and ensure 
          the updated documents are submitted to our system.</p>
          
          <p>Thank you for your prompt attention to this matter.</p>
          
          <p style="margin-bottom: 0;">Best regards,<br>
          Food Safety Management System</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #6c757d; margin-top: 20px;">
          This is an automated notification. Please do not reply to this email.
        </div>
      </body>
      </html>
    `;

    // Send the email
    const { error } = await supabaseClient.from('email_queue').insert({
      to: to,
      subject: subject,
      html_content: htmlContent,
      priority: 'high',
      status: 'pending'
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notification email queued for ${to}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred during the request",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
