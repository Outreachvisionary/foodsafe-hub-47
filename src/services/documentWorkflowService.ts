
import { Document, DocumentCategory, DocumentStats, DocumentNotification, DocumentActivity } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

// Define approval rules by document category
const approvalRules: Record<DocumentCategory, {
  requiredApprovers: string[];
  escalationThresholdDays: number;
  escalationTargets: string[];
}> = {
  'SOP': {
    requiredApprovers: ['Quality Manager', 'Department Head'],
    escalationThresholdDays: 5,
    escalationTargets: ['Quality Director', 'VP Operations']
  },
  'Policy': {
    requiredApprovers: ['Quality Manager', 'Department Head', 'Compliance Officer'],
    escalationThresholdDays: 7,
    escalationTargets: ['CEO', 'VP Operations']
  },
  'Form': {
    requiredApprovers: ['Department Head'],
    escalationThresholdDays: 3,
    escalationTargets: ['Quality Manager']
  },
  'Certificate': {
    requiredApprovers: ['Quality Manager'],
    escalationThresholdDays: 3,
    escalationTargets: ['Compliance Officer']
  },
  'Audit Report': {
    requiredApprovers: ['Quality Manager', 'Audited Department Head'],
    escalationThresholdDays: 5,
    escalationTargets: ['Compliance Officer', 'CEO']
  },
  'HACCP Plan': {
    requiredApprovers: ['Quality Manager', 'Food Safety Team Leader', 'Operations Manager'],
    escalationThresholdDays: 7,
    escalationTargets: ['VP Operations', 'CEO']
  },
  'Training Material': {
    requiredApprovers: ['Department Head', 'Training Manager'],
    escalationThresholdDays: 5,
    escalationTargets: ['HR Director']
  },
  'Supplier Documentation': {
    requiredApprovers: ['Procurement Manager', 'Quality Manager'],
    escalationThresholdDays: 5,
    escalationTargets: ['VP Operations']
  },
  'Risk Assessment': {
    requiredApprovers: ['Department Head', 'Safety Officer', 'Quality Manager'],
    escalationThresholdDays: 7,
    escalationTargets: ['VP Operations', 'CEO']
  },
  'Other': {
    requiredApprovers: ['Department Head'],
    escalationThresholdDays: 5,
    escalationTargets: ['Quality Manager']
  }
};

// Get the approval rule for a specific document category
export const getApprovalRule = (category: DocumentCategory) => {
  return approvalRules[category] || approvalRules['Other'];
};

// Check if a document is past its approval deadline
export const isApprovalOverdue = (document: Document): boolean => {
  if (!document.pending_since || document.status !== 'Pending Approval') {
    return false;
  }
  
  const pendingDate = new Date(document.pending_since);
  const currentDate = new Date();
  const escalationThreshold = getApprovalRule(document.category).escalationThresholdDays;
  
  // Calculate days elapsed
  const millisPerDay = 1000 * 60 * 60 * 24;
  const daysElapsed = Math.floor((currentDate.getTime() - pendingDate.getTime()) / millisPerDay);
  
  return daysElapsed > escalationThreshold;
};

// Get the required approvers for a document category
export const getRequiredApprovers = (category: DocumentCategory): string[] => {
  return getApprovalRule(category).requiredApprovers;
};

// Check if documents are expiring soon and update status if needed
export const updateDocumentStatusBasedOnExpiry = (documents: Document[]): Document[] => {
  return documents.map(doc => {
    // Skip if no expiry date
    if (!doc.expiry_date) {
      return doc;
    }
    
    const expiryDate = new Date(doc.expiry_date);
    const currentDate = new Date();
    
    // Document is expired but not marked as such
    if (expiryDate < currentDate && doc.status === 'Published') {
      return {
        ...doc,
        status: 'Expired'
      };
    }
    
    return doc;
  });
};

// Generate notifications for documents based on real data
export const generateNotifications = (documents: Document[]): DocumentNotification[] => {
  const notifications: DocumentNotification[] = [];
  const currentDate = new Date();
  
  documents.forEach(doc => {
    // Only generate notifications for real pending approvals (not mock data)
    if (doc.status === 'Pending Approval' && doc.pending_since) {
      notifications.push({
        id: `approval-pending-${doc.id}`,
        documentId: doc.id,
        documentTitle: doc.title,
        type: 'approval_request',
        message: `${doc.title} needs your approval`,
        createdAt: doc.pending_since,
        isRead: false,
        targetUserIds: doc.approvers || getRequiredApprovers(doc.category)
      });
      
      // Add overdue notification if applicable
      if (isApprovalOverdue(doc)) {
        notifications.push({
          id: `approval-overdue-${doc.id}`,
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'approval_overdue',
          message: `Approval for "${doc.title}" is overdue`,
          createdAt: new Date().toISOString(),
          isRead: false,
          targetUserIds: getApprovalRule(doc.category).escalationTargets
        });
      }
    }
    
    // Only generate expiry notifications for real published documents with real expiry dates (not mock data)
    if (doc.expiry_date && doc.status === 'Published') {
      const expiryDate = new Date(doc.expiry_date);
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Only add expiry notification if it's within the next 90 days
      if (daysUntilExpiry >= 0 && daysUntilExpiry <= 90) {
        // Check custom notification days
        if (doc.custom_notification_days && doc.custom_notification_days.includes(daysUntilExpiry)) {
          notifications.push({
            id: `expiry-${doc.id}-${daysUntilExpiry}`,
            documentId: doc.id,
            documentTitle: doc.title,
            type: 'expiry_reminder',
            message: `"${doc.title}" will expire in ${daysUntilExpiry} days`,
            createdAt: new Date().toISOString(),
            isRead: false,
            targetUserIds: []
          });
        }
        // Default notifications at 90, 30, 7, and 1 days
        else if ([90, 30, 7, 1].includes(daysUntilExpiry)) {
          notifications.push({
            id: `expiry-${doc.id}-${daysUntilExpiry}`,
            documentId: doc.id,
            documentTitle: doc.title,
            type: 'expiry_reminder',
            message: `"${doc.title}" will expire in ${daysUntilExpiry} days`,
            createdAt: new Date().toISOString(),
            isRead: false,
            targetUserIds: []
          });
        }
      }
    }
  });
  
  return notifications;
};

// Submit document for approval
export const submitForApproval = (document: Document): Document => {
  return {
    ...document,
    status: 'Pending Approval',
    pending_since: new Date().toISOString(),
    is_locked: true
  };
};

// Approve document
export const approveDocument = (document: Document, comment?: string): Document => {
  return {
    ...document,
    status: 'Approved',
    pending_since: undefined,
    is_locked: false,
    updated_at: new Date().toISOString()
  };
};

// Reject document
export const rejectDocument = (document: Document, reason: string): Document => {
  return {
    ...document,
    status: 'Draft',
    pending_since: undefined,
    is_locked: false,
    rejection_reason: reason,
    updated_at: new Date().toISOString()
  };
};

// Publish approved document
export const publishDocument = (document: Document): Document => {
  if (document.status !== 'Approved') {
    throw new Error('Document must be approved before publishing');
  }
  
  return {
    ...document,
    status: 'Published',
    updated_at: new Date().toISOString()
  };
};

// Archive document
export const archiveDocument = (document: Document): Document => {
  return {
    ...document,
    status: 'Archived',
    updated_at: new Date().toISOString()
  };
};

// Calculate document statistics
export const getDocumentStats = (documents: Document[]): DocumentStats => {
  const stats: DocumentStats = {
    totalDocuments: documents.length,
    pendingApproval: 0,
    expiringSoon: 0,
    expired: 0,
    published: 0,
    archived: 0,
    byCategory: {}
  };
  
  const currentDate = new Date();
  
  documents.forEach(doc => {
    // Count by status
    if (doc.status === 'Pending Approval') {
      stats.pendingApproval++;
    } else if (doc.status === 'Published') {
      stats.published++;
    } else if (doc.status === 'Archived') {
      stats.archived++;
    } else if (doc.status === 'Expired') {
      stats.expired++;
    }
    
    // Count documents expiring soon (within 30 days)
    if (doc.expiry_date && doc.status === 'Published') {
      const expiryDate = new Date(doc.expiry_date);
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        stats.expiringSoon++;
      }
    }
    
    // Count by category
    if (doc.category) {
      if (!stats.byCategory[doc.category]) {
        stats.byCategory[doc.category] = 0;
      }
      stats.byCategory[doc.category]++;
    }
  });
  
  return stats;
};

export const documentWorkflowService = {
  getApprovalRule,
  isApprovalOverdue,
  getRequiredApprovers,
  updateDocumentStatusBasedOnExpiry,
  generateNotifications,
  submitForApproval,
  approveDocument,
  rejectDocument,
  publishDocument,
  archiveDocument,
  getDocumentStats
};

export default documentWorkflowService;
