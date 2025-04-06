
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define the CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    console.log("Starting recall schedule processing...");

    // Get current date
    const now = new Date();
    
    // Find scheduled recalls that are due
    const { data: dueSchedules, error: schedulesError } = await supabaseClient
      .from("recall_schedules")
      .select("*")
      .lte("next_execution_at", now.toISOString())
      .eq("status", "active");

    if (schedulesError) {
      console.error("Error fetching due schedules:", schedulesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch due schedules" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${dueSchedules.length} due recall schedules`);

    // Process each due schedule
    const results = [];
    for (const schedule of dueSchedules) {
      console.log(`Processing schedule: ${schedule.title}`);
      
      try {
        // Create a new recall based on the schedule
        const { data: newRecall, error: recallError } = await supabaseClient
          .from("recalls")
          .insert({
            title: `${schedule.title} (${now.toLocaleDateString()})`,
            description: schedule.description,
            recall_type: schedule.recall_type,
            status: "Scheduled",
            initiated_by: "System (Scheduled)",
            recall_reason: `Automatically initiated from schedule: ${schedule.title}`,
          })
          .select()
          .single();

        if (recallError) {
          console.error(`Error creating recall for schedule ${schedule.id}:`, recallError);
          results.push({
            scheduleId: schedule.id,
            success: false,
            error: recallError.message
          });
          continue;
        }

        console.log(`Created new recall: ${newRecall.id}`);

        // Update the schedule's last executed date
        const { error: updateError } = await supabaseClient
          .from("recall_schedules")
          .update({
            last_executed_at: now.toISOString(),
          })
          .eq("id", schedule.id);

        if (updateError) {
          console.error(`Error updating schedule ${schedule.id}:`, updateError);
        }

        // If this is a recurring schedule, it will automatically calculate the next execution date
        // thanks to the trigger we created in the database
        
        // Notify assigned users if any
        if (schedule.assigned_users && schedule.assigned_users.length > 0) {
          // In a real implementation, you would send emails to the assigned users
          console.log(`Would notify users: ${schedule.assigned_users.join(", ")}`);
        }

        results.push({
          scheduleId: schedule.id,
          success: true,
          recallId: newRecall.id
        });
      } catch (processError) {
        console.error(`Error processing schedule ${schedule.id}:`, processError);
        results.push({
          scheduleId: schedule.id,
          success: false,
          error: processError.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${dueSchedules.length} recall schedules`,
        results 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in recall-schedule-processor function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
