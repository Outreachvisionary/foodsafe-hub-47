
import { Document, DocumentStatus, CheckoutStatus } from '@/types/document';

// Function to adapt a document to the format expected by the database
export const adaptDocumentToDatabase = (document: Partial<Document>) => {
  return {
    ...document,
    status: document.status || 'Draft',
    checkout_status: document.checkout_status || 'Available',
  };
};

// Function to adapt a document from the database to the format expected by the application
export const adaptDocumentFromDatabase = (dbDocument: any): Document => {
  return {
    id: dbDocument.id,
    title: dbDocument.title,
    description: dbDocument.description,
    file_name: dbDocument.file_name,
    file_size: dbDocument.file_size,
    file_type: dbDocument.file_type,
    category: dbDocument.category,
    status: dbDocument.status,
    checkout_status: dbDocument.checkout_status || 'Available',
    created_at: dbDocument.created_at,
    updated_at: dbDocument.updated_at,
    created_by: dbDocument.created_by,
    version: dbDocument.version,
    folder_id: dbDocument.folder_id,
    file_path: dbDocument.file_path,
    expiry_date: dbDocument.expiry_date,
    linked_module: dbDocument.linked_module,
    linked_item_id: dbDocument.linked_item_id,
    tags: dbDocument.tags,
    approvers: dbDocument.approvers,
    is_locked: dbDocument.is_locked,
    checkout_user_id: dbDocument.checkout_user_id,
    checkout_user_name: dbDocument.checkout_user_name,
    checkout_timestamp: dbDocument.checkout_timestamp,
    workflow_status: dbDocument.workflow_status,
    rejection_reason: dbDocument.rejection_reason,
    last_action: dbDocument.last_action,
    is_template: dbDocument.is_template,
    pending_since: dbDocument.pending_since,
    custom_notification_days: dbDocument.custom_notification_days,
    current_version_id: dbDocument.current_version_id,
    last_review_date: dbDocument.last_review_date,
    next_review_date: dbDocument.next_review_date,
  };
};

// Function to adapt a document for display in the UI
export const adaptDocumentForUI = (document: Document) => {
  return {
    ...document,
    statusDisplay: formatDocumentStatus(document.status),
  };
};

// Helper function to format document status for display
export const formatDocumentStatus = (status: DocumentStatus | string) => {
  if (typeof status === 'string') {
    return status.replace(/_/g, ' ');
  }
  return String(status).replace(/_/g, ' ');
};

// Function to generate a document number based on type, department, and date
export const generateDocumentNumber = (type: string, department: string): string => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(2, 2); // Get last 2 digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const typeCode = type.toString().substr(0, 3).toUpperCase();
  const deptCode = department.substr(0, 3).toUpperCase();
  
  // Generate a random 3-digit number for uniqueness
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${typeCode}-${deptCode}-${year}${month}-${randomNum}`;
};

// Function to get document number for display (compliance requirement)
export const getDocumentNumber = (document: Document): string => {
  // If we have a custom document number field, use it
  // Otherwise generate one based on category and creation date
  const date = new Date(document.created_at);
  const year = date.getFullYear().toString().substr(2, 2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const typeCode = document.category.toString().substr(0, 3).toUpperCase();
  const sequenceNum = document.version.toString().padStart(3, '0');
  
  return `${typeCode}-${year}${month}-${sequenceNum}`;
};

// Function to check if document needs review (compliance requirement)
export const getReviewStatus = (document: Document): {
  status: 'current' | 'due' | 'overdue';
  daysUntilReview?: number;
  message: string;
} => {
  if (!document.next_review_date) {
    return {
      status: 'current',
      message: 'No review date set'
    };
  }
  
  const today = new Date();
  const reviewDate = new Date(document.next_review_date);
  const diffTime = reviewDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      status: 'overdue',
      daysUntilReview: Math.abs(diffDays),
      message: `Review overdue by ${Math.abs(diffDays)} days`
    };
  } else if (diffDays <= 30) {
    return {
      status: 'due',
      daysUntilReview: diffDays,
      message: `Review due in ${diffDays} days`
    };
  }
  
  return {
    status: 'current',
    daysUntilReview: diffDays,
    message: `Next review in ${diffDays} days`
  };
};

// Function to check document compliance status
export const getComplianceInfo = (document: Document) => {
  const reviewStatus = getReviewStatus(document);
  const hasApprovers = document.approvers && document.approvers.length > 0;
  const isControlled = ['SOP', 'Policy', 'HACCP_Plan'].includes(document.category);
  
  return {
    documentNumber: getDocumentNumber(document),
    reviewStatus,
    isControlled,
    hasApprovers,
    requiresApproval: isControlled && !hasApprovers,
    complianceLevel: isControlled && hasApprovers && reviewStatus.status === 'current' ? 'high' : 
                    isControlled ? 'medium' : 'basic'
  };
};
