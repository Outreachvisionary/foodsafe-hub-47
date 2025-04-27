
export type CAPAStatus = 
  | 'Open' 
  | 'In_Progress' 
  | 'Under_Review' 
  | 'Completed' 
  | 'Closed' 
  | 'Rejected'
  | 'On_Hold'
  | 'Overdue'
  | 'Pending_Verification'
  | 'Verified';

export type EffectivenessRating = 
  | 'Not_Effective' 
  | 'Partially_Effective' 
  | 'Effective' 
  | 'Highly_Effective';

export type CAPAPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type CAPASource = 
  | 'Audit' 
  | 'Customer Complaint' 
  | 'Internal' 
  | 'Regulatory' 
  | 'Other';

export type CAPAEffectivenessRating = 
  | 'Not_Effective' 
  | 'Partially_Effective' 
  | 'Effective' 
  | 'Highly_Effective';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  completionDate?: string;
  assignedTo: string;
  source: CAPASource;
  sourceId?: string;
  department?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  effectivenessCriteria?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessVerified?: boolean;
  verificationDate?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  fsma204Compliant?: boolean;
  sourceReference?: string;
  relatedDocuments: Array<{
    id: string;
    documentId: string;
    documentName: string;
    documentType: string;
  }>;
  relatedTraining: Array<{
    id: string;
    trainingId: string;
    trainingName: string;
    trainingType: string;
  }>;
}

export interface CAPAAction {
  id: string;
  capaId: string;
  description: string;
  actionType: 'Corrective' | 'Preventive';
  status: 'Open' | 'In_Progress' | 'Completed';
  assignedTo: string;
  dueDate: string;
  completionDate?: string;
  comments?: string;
}

export interface CAPAActivity {
  id: string;
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  performed_at: string;
  old_status?: CAPAStatus;
  new_status?: CAPAStatus;
  metadata?: Record<string, any>;
}

export interface CAPAStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byMonth: Record<string, number>;
  byDepartment: Record<string, number>;
  effectivenessRating?: Record<string, number>;
  overdue: number;
  recentItems?: CAPA[];
  // Add the missing properties used in CAPADashboard and capaStatsService
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
}

export interface CAPAFormData {
  title: string;
  description: string;
  priority: CAPAPriority;
  assignedTo: string;
  dueDate: string;
  source: CAPASource;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  department?: string;
  effectivenessCriteria?: string;
  sourceId?: string;
  sourceReference?: string;
}

export interface CAPAFilterOptions {
  status?: CAPAStatus[];
  priority?: CAPAPriority[];
  source?: CAPASource[];
  assignedTo?: string[];
  department?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  includeCompleted?: boolean;
  searchTerm?: string;
}

export interface CAPAFilter {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface CAPAFetchParams {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  searchQuery?: string;
  dueDate?: string;
}

export interface CAPAHistoryItem {
  id: string;
  date: string;
  user: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  comments?: string;
}

export interface CAPAEffectivenessMetrics {
  capaId: string;
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  score: number;
  rating: CAPAEffectivenessRating;
  notes?: string;
}
