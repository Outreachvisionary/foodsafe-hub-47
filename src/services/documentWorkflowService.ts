
import { Document, DocumentCategory, ApprovalRule, DocumentNotification, ApproverRole } from '@/types/document';
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
   * Update document status based on workflow rules
   */
  submitForApproval: (document: Document): Document => {
    // In a real app, this would create the appropriate approval tasks
    // and notify required approvers
    return {
      ...document,
      status: 'Pending Approval',
      pendingSince: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
  }
};

export default documentWorkflowService;
