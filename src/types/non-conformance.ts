
import { NCStatus, NCActivity, NCAttachment, NCStats } from '@/services/nonConformanceService';

export type { NCStatus, NCActivity, NCAttachment, NCStats };

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
  | 'Other';

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
}

export type NCFormData = Omit<NonConformance, 'id' | 'created_at' | 'updated_at'>;
