
// Use the database schema types directly to avoid conflicts
export type DocumentStatus = 
  | 'Draft'
  | 'Pending_Review'
  | 'Pending_Approval'
  | 'Approved'
  | 'Published'
  | 'Rejected'
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

export type CheckoutStatus = 
  | 'Available'
  | 'Checked_Out';

export type DocumentActionType = 
  | 'created'
  | 'updated' 
  | 'deleted'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
  | 'checkout'
  | 'checkin'
  | 'download'
  | 'view'
  | 'edit'
  | 'archive';

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path?: string;
  file_type: string;
  file_size: number;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  expiry_date?: string;
  folder_id?: string;
  linked_module?: string;
  linked_item_id?: string;
  tags?: string[];
  approvers?: string[];
  rejection_reason?: string;
  last_action?: string;
  pending_since?: string;
  custom_notification_days?: number[];
  is_locked?: boolean;
  last_review_date?: string;
  next_review_date?: string;
  current_version_id?: string;
  is_template?: boolean;
  checkout_status?: CheckoutStatus;
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  workflow_status?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  path: string;
  parent_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  organization_id?: string;
  is_system_folder?: boolean;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
  created_by: string;
  change_notes?: string;
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
  version_type?: string;
  change_summary?: string;
  editor_metadata?: any;
  is_binary_file?: boolean;
  version_number?: number;
  diff_data?: any;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  action: DocumentActionType;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  comments?: string;
  version_id?: string;
  checkout_action?: string;
}

export interface DocumentStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  expiringCount: number;
  pendingReviewCount: number;
  pendingApprovalCount: number;
}

export interface DocumentAccess {
  id: string;
  document_id: string;
  user_id: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
  granted_at: string;
  folder_id?: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}
