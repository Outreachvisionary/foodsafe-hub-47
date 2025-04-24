
export type DocumentStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Archived' | 'Expired' | 'Rejected' | 'Active' | 'Pending Review';

export type DocumentCategory = 'SOP' | 'Policy' | 'Protocol' | 'Record' | 'Form' | 'Template' | 'Training' | 'Report' | 'Manual' | 'Contract' | 'Certificate' | 'Other' | 'HACCP Plan' | 'Audit Report' | 'Training Material' | 'Supplier Documentation' | 'Risk Assessment';

export type DocumentActionType = 
  | 'created'
  | 'updated'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
  | 'expired'
  | 'checked_out'
  | 'checked_in'
  | 'downloaded'
  | 'viewed'
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
  file_size: number;
  file_path?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  tags?: string[];
  approvers?: string[];
  linked_module?: string;
  linked_item_id?: string;
  last_review_date?: string;
  next_review_date?: string;
  checkout_status?: 'Available' | 'Checked Out';
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  is_template?: boolean;
  is_locked?: boolean;
  folder_id?: string;
  rejection_reason?: string;
  last_action?: string;
  workflow_status?: string;
  current_version_id?: string;
  pending_since?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number?: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at: string;
  is_binary_file?: boolean;
  editor_metadata: Record<string, any>;
  diff_data?: Record<string, any>;
  version_type: 'major' | 'minor';
  change_summary?: string;
  change_notes?: string;
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  timestamp: string;
  action: DocumentActionType;
  user_id: string;
  user_name: string;
  user_role: string;
  version_id?: string;
  comments?: string;
  checkout_action?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description?: string;
  approvers: string[];
  required_approvals: number;
  is_final: boolean;
}

export interface DocumentListProps {
  documents: Document[];
  onSelect?: (document: Document) => void;
  viewMode?: 'grid' | 'list';
  showStatus?: boolean;
}

export interface DocumentPreviewDialogProps {
  document: Document | null;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
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
  created_at: string;
  updated_at?: string;
  user_id: string;
  user_name: string;
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
