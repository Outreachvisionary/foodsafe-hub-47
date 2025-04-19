
export type CAPAStatus = 'open' | 'in-progress' | 'closed' | 'verified' | 'overdue' | 'pending-verification';
export type CAPASource = 'non-conformance' | 'audit' | 'complaint' | 'internal' | 'customer' | 'regulatory';
export type CAPAPriority = 'high' | 'medium' | 'low' | 'critical';
export type CAPAEffectivenessRating = 'effective' | 'partially-effective' | 'ineffective' | 'not-verified' | 'adequate' | 'inadequate';

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
  rootCauseEliminated: number;
  documentationComplete: number;
  preventionMeasureEffective: number;
  recurrenceChecked: number;
  overall: number;
}

export interface CAPAEffectivenessAssessment {
  id?: string;
  capaId: string;
  score: number;
  recurrenceCheck: boolean;
  rootCauseEliminated: boolean;
  documentationComplete: boolean;
  preventionMeasureEffective: boolean;
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
  byDepartment: Record<string, number>;
  effectivenessStats: {
    verified: number;
    effective: number;
    partiallyEffective: number;
    ineffective: number;
  };
  averageTimeToClose?: number;
}
