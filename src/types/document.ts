
// Re-export our database types to maintain compatibility
export type { Document, DocumentCategory, DocumentStatus, Folder } from './database';

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at?: string;
  change_notes?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  action: string;
  timestamp?: string;
  user_id: string;
  user_name: string;
  user_role: string;
  comments?: string;
}

export type ModuleReference = 'none' | 'haccp' | 'training' | 'audits' | 'suppliers' | 'capa' | 'traceability';

// Add missing types that were referenced in other components
export interface DocumentNotification {
  id: string;
  documentId: string;
  documentTitle: string;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  targetUserIds: string[];
}

export interface DocumentStats {
  totalDocuments: number;
  pendingApproval: number;
  expiringSoon: number;
  expired: number;
  published: number;
  archived: number;
  byCategory: Record<string, number>;
}

export interface ApprovalRule {
  id: string;
  name: string;
  requiredApprovers: number;
  roles: string[];
}

export interface ApproverRole {
  id: string;
  name: string;
  canApprove: string[];
}

export type DocumentAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'submit_for_approval'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'archive';
