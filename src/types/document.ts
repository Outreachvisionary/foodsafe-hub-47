
export type DocumentStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Archived' | 'Expired' | 'Rejected' | 'Active' | 'Pending Review';

export type DocumentCategory = 'SOP' | 'Policy' | 'Protocol' | 'Record' | 'Form' | 'Template' | 'Training' | 'Report' | 'Manual' | 'Contract';

export type DocumentActionType = 
  | 'created'
  | 'updated'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
  | 'expired'
  | 'checked_out'
  | 'checked_in'
  | 'downloaded'
  | 'viewed';

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  tags?: string[];
  approvers?: string[];
  linked_module?: string;
  linked_item_id?: string;
  last_review_date?: string;
  next_review_date?: string;
  checkout_status?: 'Available' | 'Checked Out';
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  is_template?: boolean;
  is_locked?: boolean;
  folder_id?: string;
  rejection_reason?: string;
  last_action?: string;
  workflow_status?: string;
  current_version_id?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number?: number;
  file_name: string;
  file_size: number;
  created_by: string;
  created_at: string;
  is_binary_file?: boolean;
  editor_metadata: Record<string, any>;
  diff_data?: Record<string, any>;
  version_type: 'major' | 'minor';
  change_summary?: string;
  change_notes?: string;
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  timestamp: string;
  action: DocumentActionType;
  user_id: string;
  user_name: string;
  user_role: string;
  version_id?: string;
  comments?: string;
  checkout_action?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  step_number: number;
  action: 'review' | 'approve' | 'publish' | 'notify';
  assignee_type: 'user' | 'role' | 'department';
  assignee_id?: string;
  description?: string;
  is_required: boolean;
}

export interface DocumentListProps {
  documents: Document[];
  onSelect?: (document: Document) => void;
  viewMode?: 'grid' | 'list';
}

export interface DocumentPreviewDialogProps {
  document: Document | null;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}
