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
  is_locked?: boolean;
  current_version_id?: string;
  pending_since?: string;
  last_action?: string;
  rejection_reason?: string;
  workflow_status?: string;
  checkout_user_name?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  version_id?: string;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  action: DocumentActionType;
  checkout_action?: string;
  comments?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  version?: number; // Adding both version and version_number for compatibility
  file_name: string;
  file_size: number;
  created_by: string;
  created_at: string;
  change_summary?: string;
  change_notes?: string;
  check_in_comment?: string;
  modified_by?: string;
  modified_by_name?: string;
  version_type?: string;
  editor_metadata?: any;
  file_type?: string;
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

export interface DocumentNotification {
  id: string;
  type: 'approval_request' | 'approval_complete' | 'approval_overdue' | 'expiry_reminder' | 'version_update' | 'comment_added';
  document_id: string;
  document_title?: string;
  user_id: string;
  created_at: string;
  read: boolean;
  message: string;
  action_url?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description: string;
  approvers: string[];
  required_approvals: number;
  is_final: boolean;
}

// Add Complaint types
export type ComplaintStatus = 
  | 'New' 
  | 'Under_Investigation' 
  | 'Resolved' 
  | 'Closed' 
  | 'Reopened';

export type ComplaintCategory = 
  | 'Product_Quality' 
  | 'Foreign_Material' 
  | 'Allergen' 
  | 'Labeling' 
  | 'Packaging' 
  | 'Service' 
  | 'Delivery' 
  | 'Other';

export type ComplaintPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  reported_date: string;
  resolution_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by: string;
  assigned_to?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  resolution_details?: string;
  capa_id?: string;
}
