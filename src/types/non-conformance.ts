
// Types for Non-Conformance Module

export type NCStatus = 
  | 'On Hold' 
  | 'Under Review' 
  | 'Released' 
  | 'Disposed'
  | 'Approved'
  | 'Rejected'
  | 'Resolved'
  | 'Closed';

export type NCItemCategory = 
  | 'Processing Equipment' 
  | 'Product Storage Tanks'
  | 'Finished Products' 
  | 'Raw Products' 
  | 'Packaging Materials' 
  | 'Other';

export type NCReasonCategory = 
  | 'Contamination' 
  | 'Quality Issues' 
  | 'Regulatory Non-Compliance' 
  | 'Equipment Malfunction' 
  | 'Documentation Error' 
  | 'Process Deviation' 
  | 'Other';

export interface NonConformance {
  id: string;
  title: string;
  description?: string;
  item_name: string;
  item_id?: string;
  item_category: NCItemCategory;
  reason_category: NCReasonCategory;
  reason_details?: string;
  status: NCStatus;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  reported_date: string;
  review_date?: string;
  resolution_date?: string;
  assigned_to?: string;
  reviewer?: string;
  resolution_details?: string;
  capa_id?: string;
  location?: string;
  department?: string;
  priority?: string;
  risk_level?: string;
  tags?: string[];
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
}

export interface NCAttachment {
  id: string;
  non_conformance_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  description?: string;
  uploaded_by: string;
  uploaded_at?: string;
}

export interface NCActivity {
  id: string;
  non_conformance_id: string;
  action: string;
  comments?: string;
  performed_by: string;
  performed_at?: string;
  previous_status?: NCStatus;
  new_status?: NCStatus;
}

export interface NCNotification {
  id: string;
  non_conformance_id: string;
  message: string;
  notification_type: string;
  target_users?: string[];
  is_read: boolean;
  created_at?: string;
}

export interface NCStats {
  total: number;
  totalQuantityOnHold?: number;
  byStatus: Record<NCStatus, number>;
  byCategory: Record<NCItemCategory, number>;
  byReason: Record<NCReasonCategory, number>;
  recentItems: NonConformance[];
}

export interface NCFilter {
  status?: NCStatus[];
  item_category?: NCItemCategory[];
  reason_category?: NCReasonCategory[];
  date_range?: {
    start?: string;
    end?: string;
  };
  assigned_to?: string;
  location?: string;
  department?: string;
  search?: string;
}
