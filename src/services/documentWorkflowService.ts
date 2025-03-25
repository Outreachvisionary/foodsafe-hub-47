
import { Document, DocumentStatus } from '@/types/database';
import { DocumentActivity, DocumentNotification, ApproverRole, DocumentStats, DocumentAction, ApprovalRule } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

class DocumentWorkflowService {
  // Get required approvers for a document category
  getRequiredApprovers(category: string): string[] {
    // This would typically come from a database in a real implementation
    switch(category) {
      case 'SOP':
        return ['Quality Manager', 'Operations Director'];
      case 'Policy':
        return ['Compliance Officer', 'CEO'];
      case 'HACCP Plan':
        return ['Food Safety Manager', 'Quality Manager', 'Operations Director'];
      case 'Audit Report':
        return ['Quality Manager', 'Department Head'];
      default:
        return ['Quality Manager'];
    }
  }

  // Get approval rule for a document category
  getApprovalRule(category: string): ApprovalRule {
    // This would typically come from a database in a real implementation
    return {
      id: `rule-${category}`,
      name: `${category} Approval Rule`,
      requiredApprovers: this.getRequiredApprovers(category),
      roles: this.getRequiredApprovers(category),
      escalationThresholdDays: 7,
      escalationTargets: ['Quality Director', 'CEO']
    };
  }

  // Check if a document approval is overdue
  isApprovalOverdue(document: Document): boolean {
    if (document.status !== 'Pending Approval' || !document.pending_since) {
      return false;
    }
    
    const pendingDate = new Date(document.pending_since);
    const currentDate = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysPending = Math.floor(
      (currentDate.getTime() - pendingDate.getTime()) / millisecondsPerDay
    );
    
    // Consider overdue if pending for more than 7 days
    return daysPending >= 7;
  }

  // Update document status based on expiry dates
  updateDocumentStatusBasedOnExpiry(documents: Document[]): Document[] {
    const currentDate = new Date();
    
    return documents.map(doc => {
      // Skip if no expiry date or already archived/expired
      if (!doc.expiry_date || doc.status === 'Archived' || doc.status === 'Expired') {
        return doc;
      }
      
      const expiryDate = new Date(doc.expiry_date);
      
      // Update status to Expired if the document has expired
      if (expiryDate < currentDate && doc.status === 'Published') {
        return {
          ...doc,
          status: 'Expired' as DocumentStatus,
          updated_at: new Date().toISOString()
        };
      }
      
      return doc;
    });
  }

  // Generate notifications based on document status and expiry
  generateNotifications(documents: Document[]): DocumentNotification[] {
    const notifications: DocumentNotification[] = [];
    const currentDate = new Date();
    
    // Check for pending approvals that are taking too long
    documents.forEach(doc => {
      if (doc.status === 'Pending Approval' && doc.pending_since) {
        const pendingDate = new Date(doc.pending_since);
        const daysPending = Math.floor(
          (currentDate.getTime() - pendingDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // If pending for more than 7 days, generate an overdue notification
        if (daysPending >= 7) {
          notifications.push({
            id: `notification-${uuidv4()}`,
            documentId: doc.id,
            documentTitle: doc.title,
            type: 'approval_overdue',
            message: `Approval for "${doc.title}" is overdue by ${daysPending} days`,
            createdAt: new Date().toISOString(),
            isRead: false,
            targetUserIds: []
          });
        }
      }
    });
    
    // Check for documents expiring soon
    documents.forEach(doc => {
      if (doc.status === 'Published' && doc.expiry_date) {
        const expiryDate = new Date(doc.expiry_date);
        const daysUntilExpiry = Math.floor(
          (expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // Generate notifications for custom notification days or standard intervals
        const notificationDays = doc.custom_notification_days && doc.custom_notification_days.length > 0
          ? doc.custom_notification_days
          : [90, 60, 30, 14, 7];
        
        notificationDays.forEach(days => {
          if (daysUntilExpiry === days) {
            notifications.push({
              id: `notification-${uuidv4()}`,
              documentId: doc.id,
              documentTitle: doc.title,
              type: 'expiry_reminder',
              message: `"${doc.title}" will expire in ${days} day${days !== 1 ? 's' : ''}`,
              createdAt: new Date().toISOString(),
              isRead: false,
              targetUserIds: []
            });
          }
        });
        
        // Generate notification for expired documents
        if (daysUntilExpiry < 0 && daysUntilExpiry > -7) { // Only for recently expired documents (last 7 days)
          notifications.push({
            id: `notification-${uuidv4()}`,
            documentId: doc.id,
            documentTitle: doc.title,
            type: 'document_expired',
            message: `"${doc.title}" has expired`,
            createdAt: new Date().toISOString(),
            isRead: false,
            targetUserIds: []
          });
        }
      }
    });
    
    return notifications;
  }

  // Calculate document statistics
  getDocumentStats(documents: Document[]): DocumentStats {
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
      
      // Check for expiring soon
      if (doc.status === 'Published' && doc.expiry_date) {
        const expiryDate = new Date(doc.expiry_date);
        const daysUntilExpiry = Math.floor(
          (expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysUntilExpiry >= 0 && daysUntilExpiry <= 30) {
          stats.expiringSoon++;
        }
      }
      
      // Count by category
      const category = doc.category;
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = 0;
      }
      stats.byCategory[category]++;
    });
    
    return stats;
  }

  // Helper to log document activity
  logDocumentActivity(document: Document, action: DocumentAction, userId: string, userName: string, userRole: string, comments?: string): DocumentActivity {
    return {
      id: uuidv4(),
      document_id: document.id,
      action,
      timestamp: new Date().toISOString(),
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      comments
    };
  }

  // Document workflow methods
  submitForApproval(document: Document): Document {
    if (document.status !== 'Draft') {
      throw new Error('Only documents in Draft status can be submitted for approval');
    }
    
    // Update document status and set pending timestamp
    const updatedDoc = {
      ...document,
      status: 'Pending Approval' as DocumentStatus,
      pending_since: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, you'd generate an activity record in the database
    const activity = this.logDocumentActivity(
      updatedDoc,
      'submit_for_approval',
      'current-user', // This would be the actual user ID in a real implementation
      'Current User',
      'Document Owner'
    );
    
    console.log('Document submitted for approval:', updatedDoc);
    console.log('Activity logged:', activity);
    
    return updatedDoc;
  }

  approveDocument(document: Document, comment?: string): Document {
    if (document.status !== 'Pending Approval') {
      throw new Error('Only documents in Pending Approval status can be approved');
    }
    
    // Update document status and clear pending timestamp
    const updatedDoc = {
      ...document,
      status: 'Approved' as DocumentStatus,
      pending_since: undefined,
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, you'd generate an activity record in the database
    const activity = this.logDocumentActivity(
      updatedDoc,
      'approve',
      'current-user', // This would be the actual user ID in a real implementation
      'Current User',
      'Approver',
      comment
    );
    
    console.log('Document approved:', updatedDoc);
    console.log('Activity logged:', activity);
    
    return updatedDoc;
  }

  rejectDocument(document: Document, reason: string): Document {
    if (document.status !== 'Pending Approval') {
      throw new Error('Only documents in Pending Approval status can be rejected');
    }
    
    // Update document status, clear pending timestamp, and set rejection reason
    const updatedDoc = {
      ...document,
      status: 'Draft' as DocumentStatus,
      pending_since: undefined,
      rejection_reason: reason,
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, you'd generate an activity record in the database
    const activity = this.logDocumentActivity(
      updatedDoc,
      'reject',
      'current-user', // This would be the actual user ID in a real implementation
      'Current User',
      'Approver',
      reason
    );
    
    console.log('Document rejected:', updatedDoc);
    console.log('Activity logged:', activity);
    
    return updatedDoc;
  }

  publishDocument(document: Document): Document {
    if (document.status !== 'Approved') {
      throw new Error('Only approved documents can be published');
    }
    
    // Update document status
    const updatedDoc = {
      ...document,
      status: 'Published' as DocumentStatus,
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, you'd generate an activity record in the database
    const activity = this.logDocumentActivity(
      updatedDoc,
      'publish',
      'current-user', // This would be the actual user ID in a real implementation
      'Current User',
      'Document Owner'
    );
    
    console.log('Document published:', updatedDoc);
    console.log('Activity logged:', activity);
    
    return updatedDoc;
  }

  archiveDocument(document: Document): Document {
    if (document.status === 'Draft' || document.status === 'Pending Approval') {
      throw new Error('Draft or pending documents cannot be archived');
    }
    
    // Update document status
    const updatedDoc = {
      ...document,
      status: 'Archived' as DocumentStatus,
      custom_notification_days: [], // Clear notification days when archiving
      updated_at: new Date().toISOString()
    };
    
    // In a real implementation, you'd generate an activity record in the database
    const activity = this.logDocumentActivity(
      updatedDoc,
      'archive',
      'current-user', // This would be the actual user ID in a real implementation
      'Current User',
      'Document Owner'
    );
    
    console.log('Document archived:', updatedDoc);
    console.log('Activity logged:', activity);
    
    // If the document is expired, you might need to handle additional logic
    if (document.expiry_date && new Date(document.expiry_date) < new Date()) {
      // Handle expired document archiving
    }
    
    return updatedDoc;
  }
}

export const documentWorkflowService = new DocumentWorkflowService();
