
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
  | 'Pending Review'
  | 'Approved'
  | 'Active'
  | 'Archived'
  | 'Rejected'
  | 'Expired'
  | 'Pending_Review'; // Added to match code usage

export type DocumentActionType = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'download'
  | 'archive'
  | 'restore'
  | 'edit' // Added to match code usage
  | 'check_in'
  | 'check_out';

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
  created_at: string;
  created_by: string;
  updated_at: string;
  tags?: string[];
  approvers?: string[];
  folder_id?: string;
  expiry_date?: string;
  pending_since?: string;
  checkout_status?: string;
  checkout_user_id?: string;
  checkout_user_name?: string;
  workflow_status?: string;
  next_review_date?: string;
  last_review_date?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number?: number;
  file_name: string;
  file_size: number;
  created_at: string;
  created_by: string;
  version_type: "major" | "minor" | string; // Modified to accept string to match usage
  change_notes?: string; // Added to match usage
  change_summary?: string; // Added to match usage
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string; // Changed from documentId to document_id
  action: DocumentActionType;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  comments?: string;
  version_id?: string;
  checkout_action?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description: string;
  required_approvals: number;
  approvers: string[];
}

export interface DocumentListProps {
  documents: Document[];
  showStatus?: boolean; // Added to match usage
  onSelect?: (document: Document) => void;
  selectedId?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  reported_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  status: ComplaintStatus;
  category: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  priority?: string;
  resolution_date?: string;
  resolution_details?: string;
  capa_id?: string;
}

export type ComplaintStatus = 
  | 'New'
  | 'Under_Investigation'
  | 'Resolved'
  | 'Closed'
  | 'Reopened';
