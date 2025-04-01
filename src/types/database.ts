
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

// Define the Document type
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
  linked_module?: string;
  linked_item_id?: string;
  tags?: string[];
  approvers?: string[];
  pending_since?: string;
  custom_notification_days?: number[];
  rejection_reason?: string;
  last_action?: string;
  is_locked: boolean;
  last_review_date?: string;
  next_review_date?: string;
  folder_id?: string | null;
  current_version_id?: string;
  is_template?: boolean;
  checkout_user_id?: string;
  checkout_timestamp?: string;
  workflow_status?: string;
}

// Define the Folder type
export interface Folder {
  id: string;
  name: string;
  parent_id?: string | null;
  path?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  document_count?: number;
}

// Define the training status types
export type TrainingStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Overdue';

// Define the TrainingRecord type
export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date?: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  notes?: string;
}

// Define the TrainingSession type
export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: string;
  training_category?: string;
  department?: string;
  start_date?: string;
  due_date?: string;
  assigned_to: string[];
  materials_id?: string[];
  required_roles?: string[];
  completion_status?: TrainingStatus;
  is_recurring?: boolean;
  recurring_interval?: number;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

// Define DocumentComment type
export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}
