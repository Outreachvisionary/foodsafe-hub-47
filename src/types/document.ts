
export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  checkout_status: CheckoutStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  folder_id?: string;
  linked_module?: string;
  linked_item_id?: string;
  tags?: string[];
  approvers?: string[];
  is_locked?: boolean;
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  workflow_status?: string;
  rejection_reason?: string;
  last_action?: string;
  is_template?: boolean;
  pending_since?: string;
  custom_notification_days?: number[];
  current_version_id?: string;
  last_review_date?: string;
  next_review_date?: string;
}

export type DocumentStatus = 
  | 'Draft'
  | 'Pending_Approval'
  | 'Approved'
  | 'Published'
  | 'Archived'
  | 'Expired'
  | 'Active'
  | 'In_Review'
  | 'Pending_Review'
  | 'Rejected'
  | 'Obsolete';

export type DocumentCategory = 
  | 'SOP'
  | 'Policy'
  | 'Form'
  | 'Certificate'
  | 'Audit_Report'
  | 'HACCP_Plan'
  | 'Training_Material'
  | 'Supplier_Documentation'
  | 'Risk_Assessment'
  | 'Other';

export type CheckoutStatus = 'Available' | 'Checked_Out';

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
  file_size: number;
  created_by: string;
  created_at: string;
  change_notes?: string;
  change_summary?: string;
  version_type?: string;
  file_path?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  action: string;
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

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentAccess {
  id: string;
  document_id: string;
  user_id: string;
  permission_level: 'read' | 'write' | 'admin';
  granted_by: string;
  granted_at: string;
  user_role?: string;
}
