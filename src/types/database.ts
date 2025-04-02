
// Define the base document status types
export type DocumentStatus = 
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Published'
  | 'Archived'
  | 'Expired';

// Define the base document category types
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

// Define basic document structure for use in database interactions
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
  created_by: string;
  created_at?: string;
  updated_at?: string;
  approved_by?: string;
  approved_at?: string;
  expiry_date?: string;
  is_locked: boolean;
  rejection_reason?: string;
  last_action?: string;
  tags?: string[];
  approval_status?: 'pending' | 'approved' | 'rejected';
  is_expired?: boolean;
  is_checked_out?: boolean;
  checkout_user_id?: string;
  checkout_timestamp?: string;
  pending_since?: string;
  
  // Added missing properties
  folder_id?: string;
  versions?: DocumentVersion[];
  activity?: DocumentActivity[];
  approvers?: string[];
  custom_notification_days?: number[];
}

// Define the Folder interface
export interface Folder {
  id: string;
  name: string;
  path: string;
  parent_id?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  document_count?: number;
}

// Define the DocumentComment interface
export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

// Define document version interface
export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_size: number;
  file_type?: string;
  created_by: string;
  created_at?: string;
  change_notes?: string;
  editor_metadata?: any;
}

// Define document activity interface
export interface DocumentActivity {
  id: string;
  document_id: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'submit' | 'view' | 'download';
  user_id: string;
  user_name?: string;
  user_role?: string;
  timestamp: string;
  comments?: string;
  metadata?: any;
}
