
import { Document, DocumentNotification } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

/**
 * Submit document for approval
 */
export const submitForApproval = (document: Document): Partial<Document> => {
  return {
    status: 'Pending_Approval',
    pending_since: new Date().toISOString(),
    last_action: 'Submitted for approval',
    is_locked: true
  };
};

/**
 * Approve document
 */
export const approveDocument = (document: Document, comment: string): Partial<Document> => {
  return {
    status: 'Approved',
    last_action: 'Approved',
    last_review_date: new Date().toISOString(),
    next_review_date: calculateNextReviewDate(document),
    is_locked: false
  };
};

/**
 * Reject document
 */
export const rejectDocument = (document: Document, reason: string): Partial<Document> => {
  return {
    status: 'Draft',
    last_action: 'Rejected',
    rejection_reason: reason,
    is_locked: false,
    pending_since: null
  };
};

/**
 * Calculate next review date based on document type
 */
const calculateNextReviewDate = (document: Document): string => {
  const nextReviewDate = new Date();
  
  // Default review period is 1 year
  nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
  
  // Adjust based on document category if needed
  if (document.category === 'Policy') {
    // Policies are reviewed every 2 years
    nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
  } else if (document.category === 'Procedure') {
    // Procedures are reviewed every year (default)
  } else if (document.category === 'Form') {
    // Forms are reviewed every 6 months
    nextReviewDate.setMonth(nextReviewDate.getMonth() + 6);
  }
  
  return nextReviewDate.toISOString();
};

/**
 * Generate notifications based on document statuses, expirations, etc.
 */
export const generateNotifications = (documents: Document[]): DocumentNotification[] => {
  const notifications: DocumentNotification[] = [];
  const now = new Date();
  
  documents.forEach(doc => {
    // Check for pending approvals
    if (doc.status === 'Pending_Approval') {
      notifications.push({
        id: uuidv4(),
        documentId: doc.id,
        documentTitle: doc.title,
        type: 'approval_request',
        message: `Document "${doc.title}" is waiting for your approval`,
        createdAt: now.toISOString(),
        isRead: false,
        targetUserIds: doc.approvers || []
      });
    }
    
    // Check for expiring documents
    if (doc.expiry_date) {
      const expiryDate = new Date(doc.expiry_date);
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        notifications.push({
          id: uuidv4(),
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'expiry_reminder',
          message: `Document "${doc.title}" will expire in ${daysUntilExpiry} days`,
          createdAt: now.toISOString(),
          isRead: false,
          targetUserIds: [doc.created_by, ...(doc.approvers || [])]
        });
      } else if (daysUntilExpiry <= 0) {
        notifications.push({
          id: uuidv4(),
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'expired',
          message: `Document "${doc.title}" has expired`,
          createdAt: now.toISOString(),
          isRead: false,
          targetUserIds: [doc.created_by, ...(doc.approvers || [])]
        });
      }
    }
    
    // Check for review dates
    if (doc.next_review_date) {
      const reviewDate = new Date(doc.next_review_date);
      const daysUntilReview = Math.floor((reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilReview <= 30 && daysUntilReview > 0) {
        notifications.push({
          id: uuidv4(),
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'review_reminder',
          message: `Document "${doc.title}" is due for review in ${daysUntilReview} days`,
          createdAt: now.toISOString(),
          isRead: false,
          targetUserIds: [doc.created_by]
        });
      } else if (daysUntilReview <= 0) {
        notifications.push({
          id: uuidv4(),
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'review_overdue',
          message: `Document "${doc.title}" is overdue for review`,
          createdAt: now.toISOString(),
          isRead: false,
          targetUserIds: [doc.created_by]
        });
      }
    }
  });
  
  return notifications;
};

export default {
  submitForApproval,
  approveDocument,
  rejectDocument,
  generateNotifications
};
