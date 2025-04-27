export type DocumentStatus = 
  | 'Draft'
  | 'In_Review'
  | 'Pending_Review'
  | 'Pending_Approval'
  | 'Approved'
  | 'Published'
  | 'Archived'
  | 'Rejected'
  | 'Obsolete'
  | 'Active'
  | 'Expired';

export type CheckoutStatus = 'Available' | 'Checked_Out';

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
  category: DocumentCategory;
  status: DocumentStatus;
  file_name: string;
  file_type: string;
  file_size: number;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  checkout_status?: CheckoutStatus;
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  linked_module?: string;
  linked_item_id?: string;
  file_path?: string;
  tags?: string[];
  approvers?: string[];
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_name: string;
  file_size: number;
  created_at: string;
  created_by: string;
  modified_by?: string;
  modified_by_name?: string;
  check_in_comment?: string;
  change_notes?: string;
  change_summary?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  timestamp: string;
  action: string;
  user_id: string;
  user_name: string;
  user_role: string;
  comments?: string;
  checkout_action?: string;
  version_id?: string;
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

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description?: string;
  approvers: string[];
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface DocumentListProps {
  documents: Document[];
  showStatus?: boolean;
  onSelect?: (document: Document) => void;
}
