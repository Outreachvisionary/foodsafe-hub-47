export type CAPAStatus = 'open' | 'in-progress' | 'closed' | 'verified';

export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';

export type CAPASource = 'non_conformance' | 'complaint' | 'audit' | 'internal' | 'other' | 'supplier' | 'haccp' | 'traceability';

export type CAPAEffectivenessRating = 'excellent' | 'good' | 'adequate' | 'poor' | 'ineffective';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  createdDate: string;
  dueDate: string;
  completionDate?: string;
  verificationDate?: string;
  effectivenessVerified?: boolean;
  effectivenessRating?: CAPAEffectivenessRating;
  assignedTo: string;
  createdBy: string;
  department?: string;
  source: CAPASource;
  sourceId?: string;
  effectivenessCriteria?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  lastUpdated?: string;
  relatedDocuments?: Array<{id: string, title: string, type: string}>;
  relatedTraining?: Array<{id: string, title: string, type: string}>;
  fsma204Compliant?: boolean;
  sourceReference?: SourceReference;
}

export interface SourceReference {
  type: string;
  title: string;
  id: string;
  url?: string;
  date?: string;
}

export interface CAPAActivity {
  id: string;
  capaId: string;
  actionType: string;
  actionDescription: string;
  performedBy: string;
  performedAt: string;
  oldStatus?: CAPAStatus;
  newStatus?: CAPAStatus;
  metadata?: Record<string, any>;
}

export interface CAPAFilter {
  status?: CAPAStatus[];
  priority?: CAPAPriority[];
  source?: CAPASource[];
  assignedTo?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

// Alias for compatibility with components using CAPAFilters
export type CAPAFilters = CAPAFilter;

export type CAPAFilterParams = {
  status?: string | string[];
  priority?: string | string[];
  source?: string | string[];
  sourceId?: string;
  assignedTo?: string;
  department?: string;
  searchQuery?: string;
  dueDate?: string;
  limit?: number;
  page?: number;
};

export interface CAPAStats {
  total: number;
  openCAPAs: number;
  overdueCAPAs: number;
  byStatus: Record<CAPAStatus, number>;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<string, number>;
  recentItems: CAPA[];
  averageClosureTime?: number;
  fsma204ComplianceRate?: number;
  overdue?: number;
  averageTimeToClose?: number;
  effectivenessStats?: {
    effective: number;
    partiallyEffective: number;
    ineffective: number;
    notEvaluated: number;
  };
  effectivenessRating?: {
    effective: number;
    partiallyEffective: number;
    notEffective: number;
  };
  completionRates?: Record<string, number>;
}

export interface CAPAEffectivenessMetrics {
  id?: string;
  capaId: string;
  score: number;
  recurrenceCheck: boolean;
  rootCauseEliminated: boolean;
  documentationComplete: boolean;
  preventionMeasureEffective: boolean;
  preventiveMeasuresImplemented?: boolean; // Added for backward compatibility
  assessmentDate: string;
  notes?: string;
  createdBy: string;
  rating: CAPAEffectivenessRating;
}
