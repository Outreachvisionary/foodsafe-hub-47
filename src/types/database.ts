
// Custom type definitions for database entities
// These types should match the schema we created in Supabase

export type DocumentStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Archived' | 'Expired';

export type DocumentCategory = 'SOP' | 'Policy' | 'Form' | 'Certificate' | 'Audit Report' | 'HACCP Plan' | 'Training Material' | 'Supplier Documentation' | 'Risk Assessment' | 'Other';

export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';

export interface Folder {
  id: string;
  name: string;
  parent_id?: string;
  path: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  document_count?: number;
}

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
  created_at?: string;
  updated_at?: string;
  expiry_date?: string;
  folder_id?: string;
  linked_module?: string;
  linked_item_id?: string;
  tags?: string[];
  approvers?: string[];
  pending_since?: string;
  custom_notification_days?: number[];
  rejection_reason?: string;
  last_action?: string;
  is_locked?: boolean;
  last_review_date?: string;
  next_review_date?: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: string;
  assigned_to: string[];
  department?: string;
  start_date?: string;
  due_date?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  materials_id?: string[];
  required_roles?: string[];
  completion_status?: TrainingStatus;
  training_category?: string;
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
  last_recurrence?: string;
  next_recurrence?: string;
}
