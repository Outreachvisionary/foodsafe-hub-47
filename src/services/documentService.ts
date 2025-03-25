
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentVersion, DocumentPreview, DocumentAccess, DocumentWorkflow, DocumentWorkflowInstance } from '@/types/document';
import { toast } from 'sonner';

// Document Versioning Service
export const fetchDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  const { data, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false });
  
  if (error) {
    console.error('Error fetching document versions:', error);
    throw error;
  }
  
  return data as DocumentVersion[];
};

export const createDocumentVersion = async (document: Document, versionDetails: Partial<DocumentVersion>): Promise<DocumentVersion> => {
  try {
    // Create the document version
    const { data, error } = await supabase
      .from('document_versions')
      .insert({
        document_id: document.id,
        file_name: versionDetails.file_name || document.file_name,
        file_path: versionDetails.file_path || '',
        file_size: versionDetails.file_size || document.file_size,
        file_type: versionDetails.file_type || document.file_type,
        created_by: versionDetails.created_by || document.created_by,
        change_summary: versionDetails.change_summary || '',
        storage_path: versionDetails.storage_path || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating document version:', error);
      throw error;
    }

    // Update the document with current version id
    await supabase
      .from('documents')
      .update({ current_version_id: data.id })
      .eq('id', document.id);
      
    return data as DocumentVersion;
  } catch (error) {
    console.error('Error in version creation process:', error);
    throw error;
  }
};

export const revertToVersion = async (document: Document, versionId: string): Promise<Document> => {
  try {
    // 1. Update the document to point to this version
    const { data, error } = await supabase
      .from('documents')
      .update({ current_version_id: versionId })
      .eq('id', document.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error reverting document version:', error);
      throw error;
    }
    
    // 2. Record the revert action in activities
    await supabase
      .from('document_activities')
      .insert({
        document_id: document.id,
        action: 'revert_version',
        user_id: 'current_user', // Should be replaced with actual user ID
        user_name: 'Current User', // Should be replaced with actual user name
        user_role: 'Admin', // Should be replaced with actual user role
        comments: `Reverted to version ${versionId}`
      });
      
    return data as Document;
  } catch (error) {
    console.error('Error in version revert process:', error);
    throw error;
  }
};

// Document Preview Service
export const fetchDocumentPreview = async (documentId: string, previewType = 'thumbnail'): Promise<DocumentPreview | null> => {
  const { data, error } = await supabase
    .from('document_previews')
    .select('*')
    .eq('document_id', documentId)
    .eq('preview_type', previewType)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching document preview:', error);
    throw error;
  }
  
  return data as DocumentPreview | null;
};

export const createDocumentPreview = async (preview: Partial<DocumentPreview>): Promise<DocumentPreview> => {
  const { data, error } = await supabase
    .from('document_previews')
    .insert(preview)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating document preview:', error);
    throw error;
  }
  
  return data as DocumentPreview;
};

// Document Access Control Service
export const fetchDocumentAccess = async (documentId: string): Promise<DocumentAccess[]> => {
  const { data, error } = await supabase
    .from('document_access')
    .select('*')
    .eq('document_id', documentId);
  
  if (error) {
    console.error('Error fetching document access:', error);
    throw error;
  }
  
  return data as DocumentAccess[];
};

export const grantDocumentAccess = async (access: Partial<DocumentAccess>): Promise<DocumentAccess> => {
  const { data, error } = await supabase
    .from('document_access')
    .insert(access)
    .select()
    .single();
  
  if (error) {
    console.error('Error granting document access:', error);
    throw error;
  }
  
  return data as DocumentAccess;
};

export const revokeDocumentAccess = async (accessId: string): Promise<void> => {
  const { error } = await supabase
    .from('document_access')
    .delete()
    .eq('id', accessId);
  
  if (error) {
    console.error('Error revoking document access:', error);
    throw error;
  }
};

// Document Checkout/Checkin Service
export const checkoutDocument = async (documentId: string, userId: string): Promise<Document> => {
  // First check if document is already checked out
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();
    
  if (fetchError) {
    console.error('Error fetching document for checkout:', fetchError);
    throw fetchError;
  }
  
  if (doc.checkout_user_id && doc.checkout_user_id !== userId) {
    throw new Error(`Document is already checked out by another user since ${new Date(doc.checkout_timestamp).toLocaleString()}`);
  }
  
  // Proceed with checkout
  const { data, error } = await supabase
    .from('documents')
    .update({
      checkout_user_id: userId,
      checkout_timestamp: new Date().toISOString(),
      is_locked: true
    })
    .eq('id', documentId)
    .select()
    .single();
  
  if (error) {
    console.error('Error checking out document:', error);
    throw error;
  }
  
  // Record checkout activity
  await supabase
    .from('document_activities')
    .insert({
      document_id: documentId,
      action: 'checkout',
      user_id: userId,
      user_name: 'Current User', // Should be replaced with actual user name
      user_role: 'User' // Should be replaced with actual user role
    });
    
  return data as Document;
};

export const checkinDocument = async (documentId: string, userId: string, createNewVersion = false, versionDetails?: Partial<DocumentVersion>): Promise<Document> => {
  // First check if document is checked out by this user
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();
    
  if (fetchError) {
    console.error('Error fetching document for checkin:', fetchError);
    throw fetchError;
  }
  
  if (!doc.checkout_user_id) {
    throw new Error('Document is not currently checked out');
  }
  
  if (doc.checkout_user_id !== userId) {
    throw new Error('Document is checked out by another user');
  }
  
  // Create new version if requested
  if (createNewVersion && versionDetails) {
    await createDocumentVersion(doc, versionDetails);
  }
  
  // Proceed with checkin
  const { data, error } = await supabase
    .from('documents')
    .update({
      checkout_user_id: null,
      checkout_timestamp: null,
      is_locked: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', documentId)
    .select()
    .single();
  
  if (error) {
    console.error('Error checking in document:', error);
    throw error;
  }
  
  // Record checkin activity
  await supabase
    .from('document_activities')
    .insert({
      document_id: documentId,
      action: 'checkin',
      user_id: userId,
      user_name: 'Current User', // Should be replaced with actual user name
      user_role: 'User', // Should be replaced with actual user role
      comments: createNewVersion ? 'Checked in with new version' : 'Checked in'
    });
    
  return data as Document;
};

// Document Workflow Service
export const fetchWorkflows = async (): Promise<DocumentWorkflow[]> => {
  const { data, error } = await supabase
    .from('document_workflows')
    .select('*');
  
  if (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
  
  // Parse JSON steps
  const workflows = data.map(workflow => ({
    ...workflow,
    steps: typeof workflow.steps === 'string' ? JSON.parse(workflow.steps) : workflow.steps
  }));
  
  return workflows as DocumentWorkflow[];
};

export const createWorkflow = async (workflow: Partial<DocumentWorkflow>): Promise<DocumentWorkflow> => {
  // Ensure steps is a JSON string
  const workflowToInsert = {
    ...workflow,
    steps: JSON.stringify(workflow.steps)
  };
  
  const { data, error } = await supabase
    .from('document_workflows')
    .insert(workflowToInsert)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
  
  // Parse JSON steps for return value
  return {
    ...data,
    steps: typeof data.steps === 'string' ? JSON.parse(data.steps) : data.steps
  } as DocumentWorkflow;
};

export const startWorkflow = async (documentId: string, workflowId: string, userId: string): Promise<DocumentWorkflowInstance> => {
  // Create workflow instance
  const { data, error } = await supabase
    .from('document_workflow_instances')
    .insert({
      document_id: documentId,
      workflow_id: workflowId,
      created_by: userId,
      current_step: 0,
      status: 'in_progress'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error starting workflow:', error);
    throw error;
  }
  
  // Update document status
  await supabase
    .from('documents')
    .update({
      status: 'Pending Approval',
      workflow_status: 'in_progress'
    })
    .eq('id', documentId);
    
  // Record activity
  await supabase
    .from('document_activities')
    .insert({
      document_id: documentId,
      action: 'submit_for_approval',
      user_id: userId,
      user_name: 'Current User', // Should be replaced with actual user name
      user_role: 'User', // Should be replaced with actual user role
      comments: `Started workflow ${workflowId}`
    });
    
  return data as DocumentWorkflowInstance;
};

export const advanceWorkflow = async (
  instanceId: string, 
  documentId: string,
  approved: boolean, 
  userId: string,
  comments?: string
): Promise<DocumentWorkflowInstance> => {
  try {
    // 1. Get the current workflow instance
    const { data: instance, error: instanceError } = await supabase
      .from('document_workflow_instances')
      .select('*, document_workflows!inner(*)')
      .eq('id', instanceId)
      .single();
      
    if (instanceError) {
      console.error('Error fetching workflow instance:', instanceError);
      throw instanceError;
    }
    
    // 2. Get the workflow details
    const workflow = instance.document_workflows;
    const steps = typeof workflow.steps === 'string' ? JSON.parse(workflow.steps) : workflow.steps;
    
    // 3. Determine the next step based on approval
    let newStatus = instance.status;
    let newStep = instance.current_step;
    let documentStatus = 'Pending Approval';
    
    if (approved) {
      // Move to next step
      if (newStep < steps.length - 1) {
        newStep += 1;
      } else {
        // This was the final step
        newStatus = 'completed';
        documentStatus = 'Approved';
      }
    } else {
      // Rejected
      newStatus = 'rejected';
      documentStatus = 'Draft';
    }
    
    // 4. Update the workflow instance
    const { data: updatedInstance, error: updateError } = await supabase
      .from('document_workflow_instances')
      .update({
        current_step: newStep,
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating workflow instance:', updateError);
      throw updateError;
    }
    
    // 5. Update the document status
    await supabase
      .from('documents')
      .update({
        status: documentStatus,
        workflow_status: newStatus,
        rejection_reason: approved ? null : comments
      })
      .eq('id', documentId);
      
    // 6. Record activity
    await supabase
      .from('document_activities')
      .insert({
        document_id: documentId,
        action: approved ? 'approve' : 'reject',
        user_id: userId,
        user_name: 'Current User', // Should be replaced with actual user name
        user_role: 'Approver', // Should be replaced with actual user role
        comments: comments || (approved ? 'Approved' : 'Rejected')
      });
      
    return updatedInstance as DocumentWorkflowInstance;
    
  } catch (error) {
    console.error('Error advancing workflow:', error);
    throw error;
  }
};

export const fetchWorkflowInstance = async (documentId: string): Promise<DocumentWorkflowInstance | null> => {
  const { data, error } = await supabase
    .from('document_workflow_instances')
    .select('*')
    .eq('document_id', documentId)
    .eq('status', 'in_progress')
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching workflow instance:', error);
    throw error;
  }
  
  return data as DocumentWorkflowInstance | null;
};

// Utility functions for working with document storage
export const getDocumentStoragePath = (document: Document, version?: number): string => {
  const versionSuffix = version ? `_v${version}` : '';
  return `documents/${document.id}/${document.file_name}${versionSuffix}`;
};

export const uploadDocumentToStorage = async (file: File, document: Document, version?: number): Promise<string> => {
  try {
    const storagePath = getDocumentStoragePath(document, version);
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('Error uploading document to storage:', error);
      throw error;
    }
    
    return data.path;
  } catch (error) {
    console.error('Error in document upload process:', error);
    throw error;
  }
};

export const getDocumentDownloadUrl = async (storagePath: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry
      
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting document download URL:', error);
    throw error;
  }
};

// Build on top of existing document services
export const enhancedDocumentService = {
  // Version management
  fetchVersions: fetchDocumentVersions,
  createVersion: createDocumentVersion,
  revertToVersion,
  
  // Document access
  fetchAccess: fetchDocumentAccess,
  grantAccess: grantDocumentAccess,
  revokeAccess: revokeDocumentAccess,
  
  // Document preview
  fetchPreview: fetchDocumentPreview,
  createPreview: createDocumentPreview,
  
  // Checkout/checkin
  checkout: checkoutDocument,
  checkin: checkinDocument,
  
  // Workflow
  fetchWorkflows,
  createWorkflow,
  startWorkflow,
  advanceWorkflow,
  fetchWorkflowInstance,
  
  // Storage
  uploadToStorage: uploadDocumentToStorage,
  getDownloadUrl: getDocumentDownloadUrl,
  getStoragePath: getDocumentStoragePath
};

export default enhancedDocumentService;
