
export enum NCStatus {
  Draft = 'Draft',
  Open = 'Open',
  InProgress = 'In_Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
  OnHold = 'On_Hold',
  Reopened = 'Reopened',
  Released = 'Released',
  Disposed = 'Disposed',
  UnderReview = 'Under_Review'
}

export enum NCRiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum NCCategory {
  Equipment = 'Equipment',
  Process = 'Process',
  Material = 'Material',
  Method = 'Method',
  Environment = 'Environment',
  Personnel = 'Personnel',
  Other = 'Other'
}

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
  | 'Food Safety'
  | 'Damaged'
  | 'Expired'
  | 'Other';

export interface NonConformance {
  id: string;
  title: string;
  description?: string;
  status: NCStatus | string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  department?: string;
  location?: string;
  root_cause?: string;
  item_name: string;
  item_id?: string;
  item_category: NCItemCategory | string;
  reason_category?: NCReasonCategory | string;
  reason_details?: string;
  resolution_details?: string;
  risk_level?: NCRiskLevel | string;
  severity?: string;
  priority?: string;
  immediate_action?: string;
  corrective_action?: string;
  preventive_action?: string;
  capa_id?: string;
  attachments?: string[];
  due_date?: string;
  closed_date?: string;
  reported_date?: string;
  review_date?: string;
  resolution_date?: string;
  quantity?: number;
  quantity_on_hold?: number;
  units?: string;
  tags?: string[];
  reviewer?: string;
}

export interface NCDetailsProps {
  id: string;
  title?: string;
  status?: NCStatus | string;
  itemName?: string;
  itemCategory?: string;
  description?: string;
  onStatusChange?: (status: NCStatus) => void;
  onClose?: () => void;
  reportedDate?: string;
  createdBy?: string;
  assignedTo?: string;
  reviewDate?: string;
  resolutionDate?: string;
  quantity?: number;
  quantityOnHold?: number;
  units?: string;
  reasonCategory?: string;
  reasonDetails?: string;
  resolution?: string;
}

export interface NCActivity {
  id: string;
  non_conformance_id: string;
  action: string;
  performed_by: string;
  performed_at: string;
  previous_status?: NCStatus | string;
  new_status?: NCStatus | string;
  comments?: string;
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
  status?: (NCStatus | string)[];
  item_category?: (NCItemCategory | string)[];
  reason_category?: (NCReasonCategory | string)[];
  date_range?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

export interface NCStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byReasonCategory: Record<string, number>;
  byRiskLevel: Record<string, number>;
  byReason?: Record<string, number>;
  overdue: number;
  pendingReview: number;
  recentlyResolved: number;
  totalQuantityOnHold?: number;
  recentItems?: NonConformance[];
}
