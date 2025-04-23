
// Create or update the document type definitions file
export type DocumentStatus = 'Draft' | 'Pending_Approval' | 'Approved' | 'Rejected' | 'Published' | 'Archived' | string;
export type DocumentCategory = 'SOP' | 'Policy' | 'Work_Instruction' | 'Form' | 'Manual' | 'Record' | string;

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
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  status: DocumentStatus;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  expiry_date?: string;
  tags?: string[];
  approvers?: string[];
  folder_id?: string;
  linked_module?: string;
  linked_item_id?: string;
  pending_since?: string | null;
  custom_notification_days?: number[];
  is_locked?: boolean;
  last_review_date?: string;
  next_review_date?: string;
  current_version_id?: string;
  is_template?: boolean;
  checkout_timestamp?: string;
  rejection_reason?: string;
  last_action?: string;
  checkout_user_id?: string;
  workflow_status?: string;
  metadata?: Record<string, any>;
}
