
export type NCStatus = 'On Hold' | 'Under Review' | 'Released' | 'Disposed';

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
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
  status: NCStatus;
  reported_date: string;
  review_date?: string;
  resolution_date?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  reviewer?: string;
  location?: string;
  department?: string;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  risk_level?: 'High' | 'Medium' | 'Low';
  capa_id?: string;
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
}

export interface NCAttachment {
  id: string;
  non_conformance_id: string;
  file_name: string;
  file_path: string; // Ensuring this field is required
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
