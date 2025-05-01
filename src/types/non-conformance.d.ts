
export type NCStatus = 
  | 'On Hold' 
  | 'Under Review'
  | 'Under Investigation'
  | 'Released'
  | 'Disposed'
  | 'Approved'
  | 'Rejected'
  | 'Resolved'
  | 'Closed';

export type NCItemCategory = 
  | 'Processing Equipment'
  | 'Product Storage Tanks'
  | 'Finished Product'
  | 'Finished Products'
  | 'Raw Products'
  | 'Raw Material'
  | 'Packaging Materials'
  | 'Packaging Material'
  | 'Equipment'
  | 'Facility'
  | 'Personnel'
  | 'Other';

export type NCReasonCategory = 
  | 'Contamination'
  | 'Quality Issues'
  | 'Quality Issue'
  | 'Regulatory Non-Compliance'
  | 'Equipment Malfunction'
  | 'Documentation Error'
  | 'Process Deviation'
  | 'Foreign Material'
  | 'Temperature Abuse'
  | 'Packaging Defect'
  | 'Labeling Error'
  | 'Other';

export type NCRiskLevel = 
  | 'Critical'
  | 'Major'
  | 'Minor'
  | 'high'
  | 'moderate' 
  | 'low'
  | 'severe';

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
  created_at: string;
  updated_at: string;
  reported_date: string;
  review_date?: string;
  resolution_date?: string;
  created_by: string;
  assigned_to?: string;
  reviewer?: string;
  resolution_details?: string;
  capa_id?: string;
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
  tags?: string[];
  location?: string;
  department?: string;
  priority?: string;
  risk_level?: NCRiskLevel;
  category?: string;
  severity?: string;
  source?: string;
}

export interface NCActivity {
  id: string;
  non_conformance_id: string;
  action: string;
  performed_by: string;
  performed_at: string;
  previous_status?: NCStatus;
  new_status?: NCStatus;
  comments?: string;
}

export interface NCFilter {
  status?: NCStatus[];
  item_category?: NCItemCategory[];
  reason_category?: NCReasonCategory[];
  date_range?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

// Add the NCStats interface
export interface NCStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byReasonCategory: Record<string, number>;
  byRiskLevel: Record<string, number>;
  overdue: number;
  pendingReview: number;
  recentlyResolved: number;
  totalQuantityOnHold?: number;
  byReason?: Record<string, number>;
  recentItems?: NonConformance[];
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

export interface NCDetailsProps {
  id: string;
  onClose?: () => void;
}
