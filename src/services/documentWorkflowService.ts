
import { Document, DocumentCategory, ApprovalRule, DocumentNotification, ApproverRole, DocumentActivity, DocumentStatus, DocumentAction } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

// Sample approval rules based on document categories
export const defaultApprovalRules: ApprovalRule[] = [
  {
    id: '1',
    category: 'SOP',
    requiredApprovers: ['QA Manager'],
    escalationThresholdDays: 7,
    escalationTargets: ['Department Head']
  },
  {
    id: '2',
    category: 'Audit Report',
    requiredApprovers: ['Department Head', 'Compliance Officer'],
    escalationThresholdDays: 5,
    escalationTargets: ['CEO']
  },
  {
    id: '3',
    category: 'Policy',
    requiredApprovers: ['Department Head', 'QA Manager', 'Compliance Officer'],
    escalationThresholdDays: 10,
    escalationTargets: ['CEO']
  },
  {
    id: '4',
    category: 'HACCP Plan',
    requiredApprovers: ['QA Manager', 'Department Head'],
    escalationThresholdDays: 5,
    escalationTargets: ['Compliance Officer']
  },
  {
    id: '5',
    category: 'Certificate',
    requiredApprovers: ['QA Manager'],
    escalationThresholdDays: 3,
    escalationTargets: ['Compliance Officer']
  }
];

// Default notification days before expiry
export const defaultExpiryNotificationDays = [30, 14, 7];

// Sample user info for demo purposes
export const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  role: 'QA Manager',
  email: 'john.doe@example.com'
};

export const documentWorkflowService = {
  /**
   * Get approval rule for a document category
   */
  getApprovalRule: (category: DocumentCategory): ApprovalRule => {
    const rule = defaultApprovalRules.find(rule => rule.category === category);
    // Default fallback rule if category has no specific rule
    return rule || {
      id: 'default',
      category: 'Other',
      requiredApprovers: ['QA Manager'],
      escalationThresholdDays: 7,
      escalationTargets: ['Department Head']
    };
  },

  /**
   * Check if a document is overdue for approval based on escalation threshold
   */
  isApprovalOverdue: (document: Document): boolean => {
    if (document.status !== 'Pending Approval' || !document.pendingSince) {
      return false;
    }

    const rule = documentWorkflowService.getApprovalRule(document.category);
    const pendingDate = new Date(document.pendingSince);
    const currentDate = new Date();
    
    // Calculate days in pending status
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysPending = Math.floor((currentDate.getTime() - pendingDate.getTime()) / millisecondsPerDay);
    
    return daysPending >= rule.escalationThresholdDays;
  },

  /**
   * Check if a document is expiring soon
   */
  isExpiringSoon: (document: Document): boolean => {
    if (!document.expiryDate) {
      return false;
    }

    const expiryDate = new Date(document.expiryDate);
    const currentDate = new Date();
    
    // Calculate days until expiry
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / millisecondsPerDay);
    
    // Consider "expiring soon" if within 30 days
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  },

  /**
   * Check if a document is expired
   */
  isExpired: (document: Document): boolean => {
    if (!document.expiryDate) {
      return false;
    }

    const expiryDate = new Date(document.expiryDate);
    const currentDate = new Date();
    
    return expiryDate < currentDate;
  },

  /**
   * Generate notifications for documents that need attention
   */
  generateNotifications: (documents: Document[]): DocumentNotification[] => {
    const notifications: DocumentNotification[] = [];
    const currentDate = new Date();

    documents.forEach(doc => {
      // Approval overdue notifications
      if (documentWorkflowService.isApprovalOverdue(doc)) {
        const rule = documentWorkflowService.getApprovalRule(doc.category);
        
        notifications.push({
          id: `notification-${Math.random().toString(36).substring(2, 11)}`,
          documentId: doc.id,
          documentTitle: doc.title,
          type: 'approval_overdue',
          message: `Approval for "${doc.title}" is overdue (${rule.escalationThresholdDays} days threshold exceeded)`,
          createdAt: new Date().toISOString(),
          isRead: false,
          targetUserIds: [] // In a real app, this would have the IDs of users with the escalation roles
        });
      }

      // Expiry reminder notifications
      if (doc.expiryDate) {
        const expiryDate = new Date(doc.expiryDate);
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / millisecondsPerDay);
        
        // Use custom notification days if specified, otherwise use defaults
        const notificationDays = doc.customNotificationDays || defaultExpiryNotificationDays;
        
        if (notificationDays.includes(daysUntilExpiry)) {
          notifications.push({
            id: `notification-${Math.random().toString(36).substring(2, 11)}`,
            documentId: doc.id,
            documentTitle: doc.title,
            type: 'expiry_reminder',
            message: `Document "${doc.title}" will expire in ${daysUntilExpiry} days`,
            createdAt: new Date().toISOString(),
            isRead: false,
            targetUserIds: [] // In a real app, this would have the IDs of document owners/stakeholders
          });
        }
      }
    });

    return notifications;
  },

  /**
   * Get required approvers for a document based on its category
   */
  getRequiredApprovers: (category: DocumentCategory): ApproverRole[] => {
    const rule = documentWorkflowService.getApprovalRule(category);
    return rule.requiredApprovers;
  },

  /**
   * Submit document for approval
   */
  submitForApproval: (document: Document): Document => {
    // Create activity record (in a real app, this would be saved to a database)
    const activity: DocumentActivity = {
      id: `activity-${Math.random().toString(36).substring(2, 11)}`,
      documentId: document.id,
      action: 'submitted_for_approval',
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    };
    
    console.log('Document submitted for approval:', activity);
    
    // Return updated document
    return {
      ...document,
      status: 'Pending Approval',
      pendingSince: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocked: true,
      lastAction: 'submitted_for_approval'
    };
  },

  /**
   * Approve document
   */
  approveDocument: (document: Document, comment?: string): Document => {
    // Create activity record
    const activity: DocumentActivity = {
      id: `activity-${Math.random().toString(36).substring(2, 11)}`,
      documentId: document.id,
      action: 'approved',
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      comments: comment
    };
    
    console.log('Document approved:', activity);
    
    // Return updated document
    return {
      ...document,
      status: 'Approved',
      pendingSince: undefined,
      isLocked: false,
      updatedAt: new Date().toISOString(),
      lastAction: 'approved',
      lastReviewDate: new Date().toISOString(),
      // Set next review date to 1 year from now by default
      nextReviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
    };
  },

  /**
   * Reject document
   */
  rejectDocument: (document: Document, reason: string): Document => {
    // Create activity record
    const activity: DocumentActivity = {
      id: `activity-${Math.random().toString(36).substring(2, 11)}`,
      documentId: document.id,
      action: 'rejected',
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      comments: reason
    };
    
    console.log('Document rejected:', activity);
    
    // Return updated document
    return {
      ...document,
      status: 'Draft',
      pendingSince: undefined,
      rejectionReason: reason,
      isLocked: false,
      updatedAt: new Date().toISOString(),
      lastAction: 'rejected'
    };
  },

  /**
   * Publish approved document
   */
  publishDocument: (document: Document): Document => {
    if (document.status !== 'Approved') {
      console.error('Cannot publish document that is not approved');
      return document;
    }
    
    // Create activity record
    const activity: DocumentActivity = {
      id: `activity-${Math.random().toString(36).substring(2, 11)}`,
      documentId: document.id,
      action: 'published',
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    };
    
    console.log('Document published:', activity);
    
    // Return updated document
    return {
      ...document,
      status: 'Published',
      updatedAt: new Date().toISOString(),
      lastAction: 'published'
    };
  },

  /**
   * Archive document
   */
  archiveDocument: (document: Document): Document => {
    // Create activity record
    const activity: DocumentActivity = {
      id: `activity-${Math.random().toString(36).substring(2, 11)}`,
      documentId: document.id,
      action: 'archived',
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    };
    
    console.log('Document archived:', activity);
    
    // Return updated document
    return {
      ...document,
      status: 'Archived',
      updatedAt: new Date().toISOString(),
      lastAction: 'archived'
    };
  },

  /**
   * Set custom notification periods for document expiry
   */
  setExpiryNotifications: (document: Document, notificationDays: number[]): Document => {
    return {
      ...document,
      customNotificationDays: notificationDays,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Update document status based on its expiry date
   */
  updateDocumentStatusBasedOnExpiry: (documents: Document[]): Document[] => {
    return documents.map(doc => {
      if (doc.expiryDate && doc.status !== 'Expired' && doc.status !== 'Archived') {
        if (documentWorkflowService.isExpired(doc)) {
          // Create activity record for expiry
          const activity: DocumentActivity = {
            id: `activity-${Math.random().toString(36).substring(2, 11)}`,
            documentId: doc.id,
            action: 'expired',
            timestamp: new Date().toISOString(),
            userId: 'system',
            userName: 'System',
            userRole: 'System'
          };
          
          console.log('Document marked as expired:', activity);
          
          // Return updated document marked as expired
          return {
            ...doc,
            status: 'Expired',
            updatedAt: new Date().toISOString(),
            lastAction: 'expired'
          };
        }
      }
      
      return doc;
    });
  },

  /**
   * Get document stats for dashboard
   */
  getDocumentStats: (documents: Document[]) => {
    const stats = {
      totalDocuments: documents.length,
      pendingApproval: 0,
      expiringSoon: 0,
      expired: 0,
      published: 0,
      archived: 0,
      byCategory: {} as Record<DocumentCategory, number>
    };

    documents.forEach(doc => {
      // Count by status
      if (doc.status === 'Pending Approval') stats.pendingApproval++;
      if (doc.status === 'Published') stats.published++;
      if (doc.status === 'Archived') stats.archived++;
      
      // Count expiring soon and expired
      if (documentWorkflowService.isExpiringSoon(doc)) stats.expiringSoon++;
      if (documentWorkflowService.isExpired(doc)) stats.expired++;
      
      // Count by category
      if (!stats.byCategory[doc.category]) {
        stats.byCategory[doc.category] = 0;
      }
      stats.byCategory[doc.category]++;
    });

    return stats;
  }
};

export default documentWorkflowService;
