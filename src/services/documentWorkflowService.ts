import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentStatus } from '@/types/document';

// Since we need to fix a comparison that appears incorrect, 
// Let's add a function to map between workflows and document statuses
export const mapWorkflowStatusToDocumentStatus = (status: string): DocumentStatus => {
  switch (status) {
    case 'pending_approval':
      return 'Pending Approval';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'draft':
      return 'Draft';
    case 'published':
      return 'Published';
    case 'archived':
      return 'Archived';
    case 'expired':
      return 'Expired';
    case 'pending_review':
      return 'Pending Review';
    case 'active':
      return 'Active';
    default:
      return 'Draft';
  }
};

// And the reverse mapping function
export const mapDocumentStatusToWorkflow = (status: DocumentStatus): string => {
  switch (status) {
    case 'Pending Approval':
      return 'pending_approval';
    case 'Approved':
      return 'approved';
    case 'Rejected':
      return 'rejected';
    case 'Draft':
      return 'draft';
    case 'Published':
      return 'published';
    case 'Archived':
      return 'archived';
    case 'Expired':
      return 'expired';
    case 'Pending Review':
      return 'pending_review';
    case 'Active':
      return 'active';
    default:
      return 'draft';
  }
};

/**
 * Submit a document for approval
 * @param document Document to submit
 * @returns Updated document with pending status
 */
const submitForApproval = (document: Document) => {
  const now = new Date().toISOString();
  
  return {
    ...document,
    status: 'Pending_Approval',
    pending_since: now,
    updated_at: now,
    last_action: 'Submitted for approval'
  };
};

/**
 * Approve a document
 * @param document Document to approve
 * @param comment Approval comment
 * @returns Updated document with approved status
 */
const approveDocument = (document: Document, comment: string) => {
  const now = new Date().toISOString();
  
  return {
    ...document,
    status: 'Approved',
    pending_since: null,
    updated_at: now,
    last_action: `Approved: ${comment}`
  };
};

/**
 * Reject a document
 * @param document Document to reject
 * @param reason Rejection reason
 * @returns Updated document with rejected status
 */
const rejectDocument = (document: Document, reason: string) => {
  const now = new Date().toISOString();
  
  return {
    ...document,
    status: 'Rejected',
    pending_since: null,
    updated_at: now,
    rejection_reason: reason,
    last_action: `Rejected: ${reason}`
  };
};

/**
 * Generate notifications based on document status
 * @param documents List of documents
 * @returns List of notifications
 */
const generateNotifications = (documents: Document[]): DocumentNotification[] => {
  const notifications: DocumentNotification[] = [];
  
  // Generate notifications for pending approvals
  documents.forEach(doc => {
    if (doc.status === 'Pending_Approval' && doc.approvers && doc.approvers.length > 0) {
      notifications.push({
        id: uuidv4(),
        documentId: doc.id,
        documentTitle: doc.title,
        type: 'approval_request',
        message: `${doc.title} needs your approval`,
        createdAt: doc.pending_since || new Date().toISOString(),
        isRead: false,
        targetUserIds: doc.approvers
      });
    }
    
    // Add other notification types as needed
  });
  
  return notifications;
};

/**
 * Get default workflow steps
 * @returns Default workflow steps
 */
const getDefaultWorkflowSteps = (): DocumentWorkflowStep[] => {
  return [
    {
      id: uuidv4(),
      name: 'Initial Review',
      description: 'Initial review by department head',
      approvers: [],
      required_approvals: 1,
      is_final: false
    },
    {
      id: uuidv4(),
      name: 'Quality Approval',
      description: 'Approval by quality department',
      approvers: [],
      required_approvals: 1,
      is_final: false
    },
    {
      id: uuidv4(),
      name: 'Final Approval',
      description: 'Final approval by management',
      approvers: [],
      required_approvals: 1,
      is_final: true
    }
  ];
};

/**
 * Get available approvers
 * @returns List of available approvers
 */
const getAvailableApprovers = async () => {
  // In a real app, this would fetch users with approval permissions from the backend
  return [
    { id: 'user1', name: 'John Doe', role: 'Department Head' },
    { id: 'user2', name: 'Jane Smith', role: 'Quality Manager' },
    { id: 'user3', name: 'Bob Johnson', role: 'Plant Manager' }
  ];
};

const documentWorkflowService = {
  submitForApproval,
  approveDocument,
  rejectDocument,
  generateNotifications,
  getDefaultWorkflowSteps,
  getAvailableApprovers
};

export const updateDocumentStatus = async (documentId: string, newStatus: DocumentStatus): Promise<Document> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update document status: ${error.message}`);

    // Use correct status comparison
    if (newStatus === 'Pending Approval') {
      // Set the pending_since timestamp when a document enters review
      await supabase
        .from('documents')
        .update({
          pending_since: new Date().toISOString()
        })
        .eq('id', documentId);
    }
    
    return data as Document;
  } catch (error) {
    console.error('Error in updateDocumentStatus:', error);
    throw error;
  }
};

export default documentWorkflowService;
