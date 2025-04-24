
export type NCStatus = 'On Hold' | 'Under Review' | 'Released' | 'Disposed' | 'Approved' | 'Rejected' | 'Resolved' | 'Closed' | 'Under Investigation';

export type NCItemCategory = 'Raw Material' | 'Ingredient' | 'Packaging' | 'In-Process Product' | 'Finished Product' | 'Equipment' | 'Facility' | 'Other' | 'Packaged Goods';

export type NCReasonCategory = 'Quality Issue' | 'Food Safety' | 'Damaged' | 'Expired' | 'Process Deviation' | 'Documentation Issue' | 'Customer Complaint' | 'Foreign Material' | 'Other';

export type NCRiskLevel = 'low' | 'moderate' | 'high' | 'severe' | 'Critical' | 'Major';

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
  reported_date: string;
  review_date?: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  reviewer?: string;
  resolution_details?: string;
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
  location?: string;
  department?: string;
  capa_id?: string;
  tags?: string[];
  priority?: string;
  risk_level?: NCRiskLevel;
  severity?: string;
  source?: string;
  category?: string;
}

export interface NCActivity {
  id: string;
  non_conformance_id: string;
  performed_at: string;
  action: string;
  comments?: string;
  performed_by: string;
  previous_status?: NCStatus;
  new_status?: NCStatus;
}

export interface NCNotification {
  id: string;
  non_conformance_id: string;
  message: string;
  notification_type: string;
  created_at: string;
  is_read: boolean;
  target_users?: string[];
}

export interface NCAttachment {
  id: string;
  non_conformance_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface NCFilter {
  status?: NCStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: NCItemCategory[];
  reasons?: NCReasonCategory[];
  assignedTo?: string[];
  searchTerm?: string;
  riskLevels?: NCRiskLevel[];
}

export interface NCDetailsProps {
  id: string;
  onClose?: () => void;
}
