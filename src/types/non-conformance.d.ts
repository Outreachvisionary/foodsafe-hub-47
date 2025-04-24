
export type NCStatus = 'On Hold' | 'Under Review' | 'Released' | 'Disposed' | 'Approved' | 'Rejected' | 'Resolved' | 'Closed';

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

export type NonConformanceStatus = NCStatus;

export interface NonConformance {
  id: string;
  title: string;
  description: string;
  item_name: string;
  item_category: NCItemCategory;
  reason_category: NCReasonCategory;
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
  capa_id?: string;
  item_id?: string;
  reason_details?: string;
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
  tags?: string[];
  location?: string;
  department?: string;
  priority?: string;
  risk_level?: string;
  capaId?: string;
  category?: string;
  severity?: string;
  source?: string;
}
