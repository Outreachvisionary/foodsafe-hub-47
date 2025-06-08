
export type DocumentStatus = 'Draft' | 'Under Review' | 'Approved' | 'Rejected' | 'Archived' | 'Expired';
export type DocumentCategory = 'SOP' | 'Policy' | 'Form' | 'Certificate' | 'Audit Report' | 'HACCP Plan' | 'Training Material' | 'Supplier Documentation' | 'Risk Assessment' | 'Other';
export type CheckoutStatus = 'Available' | 'Checked_Out';

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
  updated_at: string;
  expiry_date?: string;
  folder_id?: string;
  tags?: string[];
  approvers?: string[];
  checkout_status?: CheckoutStatus;
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  is_locked?: boolean;
  last_review_date?: string;
  next_review_date?: string;
  current_version_id?: string;
  is_template?: boolean;
  linked_module?: string;
  linked_item_id?: string;
  workflow_status?: string;
  rejection_reason?: string;
  last_action?: string;
  pending_since?: string;
  custom_notification_days?: number[];
}

export interface CreateDocumentRequest {
  title: string;
  description?: string;
  file_name: string;
  file_path?: string;
  file_type: string;
  file_size: number;
  category: DocumentCategory;
  created_by: string;
  folder_id?: string;
  tags?: string[];
  approvers?: string[];
  expiry_date?: string;
  is_template?: boolean;
  linked_module?: string;
  linked_item_id?: string;
}

export interface UpdateDocumentRequest {
  id: string;
  title?: string;
  description?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  tags?: string[];
  approvers?: string[];
  expiry_date?: string;
  folder_id?: string;
  workflow_status?: string;
  rejection_reason?: string;
  last_action?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at: string;
  change_notes?: string;
  version_type?: string;
  change_summary?: string;
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
  version_number?: number;
  diff_data?: any;
  editor_metadata?: any;
  is_binary_file?: boolean;
}

export interface DocumentFilter {
  status?: DocumentStatus | DocumentStatus[];
  category?: DocumentCategory | DocumentCategory[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  folder_id?: string;
  created_by?: string;
  tags?: string[];
}

export interface DocumentListProps {
  documents: Document[];
  onDocumentClick?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
}
