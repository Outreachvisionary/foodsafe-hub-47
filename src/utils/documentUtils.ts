
import { Document, DocumentVersion, DocumentActivity } from '@/types/document';

/**
 * Creates a version history item from a document version
 */
export const createVersionHistoryItem = (
  document: Document,
  version: DocumentVersion
): DocumentVersion => {
  return {
    ...version,
    document_id: document.id,
  };
};

/**
 * Checks if a document is checked out
 */
export const isDocumentCheckedOut = (document: Document): boolean => {
  return !!document.checkout_user_id;
};

/**
 * Checks if the current user has checked out the document
 */
export const isCurrentUserCheckout = (document: Document, userId: string): boolean => {
  return document.checkout_user_id === userId;
};

/**
 * Get document approval status text
 */
export const getApprovalStatusText = (document: Document): string => {
  if (document.approval_status === 'pending') {
    return 'Pending Approval';
  } else if (document.approval_status === 'approved') {
    return 'Approved';
  } else if (document.approval_status === 'rejected') {
    return 'Rejected';
  } else {
    return document.status;
  }
};

/**
 * Check if a document is expired
 */
export const isDocumentExpired = (document: Document): boolean => {
  if (!document.expiry_date) return false;
  
  const expiryDate = new Date(document.expiry_date);
  const currentDate = new Date();
  
  return expiryDate < currentDate;
};

/**
 * Creates an activity record for the document
 */
export const createDocumentActivity = (
  document: Document,
  action: DocumentActivity['action'],
  userId: string,
  userName: string,
  userRole: string,
  comments?: string
): DocumentActivity => {
  return {
    id: `activity-${Date.now()}`,
    document_id: document.id,
    action,
    user_id: userId,
    user_name: userName,
    user_role: userRole,
    timestamp: new Date().toISOString(),
    comments
  };
};
