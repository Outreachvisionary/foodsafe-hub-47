
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define the CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  recallId: string;
  subject: string;
  message: string;
  recipientType?: string;
  recipientEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context from the request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get the request data
    const data: NotificationRequest = await req.json();
    const { recallId, subject, message, recipientType, recipientEmail } = data;

    if (!recallId || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get user profile to get their name for the notification
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }

    const userName = profile?.full_name || user.email || "System";

    // If it's a bulk notification, get all supply chain partners
    if (!recipientType && !recipientEmail) {
      // Get supply chain partners
      const { data: partners, error: partnersError } = await supabaseClient
        .from("supply_chain_partners")
        .select("*")
        .eq("status", "active");

      if (partnersError) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch supply chain partners" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Create notifications for each partner
      const notifications = partners.map(partner => ({
        recall_id: recallId,
        recipient_type: partner.partner_type,
        recipient_id: partner.id,
        recipient_email: partner.contact_email,
        subject,
        message,
        status: "Pending",
        created_by: userName,
      }));

      // Insert the notifications in bulk
      const { data: insertedNotifications, error: insertError } = await supabaseClient
        .from("traceability_notifications")
        .insert(notifications)
        .select();

      if (insertError) {
        return new Response(
          JSON.stringify({ error: "Failed to create notifications" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // In a production environment, you would now send actual emails or other notifications
      // Simulate sending by updating the status after a short delay
      setTimeout(async () => {
        for (const notification of insertedNotifications) {
          await supabaseClient
            .from("traceability_notifications")
            .update({ 
              status: "Sent",
              sent_at: new Date().toISOString()
            })
            .eq("id", notification.id);
        }
      }, 2000);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Sent ${insertedNotifications.length} notifications to supply chain partners`,
          notifications: insertedNotifications
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      // Single notification
      const notification = {
        recall_id: recallId,
        recipient_type: recipientType || "Other",
        recipient_email: recipientEmail,
        subject,
        message,
        status: "Pending",
        created_by: userName,
      };

      // Insert the notification
      const { data: insertedNotification, error: insertError } = await supabaseClient
        .from("traceability_notifications")
        .insert(notification)
        .select()
        .single();

      if (insertError) {
        return new Response(
          JSON.stringify({ error: "Failed to create notification" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // In a production environment, you would now send an actual email or other notification
      // Simulate sending by updating the status after a short delay
      setTimeout(async () => {
        await supabaseClient
          .from("traceability_notifications")
          .update({ 
            status: "Sent",
            sent_at: new Date().toISOString()
          })
          .eq("id", insertedNotification.id);
      }, 2000);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Notification created successfully",
          notification: insertedNotification
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error) {
    console.error("Error in traceability-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
