
// Follow a RESTful pattern for the document approval edge function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  // Supabase API URL - env var exported by default.
  Deno.env.get('SUPABASE_URL') ?? '',
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  // Create client with Auth context of the user that called the function.
  { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
)

interface ApprovalRequest {
  documentId: string;
  action: 'approve' | 'reject';
  comment: string;
  userId: string;
  userName: string;
  userRole: string;
}

async function approveDocument(request: ApprovalRequest) {
  // 1. Get the document
  const { data: document, error: docError } = await supabaseClient
    .from('documents')
    .select()
    .eq('id', request.documentId)
    .single();

  if (docError) {
    return { error: `Failed to fetch document: ${docError.message}` };
  }

  // 2. Check if document is in a state that can be approved
  if (document.status !== 'Pending_Approval') {
    return { error: `Document is not pending approval (current status: ${document.status})` };
  }

  // 3. Update document status
  const { error: updateError } = await supabaseClient
    .from('documents')
    .update({ 
      status: 'Approved',
      pending_since: null,
      last_action: `Approved: ${request.comment}`,
      updated_at: new Date().toISOString() 
    })
    .eq('id', request.documentId);

  if (updateError) {
    return { error: `Failed to update document: ${updateError.message}` };
  }

  // 4. Create activity record
  const activityData = {
    document_id: request.documentId,
    action: 'approve',
    user_id: request.userId,
    user_name: request.userName,
    user_role: request.userRole,
    comments: request.comment,
  };

  const { error: activityError } = await supabaseClient
    .from('document_activities')
    .insert([activityData]);

  if (activityError) {
    console.error(`Failed to create activity record: ${activityError.message}`);
    // Don't fail the entire operation for this
  }

  // 5. Send notification to document owner (in a real implementation)
  // ...

  return { success: true, message: 'Document approved successfully' };
}

async function rejectDocument(request: ApprovalRequest) {
  // 1. Get the document
  const { data: document, error: docError } = await supabaseClient
    .from('documents')
    .select()
    .eq('id', request.documentId)
    .single();

  if (docError) {
    return { error: `Failed to fetch document: ${docError.message}` };
  }

  // 2. Check if document is in a state that can be rejected
  if (document.status !== 'Pending_Approval') {
    return { error: `Document is not pending approval (current status: ${document.status})` };
  }

  // 3. Update document status
  const { error: updateError } = await supabaseClient
    .from('documents')
    .update({ 
      status: 'Rejected',
      rejection_reason: request.comment,
      pending_since: null,
      last_action: `Rejected: ${request.comment}`,
      updated_at: new Date().toISOString() 
    })
    .eq('id', request.documentId);

  if (updateError) {
    return { error: `Failed to update document: ${updateError.message}` };
  }

  // 4. Create activity record
  const activityData = {
    document_id: request.documentId,
    action: 'reject',
    user_id: request.userId,
    user_name: request.userName,
    user_role: request.userRole,
    comments: request.comment,
  };

  const { error: activityError } = await supabaseClient
    .from('document_activities')
    .insert([activityData]);

  if (activityError) {
    console.error(`Failed to create activity record: ${activityError.message}`);
    // Don't fail the entire operation for this
  }

  // 5. Send notification to document owner (in a real implementation)
  // ...

  return { success: true, message: 'Document rejected successfully' };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname.split('/').filter(Boolean);
    
    // Simple RESTful API for document approval
    // POST /document-approval - Submit a document approval or rejection
    if (method === 'POST' && path.length === 0) {
      const body: ApprovalRequest = await req.json();
      
      // Validate request
      if (!body.documentId || !body.action || !body.userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Process approval or rejection
      let result;
      if (body.action === 'approve') {
        result = await approveDocument(body);
      } else if (body.action === 'reject') {
        result = await rejectDocument(body);
      } else {
        result = { error: `Invalid action: ${body.action}` };
      }
      
      if (result.error) {
        return new Response(
          JSON.stringify(result),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Not found' }), 
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
