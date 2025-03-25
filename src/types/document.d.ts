
export type DocumentStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Archived' | 'Expired';

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

export interface Document {
  id: string;
  title: string;
  file_name: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  linked_module?: string;
  tags?: string[];
  description?: string;
  is_locked?: boolean;
  pending_since?: string;
  custom_notification_days?: number[];
  rejection_reason?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_name: string;
  file_size: number;
  file_path: string;
  created_by: string;
  created_at: string;
  change_summary?: string;
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

export interface DocumentActivity {
  id: string;
  documentId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details?: string;
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

export interface DocumentWorkflow {
  id: string;
  name: string;
  steps: DocumentWorkflowStep[];
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DocumentWorkflowStep {
  step_number: number;
  role: string;
  action: string;
  description?: string;
}

export interface DocumentWorkflowInstance {
  id: string;
  document_id: string;
  workflow_id: string;
  current_step: number;
  status: 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DocumentAccess {
  id: string;
  document_id: string;
  user_id?: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
  granted_at: string;
}

export interface DocumentPreview {
  id: string;
  document_id: string;
  preview_type: string;
  content?: string;
  thumbnail_path?: string;
  created_at: string;
  version_id?: string;
}

export interface DocumentAttachment {
  id: string;
  document_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
  description?: string;
}
