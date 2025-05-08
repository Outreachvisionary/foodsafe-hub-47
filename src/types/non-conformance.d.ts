
export type NonConformanceItemCategory = 
  | 'Equipment' 
  | 'Facility' 
  | 'Finished Product' 
  | 'Raw Material' 
  | 'Packaging Materials' 
  | 'Packaging' 
  | 'Other';

export type NonConformanceReasonCategory = 
  | 'Quality Issue'
  | 'Food Safety'
  | 'Damaged'
  | 'Process Deviation'
  | 'Foreign Material'
  | 'Expired'
  | 'Other';

export type NonConformanceStatus = 
  | 'On Hold'
  | 'Under Investigation'
  | 'Under Review'
  | 'Approved for Use'
  | 'Released'
  | 'Disposed'
  | 'Resolved'
  | 'Closed';

export interface NonConformance {
  id: string;
  title: string;
  description?: string;
  item_name: string;
  item_category: NonConformanceItemCategory | string;
  reason_category: NonConformanceReasonCategory | string;
  status: NonConformanceStatus | string;
  reported_date: string;
  created_at: string;
  updated_at: string;
  review_date?: string | null;
  resolution_date?: string | null;
  created_by: string;
  assigned_to?: string;
  reviewer?: string | null;
  resolution_details?: string | null;
  capa_id?: string | null;
  reason_details?: string;
  location?: string;
  department?: string;
  priority?: string;
  risk_level?: string;
  quantity?: number;
  quantity_on_hold?: number;
  tags?: string[];
  units?: string;
}

export interface NCActivity {
  id: string;
  non_conformance_id: string;
  action: string;
  comments?: string;
  performed_at: string;
  performed_by: string;
  previous_status?: NonConformanceStatus | null;
  new_status?: NonConformanceStatus | null;
}

export interface NCAttachment {
  id: string;
  non_conformance_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size: number;
  description?: string;
  uploaded_at: string;
  uploaded_by: string;
}
