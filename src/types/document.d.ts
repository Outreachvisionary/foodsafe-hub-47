
export type DocumentStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected' | 'Archived' | 'Expired';

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
  description?: string;
  file_name: string;
  file_path?: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  current_version_id?: string;
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
  
  // Adding missing properties
  approval_status?: 'pending' | 'approved' | 'rejected';
  is_expired?: boolean;
  is_checked_out?: boolean;
  checkout_user_id?: string;
  checkout_timestamp?: string;
  versions?: DocumentVersion[];
  activity?: DocumentActivity[];
  pending_since?: string;
  approvers?: string[];
  workflow_status?: string;
  metadata?: Record<string, any>;
}

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

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentSearchFilters {
  categories?: DocumentCategory[];
  status?: DocumentStatus[];
  createdStart?: string;
  createdEnd?: string;
  updatedStart?: string;
  updatedEnd?: string;
  expiryStart?: string;
  expiryEnd?: string;
  createdBy?: string[];
  approvedBy?: string[];
  tags?: string[];
  searchTerm?: string;
}

export interface DocumentNotification {
  id: string;
  type: 'approval_request' | 'approval_complete' | 'approval_overdue' | 'expiry_reminder' | 'version_update' | 'comment_added';
  document_id: string;
  document_title?: string;
  user_id: string;
  created_at: string;
  read: boolean;
  message: string;
  action_url?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description?: string;
  approvers: string[];
  required_approvals: number;
  deadline_days?: number;
  is_final: boolean;
}
