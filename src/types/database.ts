
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

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at?: string;
  change_notes?: string;
  editor_metadata?: any;
  is_binary_file?: boolean;
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

// Training types
export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  training_type: string;
  training_category?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  completion_status?: TrainingStatus;
  assigned_to: string[];
  required_roles?: string[];
  materials_id?: string[];
  department?: string;
  is_recurring?: boolean;
  recurring_interval?: number;
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status?: TrainingStatus;
  assigned_date?: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  notes?: string;
  next_recurrence?: string;
  last_recurrence?: string;
}

// Document comment type
export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}
