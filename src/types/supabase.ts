
// Custom type definitions for Supabase tables
// These types are separate from the auto-generated types

export interface Folder {
  id: string;
  name: string;
  parent_id?: string;
  path: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  document_count: number;
}

export interface DocumentCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

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
  category_id?: string;
  status: DocumentStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  linked_module?: string;
  linked_item_id?: string;
  folder_id?: string;
  tags?: string[];
  approvers?: string[];
  pending_since?: string;
  last_action?: string;
  is_locked?: boolean;
  last_review_date?: string;
  next_review_date?: string;
  rejection_reason?: string;
}

export interface DocumentActivity {
  id: string;
  document_id?: string;
  action: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_role: string;
  comments?: string;
}

export interface DocumentNotification {
  id: string;
  document_id?: string;
  document_title: string;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  target_user_ids?: string[];
}

export interface DocumentVersion {
  id: string;
  document_id?: string;
  version: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at: string;
  change_notes?: string;
}
