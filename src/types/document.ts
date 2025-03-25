
// Re-export our database types to maintain compatibility
export type { Document, DocumentCategory, DocumentStatus, Folder } from './database';

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_by: string;
  created_at?: string;
  change_summary?: string;
  storage_path: string;
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

export interface DocumentPreview {
  id: string;
  document_id: string;
  version_id?: string;
  preview_type: string;
  content?: string;
  thumbnail_path?: string;
  created_at?: string;
}

export interface DocumentAccess {
  id: string;
  document_id?: string;
  folder_id?: string;
  user_id?: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
  granted_at?: string;
}

export interface DocumentWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: DocumentWorkflowStep[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description?: string;
  approvers: string[];
  required_approvals: number;
  deadline_days?: number;
  is_final: boolean;
}

export interface DocumentWorkflowInstance {
  id: string;
  document_id: string;
  workflow_id: string;
  current_step: number;
  status: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
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
  requiredApprovers: string[];
  roles: string[];
  escalationThresholdDays: number;
  escalationTargets: string[];
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
  | 'archive'
  | 'checkout'
  | 'checkin'
  | 'revert_version';

// Translation related types
export interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationNamespace {
  id: string;
  name: string;
  description?: string;
}
