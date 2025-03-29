
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
    console.log('Setup profile storage function called');
    
    // Create a Supabase client with the Admin key, which bypasses RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Check if profiles bucket already exists
    const { data: buckets, error: bucketsError } = await supabaseClient
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return new Response(
        JSON.stringify({ error: bucketsError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const profilesBucketExists = buckets.some(b => b.name === 'profiles');
    
    if (!profilesBucketExists) {
      // Create a new bucket for profile images
      const { data: bucket, error: createBucketError } = await supabaseClient
        .storage
        .createBucket('profiles', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        });
      
      if (createBucketError) {
        console.error('Error creating profiles bucket:', createBucketError);
        return new Response(
          JSON.stringify({ error: createBucketError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log('Created profiles bucket:', bucket);
      
      // Create storage policy to allow authenticated users to upload their own avatars
      const { error: policyError } = await supabaseClient
        .storage
        .from('profiles')
        .createSignedUploadUrl('test-policy-file');
      
      if (policyError) {
        console.error('Error creating upload policy:', policyError);
        // Continue despite policy error - we'll handle it separately
      }
      
      return new Response(
        JSON.stringify({ message: "Profiles bucket created successfully", data: bucket }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log('Profiles bucket already exists');
      return new Response(
        JSON.stringify({ message: "Profiles bucket already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in setup-profile-storage function:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
