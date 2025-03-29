
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key, which bypasses RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Parse the request body
    const body = await req.json();
    const { 
      userId, 
      roleId, 
      assignedBy, 
      organizationId, 
      facilityId, 
      departmentId 
    } = body;

    if (!userId || !roleId) {
      return new Response(
        JSON.stringify({ error: "User ID and Role ID are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check if this assignment already exists
    const { data: existingAssignments, error: checkError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', roleId);

    if (checkError) {
      console.error("Error checking existing role assignment:", checkError);
      return new Response(
        JSON.stringify({ error: checkError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // If the assignment already exists, return success
    if (existingAssignments && existingAssignments.length > 0) {
      return new Response(
        JSON.stringify({ success: true, message: "Role already assigned" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the user role assignment - using direct table access with service role key bypasses RLS
    const { data: userRole, error } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
        assigned_by: assignedBy,
        organization_id: organizationId || null,
        facility_id: facilityId || null,
        department_id: departmentId || null
      })
      .select()
      .single();

    if (error) {
      console.error("Error assigning role to user:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: userRole }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
