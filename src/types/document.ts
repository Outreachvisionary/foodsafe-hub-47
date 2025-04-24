// Create or update the document type definitions file
export type DocumentStatus = 'Draft' | 'Pending_Approval' | 'Approved' | 'Rejected' | 'Published' | 'Archived' | string;
export type DocumentCategory = 'SOP' | 'Policy' | 'Work_Instruction' | 'Form' | 'Manual' | 'Record' | string;

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description: string;
  approvers: string[];
  required_approvals: number;
  is_final: boolean;
}

export interface DocumentNotification {
  id: string;
  documentId: string;
  documentTitle: string;
  type: 'approval_request' | 'approval_completed' | 'rejection' | 'comment' | 'expiration_warning' | string;
  message: string;
  createdAt: string;
  isRead: boolean;
  targetUserIds: string[];
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  expiry_date?: string;
  tags?: string[];
  approvers?: string[];
  folder_id?: string;
  linked_module?: string;
  linked_item_id?: string;
  pending_since?: string | null;
  custom_notification_days?: number[];
  is_locked?: boolean;
  last_review_date?: string;
  next_review_date?: string;
  current_version_id?: string;
  is_template?: boolean;
  checkout_status?: 'Available' | 'Checked_Out';
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  current_version?: DocumentVersion;
  file_path?: string;
  rejection_reason?: string;
  last_action?: string;
  workflow_status?: string;
  metadata?: Record<string, any>;
}

// Add missing types for Document components
export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number: number;
  file_size: number;
  created_at: string;
  editor_metadata?: any;
  is_binary_file?: boolean;
  file_name: string;
  created_by: string;
  change_notes?: string;
  change_summary?: string;
  check_in_comment?: string;
  modified_by: string;
  modified_by_name: string;
  version_type: 'major' | 'minor';
  diff_data?: Record<string, any>;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  timestamp: string;
  action: string;
  user_id: string;
  user_name: string;
  user_role: string;
  comments?: string;
}

export interface DocumentAccess {
  id: string;
  document_id: string;
  folder_id?: string;
  granted_at: string;
  user_id: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
}

export interface Folder {
  id: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
  document_count?: number;
  name: string;
  path: string;
  created_by: string;
}

// Document types from database.ts to ensure compatibility
export interface DatabaseDocument {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  expiry_date?: string;
  tags?: string[];
  approvers?: string[];
  folder_id?: string;
  linked_module?: string;
  linked_item_id?: string;
  pending_since?: string | null;
  custom_notification_days?: number[];
  is_locked?: boolean;
  last_review_date?: string;
  next_review_date?: string;
  current_version_id?: string;
  is_template?: boolean;
  checkout_timestamp?: string;
  rejection_reason?: string;
  last_action?: string;
  checkout_user_id?: string;
  workflow_status?: string;
  metadata?: Record<string, any>;
}

export interface DatabaseFolder {
  id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  document_count?: number;
  name: string;
  path: string;
  created_by: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  version_id?: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
  parent_comment_id?: string;
  position_data?: Record<string, any>;
  is_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
}
