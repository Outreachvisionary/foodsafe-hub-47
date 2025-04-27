
export type DocumentStatus = 'Draft' | 'In_Review' | 'Approved' | 'Published' | 'Archived' | 'Rejected' | 'Obsolete' | 'Pending_Review' | 'Pending_Approval' | 'Active' | 'Expired';
export type DocumentCategory = 'SOP' | 'Policy' | 'Form' | 'Certificate' | 'Other' | 'HACCP Plan' | 'Audit Report' | 'Training Material' | 'Supplier Documentation' | 'Risk Assessment';
export type CheckoutStatus = 'Available' | 'Checked_Out';

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
  description: string;
  file_name: string;
  file_path?: string;
  file_type: string;
  file_size: number;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  folder_id?: string;
  tags?: string[];
  approvers?: string[];
  linked_module?: string;
  linked_item_id?: string;
  rejection_reason?: string;
  is_locked: boolean;
  last_action?: string;
  last_review_date?: string;
  next_review_date?: string;
  pending_since?: string;
  current_version_id?: string;
  is_template: boolean;
  checkout_status: CheckoutStatus;
  checkout_timestamp?: string;
  checkout_user_id?: string;
  checkout_user_name?: string;
  workflow_status?: string;
  custom_notification_days?: number[];
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at: string;
  editor_metadata: Record<string, any>;
  is_binary_file: boolean;
  version_type: 'major' | 'minor';
  change_summary?: string;
  change_notes?: string;
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
  diff_data?: Record<string, any>;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  action: DocumentActionType;
  comments?: string;
  version_id?: string;
  checkout_action?: string;
}

export interface DocumentFilter {
  searchTerm?: string;
  status?: DocumentStatus | DocumentStatus[];
  category?: DocumentCategory | DocumentCategory[];
  tag?: string;
  ownedByMe?: boolean;
  reviewer?: boolean;
  dateRange?: {
    start?: string;
    end?: string;
  };
  sortBy?: 'title' | 'updated_at' | 'created_at' | 'status';
  sortDirection?: 'asc' | 'desc';
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

export interface DocumentListProps {
  documents: Document[];
  showStatus?: boolean;
  onSelect?: (document: Document) => void;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description: string;
  required_approvals: number;
  approvers: string[];
}

export type ComplaintStatus = 'New' | 'Under_Investigation' | 'Resolved' | 'Closed' | 'Reopened';
export type ComplaintCategory = 'Product_Quality' | 'Food_Safety' | 'Packaging' | 'Delivery' | 'Service' | 'Other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: string;
  reported_date: string;
  resolution_date?: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
  resolution_details?: string;
}
