
// Define the types for CAPA module

export type CAPAStatus = 'open' | 'in-progress' | 'pending-verification' | 'closed' | 'cancelled';
export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';
export type CAPASource = 'audit' | 'complaint' | 'incident' | 'nonconformance' | 'internal' | 'supplier' | 'other';
export type CAPAEffectivenessRating = 'excellent' | 'good' | 'adequate' | 'poor' | 'ineffective';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  source: CAPASource;
  sourceId: string;
  priority: CAPAPriority;
  status: CAPAStatus;
  dueDate: string;
  assignedTo: string;
  department?: string;
  createdBy: string;
  createdDate: string;
  completionDate?: string;
  verificationDate?: string;
  lastUpdated: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  effectivenessCriteria?: string;
  effectivenessVerified: boolean;
  verificationMethod?: string;
  verifiedBy?: string;
  isFsma204Compliant: boolean;
  relatedDocuments?: string[];
  relatedTraining?: string[];
}

export interface CAPAActivity {
  id: string;
  capaId: string;
  performedAt: string;
  actionType: string;
  actionDescription: string;
  performedBy: string;
  oldStatus?: CAPAStatus;
  newStatus?: CAPAStatus;
  metadata?: Record<string, any>;
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
