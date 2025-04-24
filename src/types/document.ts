
// Create or update the document type definitions file
export type DocumentStatus = 'Draft' | 'Pending_Approval' | 'Approved' | 'Rejected' | 'Published' | 'Archived' | string;
export type DocumentCategory = 'SOP' | 'Policy' | 'Form' | 'Certificate' | 'Audit Report' | 'HACCP Plan' | 'Training Material' | 'Supplier Documentation' | 'Risk Assessment' | 'Other' | string;
export type CheckoutStatus = 'Available' | 'Checked_Out' | string;
export type ComplaintStatus = 'New' | 'Under_Investigation' | 'Resolved' | 'Closed' | 'Reopened' | string;

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description: string;
  approvers: string[];
  required_approvals: number;
  is_final: boolean;
}

export interface DocumentNotification {
  id: string;
  documentId: string;
  documentTitle: string;
  type: 'approval_request' | 'approval_completed' | 'rejection' | 'comment' | 'expiration_warning' | string;
  message: string;
  createdAt: string;
  isRead: boolean;
  targetUserIds: string[];
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path?: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  current_version_id?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  approved_by?: string;
  approved_at?: string;
  expiry_date?: string;
  is_locked: boolean;
  rejection_reason?: string;
  last_action?: string;
  tags?: string[];
  folder_id?: string;
  checkout_status?: CheckoutStatus;
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  workflow_status?: string;
  approvers?: string[];
  last_review_date?: string;
  next_review_date?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  version_number?: number;
  file_name: string;
  file_size: number;
  file_type?: string;
  created_by: string;
  created_at?: string;
  modified_by?: string;
  modified_by_name?: string;
  change_notes?: string;
  check_in_comment?: string;
  version_type?: string;
  editor_metadata?: any;
  change_summary?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'submit' | 'view' | 'download' | 'edit';
  user_id: string;
  user_name?: string;
  user_role?: string;
  timestamp: string;
  comments?: string;
  metadata?: any;
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

export interface DocumentAccess {
  id: string;
  document_id: string;
  user_id: string;
  user_role?: string;
  permission_level: string;
  granted_by: string;
  granted_at: string;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  parent_id?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  document_count?: number;
}

export interface DocumentSearchFilters {
  categories?: DocumentCategory[];
  status?: DocumentStatus[];
  createdStart?: string;
  createdEnd?: string;
  updatedStart?: string;
  updatedEnd?: string;
  expiryStart?: string;
  expiryEnd?: string;
  createdBy?: string[];
  approvedBy?: string[];
  tags?: string[];
  searchTerm?: string;
}

export interface CAPARelatedDocument {
  id: string;
  capa_id: string;
  document_id: string;
  document_title: string;
  document_type: string;
  added_at: string;
  added_by: string;
}

export interface CAPARelatedTraining {
  id: string;
  capa_id: string;
  training_id: string;
  training_title: string;
  training_type: string;
  added_at: string;
  added_by: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: string;
  reported_date: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  created_by: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  resolution_details?: string;
}
