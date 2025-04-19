
export type CAPAStatus = 'open' | 'in-progress' | 'closed' | 'verified' | 'overdue' | 'pending-verification';
export type CAPASource = 'non-conformance' | 'audit' | 'complaint' | 'internal' | 'customer' | 'regulatory' | 'supplier' | 'haccp' | 'traceability';
export type CAPAPriority = 'high' | 'medium' | 'low' | 'critical';
export type CAPAEffectivenessRating = 'effective' | 'partially-effective' | 'ineffective' | 'not-verified' | 'adequate' | 'inadequate' | 'excellent' | 'good' | 'poor';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  source: CAPASource;
  sourceId?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  priority: CAPAPriority;
  dueDate: string;
  status: CAPAStatus;
  effectivenessVerified?: boolean;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessCriteria?: string;
  assignedTo: string;
  department?: string;
  completionDate?: string;
  verificationDate?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  createdBy: string;
  createdDate?: string;
  lastUpdated?: string;
  isFsma204Compliant?: boolean;
  relatedDocuments?: RelatedDocument[];
  relatedTraining?: RelatedTraining[];
  sourceReference?: SourceReference;
}

export interface RelatedDocument {
  id: string;
  documentId: string;
  capaId: string;
  documentType: string;
  title?: string;
  addedAt: string;
  addedBy: string;
}

export interface RelatedTraining {
  id: string;
  trainingId: string;
  capaId: string;
  title?: string;
  addedAt: string;
  addedBy: string;
}

export interface SourceReference {
  id: string;
  type: string;
  title: string;
  date?: string;
  url?: string;
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
  department?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  effectivenessVerified?: boolean;
}

export interface CAPAEffectivenessMetrics {
  id?: string;
  capaId: string;
  rootCauseEliminated: boolean;
  documentationComplete: boolean;
  preventionMeasureEffective: boolean;
  recurrenceCheck: boolean;
  recurrenceChecked: number;
  rootCauseEliminated: number;
  documentationComplete: number;
  preventionMeasureEffective: number;
  overall: number;
  score: number;
  assessmentDate: string;
  notes?: string;
  createdBy: string;
  rating: CAPAEffectivenessRating;
}

export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  verifiedCount: number;
  inProgressCount: number;
  pendingVerificationCount: number;
  byPriority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  bySource: Record<CAPASource, number>;
  byStatus: {
    open: number;
    'in-progress': number;
    closed: number;
    verified: number;
    overdue: number;
    'pending-verification': number;
  };
  effectivenessStats: {
    verified: number;
    effective: number;
    partiallyEffective: number;
    ineffective: number;
    notEvaluated?: number;
  };
  averageTimeToClose?: number;
  averageClosureTime?: number;
  fsma204ComplianceRate?: number;
  overdue: number;
  recentItems: CAPA[];
  completionRates: Record<string, number>;
}
