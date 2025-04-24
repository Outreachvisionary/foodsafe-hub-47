
export type DocumentActionType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'download'
  | 'approve'
  | 'reject'
  | 'review'
  | 'comment'
  | 'checkout'
  | 'checkin'
  | 'restore'
  | 'archive'
  | 'edit';

export type DocumentStatus = 
  | 'Draft'
  | 'Pending Review'
  | 'Approved'
  | 'Active'
  | 'Archived'
  | 'Rejected'
  | 'Expired'
  | 'Pending Approval'
  | 'Published';

export type DocumentCategory =
  | 'Other'
  | 'SOP'
  | 'Policy'
  | 'Form'
  | 'Certificate'
  | 'Audit Report'
  | 'HACCP Plan'
  | 'Training Material'
  | 'Supplier Documentation'
  | 'Risk Assessment';

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  version: number;
  file_name: string;
  file_size: number;
  created_at: string;
  created_by: string;
  modified_by?: string;
  modified_by_name?: string;
  check_in_comment?: string;
  change_notes?: string;
  change_summary?: string;
  version_type: 'major' | 'minor';
  editor_metadata?: Record<string, any>;
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

export interface DocumentAccess {
  id: string;
  document_id: string;
  user_id: string;
  permission_level: string;
  granted_by: string;
  granted_at: string;
  user_role?: string;
  folder_id?: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  content: string;
  user_id: string;
  user_name: string;
  created_at: string;
  updated_at?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path?: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_at: string;
  updated_at?: string;
  created_by: string;
  expiry_date?: string;
  last_review_date?: string;
  next_review_date?: string;
  tags?: string[];
  approvers?: string[];
  current_version_id?: string;
  is_template?: boolean;
  folder_id?: string;
  linked_module?: string;
  linked_item_id?: string;
  is_locked?: boolean;
  rejection_reason?: string;
  checkout_status?: 'Available' | 'Checked_Out';
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  pending_since?: string;
  last_action?: string;
  workflow_status?: string;
  custom_notification_days?: number[];
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  type: string;
  assignees: string[];
  due_days?: number;
  requires_all_approvers?: boolean;
  notifications?: {
    on_start?: boolean;
    on_complete?: boolean;
    on_overdue?: boolean;
  };
}

// Adding missing types for Complaint & ComplaintStatus
export type ComplaintStatus = 'New' | 'Under Investigation' | 'In Progress' | 'Resolved' | 'Closed' | 'Rejected';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  category: string;
  reported_date: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  capa_id?: string;
  assigned_to?: string;
  created_by: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
}
