
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch all document workflows
 */
export const getDocumentWorkflows = async () => {
  try {
    const { data, error } = await supabase
      .from('document_workflows')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching document workflows:', error);
    throw error;
  }
};

/**
 * Get a specific document workflow by ID
 */
export const getDocumentWorkflowById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('document_workflows')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching document workflow ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new document workflow
 */
export const createDocumentWorkflow = async (workflow: any) => {
  try {
    const { data, error } = await supabase
      .from('document_workflows')
      .insert(workflow)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating document workflow:', error);
    throw error;
  }
};

/**
 * Update an existing document workflow
 */
export const updateDocumentWorkflow = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('document_workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating document workflow ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a document workflow
 */
export const deleteDocumentWorkflow = async (id: string) => {
  try {
    const { error } = await supabase
      .from('document_workflows')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting document workflow ${id}:`, error);
    throw error;
  }
};

/**
 * Create a workflow instance for a document
 */
export const createWorkflowInstance = async (documentId: string, workflowId: string, createdBy: string) => {
  try {
    const instance = {
      document_id: documentId,
      workflow_id: workflowId,
      current_step: 0,
      status: 'in_progress',
      created_by: createdBy
    };
    
    const { data, error } = await supabase
      .from('document_workflow_instances')
      .insert(instance)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating workflow instance:', error);
    throw error;
  }
};

/**
 * Get the current active workflow instance for a document
 */
export const getDocumentWorkflowInstance = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from('document_workflow_instances')
      .select(`
        *,
        workflow:workflow_id (*)
      `)
      .eq('document_id', documentId)
      .eq('status', 'in_progress')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned"
    return data || null;
  } catch (error) {
    console.error(`Error fetching workflow instance for document ${documentId}:`, error);
    throw error;
  }
};

/**
 * Advance the workflow to the next step
 */
export const advanceWorkflow = async (instanceId: string, currentStep: number) => {
  try {
    const { data, error } = await supabase
      .from('document_workflow_instances')
      .update({ current_step: currentStep + 1 })
      .eq('id', instanceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error advancing workflow instance ${instanceId}:`, error);
    throw error;
  }
};

/**
 * Complete a document workflow
 */
export const completeWorkflow = async (instanceId: string) => {
  try {
    const { data, error } = await supabase
      .from('document_workflow_instances')
      .update({ status: 'completed' })
      .eq('id', instanceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error completing workflow instance ${instanceId}:`, error);
    throw error;
  }
};

/**
 * Generate notifications based on document status
 */
export const generateNotifications = (documents: Document[]) => {
  const notifications = [];
  const now = new Date();
  
  for (const doc of documents) {
    // Check for documents pending approval
    if (doc.status === 'Pending Approval') {
      notifications.push({
        id: uuidv4(),
        documentId: doc.id,
        documentTitle: doc.title,
        type: 'approval_request',
        message: `${doc.title} needs your approval`,
        createdAt: new Date().toISOString(),
        isRead: false,
        targetUserIds: doc.approvers || []
      });
    }
    
    // Check for expiring documents
    if (doc.expiry_date) {
      const expiryDate = new Date(doc.expiry_date);
      const daysToExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToExpiry <= 0) {
        notifications.push({
          id: uuidv4(),
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'document_expired',
          message: `${doc.title} has expired`,
          createdAt: new Date().toISOString(),
          isRead: false,
          targetUserIds: ['admin'] // Replace with actual admin user IDs
        });
      } else if (daysToExpiry <= 30) {
        notifications.push({
          id: uuidv4(),
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'expiry_reminder',
          message: `${doc.title} will expire in ${daysToExpiry} days`,
          createdAt: new Date().toISOString(),
          isRead: false,
          targetUserIds: ['admin'] // Replace with actual admin user IDs
        });
      }
    }
  }
  
  return notifications;
};

/**
 * Submit a document for approval
 */
export const submitForApproval = (document: Document) => {
  // Update document status to pending approval
  const updatedDoc = {
    ...document,
    status: 'Pending Approval',
    pending_since: new Date().toISOString()
  };
  
  return updatedDoc;
};

/**
 * Approve a document
 */
export const approveDocument = (document: Document, comment: string) => {
  // Update document status based on the workflow step
  // This is a simplified version; in a real app, you'd check the workflow step
  const updatedDoc = {
    ...document,
    status: 'Approved',
    last_action: `Approved with comment: ${comment}`,
    updated_at: new Date().toISOString()
  };
  
  return updatedDoc;
};

/**
 * Reject a document
 */
export const rejectDocument = (document: Document, reason: string) => {
  // Update document status to rejected
  const updatedDoc = {
    ...document,
    status: 'Draft', // Return to draft status
    rejection_reason: reason,
    last_action: `Rejected: ${reason}`,
    updated_at: new Date().toISOString()
  };
  
  return updatedDoc;
};

// Export all functions as a default object
const documentWorkflowService = {
  getDocumentWorkflows,
  getDocumentWorkflowById,
  createDocumentWorkflow,
  updateDocumentWorkflow,
  deleteDocumentWorkflow,
  createWorkflowInstance,
  getDocumentWorkflowInstance,
  advanceWorkflow,
  completeWorkflow,
  generateNotifications,
  submitForApproval,
  approveDocument,
  rejectDocument
};

export default documentWorkflowService;
