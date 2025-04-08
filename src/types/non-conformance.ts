
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
  | 'Raw Materials' 
  | 'Packaging' 
  | 'Work in Progress' 
  | 'Finished Goods'
  | 'Equipment'
  | 'Facility'
  | 'Process'
  | 'Documentation'
  | 'Personnel'
  | 'Other'
  | 'Processing Equipment'
  | 'Product Storage Tanks'
  | 'Finished Products'
  | 'Raw Products'
  | 'Packaging Materials';

export type NCReasonCategory = 
  | 'Physical Contamination'
  | 'Chemical Contamination'
  | 'Biological Contamination'
  | 'Quality Deviation'
  | 'Specification Failure'
  | 'Process Deviation'
  | 'Documentation Error'
  | 'Labeling Error'
  | 'Supplier Issue'
  | 'Storage Issue'
  | 'Transportation Issue'
  | 'Equipment Failure'
  | 'Personnel Error'
  | 'Foreign Material'
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
  reported_date: string;
  created_by: string;
  department?: string;
  assigned_to?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  risk_level?: 'low' | 'moderate' | 'high' | 'severe';
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
  batch_number?: string;
  lot_number?: string;
  expiry_date?: string;
  supplier_id?: string;
  supplier_name?: string;
  location?: string;
  containment_actions?: string;
  resolution_details?: string;
  resolution_date?: string;
  verified_by?: string;
  verification_date?: string;
  capa_id?: string;
  created_at?: string;
  updated_at?: string;
  review_date?: string;
  reviewer?: string;
  tags?: string[];
}

export type NCFormData = Omit<NonConformance, 'id' | 'created_at' | 'updated_at'>;

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

export interface NCStats {
  total: number;
  totalQuantityOnHold: number;
  byStatus: Record<NCStatus, number>;
  byCategory: Record<string, number>;
  byReason: Record<string, number>;
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
  search?: string;
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
