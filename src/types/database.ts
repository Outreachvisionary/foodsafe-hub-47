// Add proper enum types for document categories and statuses
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

export type DocumentStatus = 
  | 'Draft' 
  | 'Pending Approval' 
  | 'Approved' 
  | 'Published' 
  | 'Archived' 
  | 'Expired';

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
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  tags?: string[];
  is_locked?: boolean;
  rejection_reason?: string;
  approvers?: string[];
  linked_module?: string;
  checkout_timestamp?: string;
  is_template?: boolean;
  current_version_id?: string;
  next_review_date?: string;
  last_review_date?: string;
  custom_notification_days?: number[];
  pending_since?: string;
  linked_item_id?: string;
  folder_id?: string;
  workflow_status?: string;
  checkout_user_id?: string;
  last_action?: string;
}

export interface Folder {
  id: string;
  name: string;
  parent_id?: string;
  path: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  document_count?: number;
}

// Other database types...
export type TrainingSession = any;
export type TrainingRecord = any;
