
export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Verified';
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical';
export type CAPASource = 'audit' | 'complaint' | 'non_conformance' | 'supplier' | 'haccp' | 'traceability';
export type CAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Evaluated';

export interface SourceReference {
  type: string;
  title: string;
  id: string;
  url?: string;
  date?: string;
  description?: string;
  status?: string;
}

export interface CAPAEffectivenessMetrics {
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  recurrenceCheck?: 'Passed' | 'Minor Issues' | 'Failed';
  score: number;
  checkedDate: string;
  assessmentDate?: string;
  notes?: string;
}

export interface CAPA {
  id: string;
  title: string;
  description: string;
  source: CAPASource;
  sourceId?: string;
  sourceReference?: SourceReference;
  priority: CAPAPriority;
  status: CAPAStatus;
  dueDate: string;
  assignedTo: string;
  department?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  completedDate?: string;
  verificationDate?: string;
  createdBy: string;
  lastUpdated: string;
  createdDate?: string;
  effectivenessVerified?: boolean;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessCriteria?: string;
  fsma204Compliant?: boolean;
  verificationMethod?: string;
  verifiedBy?: string;
  relatedDocuments?: any[];
  relatedTraining?: any[];
}

// For compatibility with existing code
export interface CAPAAction extends CAPA {}

// Additional interfaces required by the code
export interface CAPAActivity {
  id: string;
  capaId: string;
  actionType: string;
  actionDescription: string;
  performedBy: string;
  performedAt: string;
  oldStatus?: CAPAStatus;
  newStatus?: CAPAStatus;
  metadata?: any;
}

export interface CAPAFetchParams {
  status?: string | string[];
  priority?: string | string[];
  source?: string | string[];
  searchQuery?: string;
  dueDate?: string;
  limit?: number;
  page?: number;
  sourceId?: string;
  assignedTo?: string;
  department?: string;
}

export interface CAPAStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  overdue: number;
  recentItems: CAPA[];
  completionRates: Record<string, number>;
  effectivenessStats: {
    effective: number;
    partiallyEffective: number;
    ineffective: number;
    notEvaluated: number;
  };
  averageTimeToClose: number;
  averageClosureTime?: number;
  fsma204ComplianceRate?: number;
}

export interface CAPAFilters {
  status: string;
  priority: string;
  source: string;
  dueDate: string;
}
