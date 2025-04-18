
export type CAPAStatus = 'open' | 'in-progress' | 'closed' | 'verified';

export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';

export type CAPASource = 'non_conformance' | 'complaint' | 'audit' | 'internal' | 'other';

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

export interface CAPAStats {
  total: number;
  openCAPAs: number;
  overdueCAPAs: number;
  byStatus: Record<CAPAStatus, number>;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<string, number>;
  recentItems: CAPA[];
}

export interface CAPAEffectivenessAssessment {
  id: string;
  capaId: string;
  assessmentDate: string;
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  score: number;
  rating: CAPAEffectivenessRating;
  recurrenceCheck: string;
  notes?: string;
  createdBy: string;
}
