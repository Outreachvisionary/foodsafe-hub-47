
import { DocumentStatus, CheckoutStatus } from '@/types/enums';

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
  file_path: string;
  file_size: number;
  file_type: string;
  category: string;
  status: DocumentStatus;
  version: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  tags?: string[];
  approvers?: string[];
  folders?: string[];
  checkout_status?: CheckoutStatus;
  checkout_by?: string;
  checkout_date?: string;
  folder_id?: string | null;
  department?: string;
  expiry_date?: string;
  effective_date?: string;
  review_date?: string;
  pending_since?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number?: number;
  version_type: 'major' | 'minor';
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
  created_by: string;
  notes?: string;
  changes?: string;
  approval_status?: string;
  approved_by?: string;
  approved_at?: string;
  is_binary_file?: boolean;
  original_file_name?: string;
  modified_by_name?: string;
}

export interface DocumentApproval {
  id: string;
  document_id: string;
  version: number;
  approver_id: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  timestamp: string;
  due_date?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  parent_id?: string;
  created_at: string;
  created_by: string;
  path: string;
  document_count?: number;
  owner?: string;
}

export interface DocumentNotification {
  id: string;
  document_id: string;
  user_id: string;
  type: 'approval' | 'expiry' | 'review' | 'update' | 'publish';
  message: string;
  created_at: string;
  is_read: boolean;
}

export type DocumentSortOption = 'title' | 'created_at' | 'updated_at' | 'category' | 'status';

export interface DocumentFilterOptions {
  status?: DocumentStatus[];
  category?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  tags?: string[];
  departments?: string[];
  owner?: string;
}

export interface DocumentStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byDepartment?: Record<string, number>;
  recentDocuments?: Document[];
  expiringCount?: number;
  pendingReviewCount?: number;
  pendingApprovalCount?: number;
}
