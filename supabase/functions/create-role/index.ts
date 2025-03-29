
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
    console.log('Create role function called');
    
    // Create a Supabase client with the Admin key, which bypasses RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Parse the request body
    const body = await req.json();
    const { name, description, level, permissions } = body;

    console.log('Request body:', body);

    if (!name) {
      console.error('Role name is required');
      return new Response(
        JSON.stringify({ error: "Role name is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Check if the role already exists
    const { data: existingRole, error: checkError } = await supabaseClient
      .from('roles')
      .select('*')
      .eq('name', name)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing role:', checkError);
      return new Response(
        JSON.stringify({ error: checkError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // If the role already exists, return it
    if (existingRole) {
      console.log('Role already exists, returning existing role:', existingRole);
      return new Response(
        JSON.stringify(existingRole),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the role - using direct table access with service role key bypasses RLS
    const { data: role, error } = await supabaseClient
      .from('roles')
      .insert({
        name,
        description: description || '',
        level: level || 'organization',
        permissions: permissions || {}
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating role:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log('Role created successfully:', role);
    return new Response(
      JSON.stringify(role),
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
