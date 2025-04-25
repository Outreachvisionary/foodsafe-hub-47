
// Create this file if it doesn't exist or update if it does
export type CheckoutStatus = 'Available' | 'Checked Out';

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
  created_by: string;
  created_at: string;
  updated_at?: string;
  expiry_date?: string;
  folder_id?: string;
  tags?: string[];
  approvers?: string[];
  linked_module?: string;
  linked_item_id?: string;
  rejection_reason?: string;
  is_locked?: boolean;
  last_action?: string;
  last_review_date?: string;
  next_review_date?: string;
  pending_since?: string;
  current_version_id?: string;
  is_template?: boolean;
  checkout_status?: CheckoutStatus;
  checkout_timestamp?: string;
  checkout_user_id?: string;
  checkout_user_name?: string;
  workflow_status?: string;
}

// Document category type
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

// Document status type  
export type DocumentStatus = 
  | 'Draft' 
  | 'In Review' 
  | 'Approved' 
  | 'Archived' 
  | 'Rejected' 
  | 'Expired' 
  | 'Pending Approval';

// Document version interface
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
  editor_metadata?: Record<string, any>;
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
  action: DocumentActionType;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  comments?: string;
  version_id?: string;
  checkout_action?: string;
}

export type DocumentActionType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'download' 
  | 'share' 
  | 'approve' 
  | 'reject' 
  | 'checkin' 
  | 'checkout';

export interface DocumentAccess {
  id: string;
  document_id: string;
  folder_id?: string;
  user_id?: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
  granted_at: string;
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
