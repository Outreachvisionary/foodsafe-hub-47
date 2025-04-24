
export type NCStatus = 
  | 'On Hold' 
  | 'Under Review'
  | 'Released'
  | 'Disposed'
  | 'Approved'
  | 'Rejected'
  | 'Resolved'
  | 'Closed'
  | 'Under Investigation'; // Added this to match code usage

export type NCItemCategory = 
  | 'Processing Equipment'
  | 'Product Storage Tanks'
  | 'Finished Products'
  | 'Raw Products'
  | 'Packaging Materials'
  | 'Finished Product'
  | 'Raw Material'
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

export interface NCStats {
  total: number;
  byStatus: Record<NCStatus, number>;
  byCategory: Record<NCItemCategory, number>;
  byReasonCategory: Record<NCReasonCategory, number>;
  byRiskLevel: Record<NCRiskLevel, number>;
  overdue: number;
  pendingReview: number;
  recentlyResolved: number;
}
