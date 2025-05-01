
import { DocumentStatus, CheckoutStatus } from '@/types/enums';

export { DocumentStatus, CheckoutStatus };

export interface Document {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_path: string;
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
  checkout_status?: CheckoutStatus;
  checkout_by?: string;
  checkout_date?: string;
  pending_since?: string;
  department?: string;
  next_review_date?: string;
  checkout_user_id?: string;
  checkout_user_name?: string;
  file_path?: string;
}

export type DocumentCategory = 
  | 'Policy' 
  | 'Form' 
  | 'Training Material' 
  | 'Other' 
  | 'SOP' 
  | 'Certificate' 
  | 'Audit Report' 
  | 'HACCP Plan' 
  | 'Supplier Documentation' 
  | 'Risk Assessment';

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number: number;
  file_name: string;
  file_path: string;
  file_size: number;
  created_by: string;
  created_at: string;
  is_binary_file: boolean;
  version_type: "major" | "minor";
  change_summary?: string;
  change_notes?: string;
  modified_by_name?: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  content: string;
  user_id: string;
  user_name: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentAccess {
  id: string;
  document_id: string;
  user_id: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
  granted_at: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  version_id?: string;
  action: DocumentActionType;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  comments?: string;
  checkout_action?: string;
}

export type DocumentActionType = 'view' | 'download' | 'edit' | 'delete' | 'archive' | 'restore' | 'share' | 'approve' | 'reject' | 'publish' | 'unpublish' | 'comment' | 'checkout' | 'checkin';

export interface DocumentFolder {
  id: string;
  name: string;
  path: string;
  parent_id?: string;
  document_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentFilter {
  category?: DocumentCategory | DocumentCategory[];
  status?: DocumentStatus | DocumentStatus[];
  createdBy?: string;
  createdAfter?: string;
  createdBefore?: string;
  expiringBefore?: string;
  searchTerm?: string;
  folder_id?: string;
  tags?: string[];
}
