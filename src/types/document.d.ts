
// Document Types

export type DocumentStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Published'
  | 'Archived'
  | 'Expired'
  | 'Rejected'
  | 'Active'
  | 'Pending_Review'
  | 'Pending Review';

export type DocumentCategory =
  | 'SOP'
  | 'Manual'
  | 'Policy'
  | 'Form'
  | 'Record'
  | 'Report'
  | 'Training'
  | 'Certificate'
  | 'Other';

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

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_path?: string;
  file_size: number;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  expiry_date?: string;
  folder_id?: string;
  tags?: string[];
  approvers?: string[];
  rejection_reason?: string;
  last_action?: DocumentActionType;
  last_review_date?: string;
  next_review_date?: string;
  is_locked?: boolean;
  is_template?: boolean;
  checkout_status?: 'Available' | 'Checked Out';
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  current_version_id?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_size: number;
  created_at: string;
  created_by: string;
  is_binary_file?: boolean;
  editor_metadata?: any;
  version_type: 'major' | 'minor';
  change_summary?: string;
  change_notes?: string;
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
  diff_data?: any;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  version_id?: string;
  timestamp: string;
  action: DocumentActionType;
  user_id: string;
  user_name: string;
  user_role: string;
  comments?: string;
  checkout_action?: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description?: string;
  assignee_type: 'user' | 'role' | 'department';
  assignee_id?: string;
  assignee_name?: string;
  order: number;
  action_required: 'approval' | 'review' | 'notification';
  due_days?: number;
}

export interface DocumentTemplateData {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  structure: any;
  created_by: string;
  updated_at: string;
}

export interface DocumentListProps {
  documents: Document[];
  showStatus?: boolean;
  onSelect?: (document: Document) => void;
}

// Complaint types
export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  reported_date: string;
  resolution_date?: string;
  created_at: string;
  created_by: string;
  assigned_to?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
}

export type ComplaintStatus =
  | 'New'
  | 'Under_Investigation'
  | 'Resolved'
  | 'Closed'
  | 'Reopened';
