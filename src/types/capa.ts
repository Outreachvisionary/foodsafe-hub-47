
// Define the CAPA types
export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification';
export type DbCAPAStatus = 'Open' | 'In_Progress' | 'Closed' | 'Overdue' | 'Pending_Verification';
export type CAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Not Effective' | 'Not Evaluated';
export type CAPAPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  source: string;
  dueDate: string;
  completionDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  createdAt: string;
  lastUpdated: string;
  assignedTo: string;
  createdBy: string;
  department?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  verificationDate?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessVerified?: boolean;
  isFsma204Compliant?: boolean;
}

export interface CAPAActivity {
  id: string;
  capaId: string;
  actionType: string;
  actionDescription: string;
  performedAt: string;
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
  recurrenceCheck?: string;
  notes?: string;
  createdBy: string;
}

export interface CAPARelatedDocument {
  id: string;
  capaId: string;
  documentId: string;
  documentType?: string;
  addedAt: string;
  addedBy: string;
}

export interface CAPARelatedTraining {
  id: string;
  capaId: string;
  trainingId: string;
  addedAt: string;
  addedBy: string;
}

export interface CAPAFetchParams {
  capaId?: string;
  actionType?: string;
  performedBy?: string;
  limit?: number;
  status?: CAPAStatus;
  priority?: CAPAPriority;
  assignedTo?: string;
  department?: string;
  source?: string;
  effectivenessVerified?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
