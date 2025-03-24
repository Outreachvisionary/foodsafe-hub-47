
export type DocumentStatus = 
  | 'Draft' 
  | 'Pending Approval' 
  | 'Approved' 
  | 'Published' 
  | 'Archived' 
  | 'Expired';

export type DocumentCategory = 
  | 'SOP' 
  | 'Policy' 
  | 'Form' 
  | 'Certificate' 
  | 'Audit Report' 
  | 'HACCP Plan' 
  | 'Training Material' 
  | 'Supplier Documentation' 
  | 'Risk Assessment'
  | 'Other';

export type ModuleReference = 
  | 'haccp' 
  | 'training' 
  | 'audits' 
  | 'suppliers' 
  | 'capa' 
  | 'traceability' 
  | 'none';

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  linkedModule?: ModuleReference;
  linkedItemId?: string;
  tags?: string[];
  approvers?: string[];
  pendingSince?: string; // When document entered Pending Approval status
  customNotificationDays?: number[]; // Days before expiry to send notifications
  rejectionReason?: string; // Reason for rejection if document was rejected
  lastAction?: DocumentAction; // Track the last action performed
  isLocked?: boolean; // To prevent editing while in approval process
  lastReviewDate?: string; // When the document was last reviewed
  nextReviewDate?: string; // When the document should be reviewed next
}

export type DocumentAction = 
  | 'created'
  | 'updated'
  | 'submitted_for_approval'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
  | 'expired';

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  createdBy: string;
  createdAt: string;
  changeNotes?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
}

export interface ApprovalRule {
  id: string;
  category: DocumentCategory;
  requiredApprovers: ApproverRole[];
  escalationThresholdDays: number;
  escalationTargets: ApproverRole[];
}

export type ApproverRole = 
  | 'QA Manager'
  | 'Department Head'
  | 'Compliance Officer'
  | 'CEO'
  | 'External Auditor';

export interface DocumentActivity {
  id: string;
  documentId: string;
  action: DocumentAction;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  comments?: string;
}

export interface DocumentNotification {
  id: string;
  documentId: string;
  documentTitle: string;
  type: 'approval_request' | 'approval_overdue' | 'expiry_reminder' | 'approval_complete' | 'document_rejected';
  message: string;
  createdAt: string;
  isRead: boolean;
  targetUserIds: string[];
}

// Document Dashboard Overview Stats
export interface DocumentStats {
  totalDocuments: number;
  pendingApproval: number;
  expiringSoon: number;
  expired: number;
  published: number;
  archived: number;
  byCategory: Record<DocumentCategory, number>;
}
