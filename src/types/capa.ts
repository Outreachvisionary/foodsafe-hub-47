
// CAPA types with consistent naming conventions

export type CAPAStatus = 'Open' | 'In_Progress' | 'Closed' | 'Overdue' | 'Pending_Verification' | 'Verified';

export type CAPAEffectivenessRating = 'Effective' | 'Partially_Effective' | 'Not_Effective' | 'Highly_Effective';

export type CAPAPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type CAPASource = 'Audit' | 'Customer_Complaint' | 'Internal_QC' | 'Supplier_Issue' | 'Other';

// Database-style status values (used for API/DB interactions)
export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

export interface CAPAEffectivenessMetrics {
  capaId: string;
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  score: number;
  rating: CAPAEffectivenessRating;
  notes?: string;
}

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  createdAt: string;
  dueDate: string;
  completionDate?: string;
  verificationDate?: string;
  assignedTo: string;
  createdBy: string;
  source: CAPASource;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  department?: string;
  effectivenessRating?: CAPAEffectivenessRating | null;
  effectivenessCriteria?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  fsma204Compliant?: boolean;
  effectivenessVerified?: boolean;
  sourceId?: string;
  relatedDocuments?: string[];
  relatedTraining?: string[];
  sourceReference?: {
    type: string;
    title: string;
    url?: string;
    date?: string;
  };
}

export interface CAPAFilter {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CAPAFetchParams {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  searchQuery?: string;
  dueDate?: string;
}

export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byDepartment: Record<string, number>;
}

export interface CAPAActivity {
  id: string;
  capa_id: string;
  performed_at: string;
  old_status: CAPAStatus;
  new_status: CAPAStatus;
  action_type: string;
  action_description: string;
  performed_by: string;
  metadata: Record<string, any>;
}
