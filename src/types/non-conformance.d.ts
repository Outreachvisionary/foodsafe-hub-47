
// Define status types for non-conformances
export type NCStatus = 'On Hold' | 'Under Review' | 'Released' | 'Disposed';

// Define categories for items
export type NCItemCategory = 
  | 'Processing Equipment' 
  | 'Product Storage Tanks' 
  | 'Finished Products' 
  | 'Raw Products' 
  | 'Packaging Materials' 
  | 'Other';

// Define categories for non-conformance reasons
export type NCReasonCategory = 
  | 'Contamination' 
  | 'Quality Issues' 
  | 'Regulatory Non-Compliance' 
  | 'Equipment Malfunction' 
  | 'Documentation Error' 
  | 'Process Deviation' 
  | 'Other';

// Main Non-Conformance interface
export interface NonConformance {
  id: string;
  title: string;
  description?: string;
  status: NCStatus;
  item_name: string;
  item_id?: string;
  item_category: NCItemCategory;
  reason_category: NCReasonCategory;
  reason_details?: string;
  quantity?: number;
  quantity_on_hold?: number;
  reported_date: string;
  created_by: string;
  reviewer?: string;
  assigned_to?: string;
  department?: string;
  location?: string;
  priority?: string;
  risk_level?: string;
  review_date?: string;
  resolution_date?: string;
  resolution_details?: string;
  tags?: string[];
  capa_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for activity records
export interface NCActivity {
  id: string;
  non_conformance_id: string;
  action: string;
  comments?: string;
  performed_by: string;
  performed_at: string;
  previous_status?: NCStatus;
  new_status?: NCStatus;
}

// Interface for attachment records
export interface NCAttachment {
  id: string;
  non_conformance_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  description?: string;
  uploaded_by: string;
  uploaded_at: string;
}

// Interface for filtering non-conformances
export interface NCFilter {
  status?: NCStatus[];
  itemCategory?: NCItemCategory[];
  reasonCategory?: NCReasonCategory[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  assignedTo?: string[];
  searchQuery?: string;
}

// Interface for non-conformance statistics
export interface NCStats {
  total: number;
  totalQuantityOnHold: number;
  byStatus: Record<NCStatus, number>;
  byCategory: Record<string, number>;
  byReason: Record<string, number>;
  recentItems: NonConformance[];
}

// Interface for non-conformance notifications
export interface NCNotification {
  id: string;
  non_conformance_id: string;
  message: string;
  notification_type: string;
  created_at: string;
  is_read: boolean;
  target_users?: string[];
}
