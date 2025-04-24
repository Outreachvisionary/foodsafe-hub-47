
import { User } from './user';

export type DocumentCategory = 
  | 'SOP'
  | 'Policy' 
  | 'Procedure' 
  | 'Work_Instruction' 
  | 'Form' 
  | 'Manual' 
  | 'Record'
  | 'Training_Material'
  | 'Other';

export type DocumentStatus = 
  | 'Draft'
  | 'Pending_Review'
  | 'Pending_Approval'
  | 'Approved'
  | 'Active'
  | 'Archived'
  | 'Rejected'
  | 'Expired'
  | 'Published';

export type DocumentActionType = 
  | 'create'
  | 'view'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'archive'
  | 'publish'
  | 'checkout'
  | 'checkin'
  | 'review'
  | 'comment';

export type CheckoutStatus = 
  | 'Available'
  | 'Checked_Out'
  | 'Locked';

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
  created_at: string;
  updated_at: string;
  created_by: string;
  folder_id?: string;
  tags?: string[];
  expiry_date?: string;
  approvers?: string[];
  linked_module?: string;
  linked_item_id?: string;
  rejection_reason?: string;
  last_action?: string;
  pending_since?: string;
  is_template?: boolean;
  last_review_date?: string;
  next_review_date?: string;
  current_version_id?: string;
  checkout_status?: CheckoutStatus;
  checkout_user_id?: string;
  checkout_user_name?: string;
  checkout_timestamp?: string;
  workflow_status?: string;
  custom_notification_days?: number[];
  is_locked?: boolean;
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
  modified_by?: string;
  modified_by_name?: string;
  version_type: "major" | "minor";
  editor_metadata?: any;
  is_binary_file?: boolean;
  diff_data?: any;
  check_in_comment?: string;
  change_summary?: string;
  change_notes?: string;
}

export interface DocumentActivity {
  id: string;
  document_id: string;
  version_id?: string;
  action: DocumentActionType;
  checkout_action?: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_role: string;
  comments?: string;
}

export interface DocumentWorkflowStep {
  id: string;
  name: string;
  description?: string;
  approvers: string[];
  required_approvals: number;
  order: number;
}

export type ComplaintStatus = 
  | 'New'
  | 'Under_Investigation'
  | 'Resolved'
  | 'Closed'
  | 'Reopened';

export type ComplaintCategory =
  | 'Product_Quality'
  | 'Food_Safety'
  | 'Packaging'
  | 'Labeling'
  | 'Foreign_Material'
  | 'Customer_Service'
  | 'Documentation'
  | 'Other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  reported_date: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  customer_name?: string;
  customer_contact?: string;
  product_involved?: string;
  lot_number?: string;
  capa_id?: string;
}

export interface DocumentListProps {
  documents: Document[];
  showStatus?: boolean;
  onSelect?: (document: Document) => void;
}
