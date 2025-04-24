
export type DocumentCategory = 
  | 'Other' 
  | 'SOP' 
  | 'Policy' 
  | 'Form' 
  | 'Certificate' 
  | 'Audit Report' 
  | 'HACCP Plan' 
  | 'Training Material' 
  | 'Supplier Documentation' 
  | 'Risk Assessment';

export type DocumentStatus = 
  | 'Draft'
  | 'Pending Review'
  | 'Approved'
  | 'Active'
  | 'Archived'
  | 'Rejected'
  | 'Expired';

export type DocumentPermission = 
  | 'view'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'share';

export type DocumentActionType = 
  | 'view'
  | 'download'
  | 'submit'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'edit';

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path?: string;
  file_size: number;
  file_type: string;
  category: string;
  status: string;
  version: number;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  expiry_date?: string;
  folder_id?: string;
  linked_item_id?: string;
  tags?: string[];
  approvers?: string[];
  checkout_status?: string;
  checkout_user_id?: string;
  next_review_date?: string;
  last_review_date?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  version_id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: DocumentActionType;
  checkout_action: string;
  timestamp: string;
  comments: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at: string;
  change_summary?: string;
  change_notes?: string;
}
