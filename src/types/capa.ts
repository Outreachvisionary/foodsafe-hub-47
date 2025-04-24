
// Updated CAPA type definitions

export type CAPAStatus = 'Open' | 'In_Progress' | 'Closed' | 'Overdue' | 'Pending_Verification' | 'Verified';

export type CAPAPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type CAPASource = 'Audit' | 'Customer Complaint' | 'Internal' | 'Regulatory' | 'Other';

export type CAPAEffectivenessRating = 'Effective' | 'Partially_Effective' | 'Not_Effective';

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
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessCriteria?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  fsma204Compliant?: boolean;
  effectivenessVerified?: boolean;
  sourceId?: string;
  sourceReference?: string; // New field
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

export interface CAPAActivity {
  id: string;
  capa_id: string;
  performed_at: string;
  old_status?: CAPAStatus;
  new_status?: CAPAStatus;
  action_type: string;
  action_description: string;
  performed_by: string;
  metadata: Record<string, any>;
}

export interface CAPAStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byMonth: Record<string, number>;
  effectivenessRating?: Record<string, number>;
  overdue: number;
  recentItems?: CAPA[];
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

export interface CAPAHistoryItem {
  id: string;
  date: string;
  user: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  comments?: string;
}
