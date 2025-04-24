
// Define the CAPA types
export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified' | 'Cancelled';
export type DbCAPAStatus = 'Open' | 'In_Progress' | 'Closed' | 'Overdue' | 'Pending_Verification' | 'Verified' | 'Cancelled';
export type CAPAEffectivenessRating = 'Highly Effective' | 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Evaluated';
export type CAPAPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type CAPASource = 'audit' | 'haccp' | 'complaint' | 'supplier' | 'traceability' | 'customer-complaint' | 'internal-qc' | 'supplier-issue' | 'other';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  source: CAPASource;
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
  effectivenessCriteria?: string;
  effectivenessVerified?: boolean;
  isFsma204Compliant?: boolean;
  sourceReference?: {
    type: string;
    title: string;
    date?: string;
    url?: string;
  };
  relatedDocuments?: CAPARelatedDocument[];
  relatedTraining?: CAPARelatedTraining[];
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

export interface CAPAEffectivenessMetrics {
  score: number;
  rating: CAPAEffectivenessRating;
  notes?: string;
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

export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  effectivenessRate: number;
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
  source?: CAPASource;
  effectivenessVerified?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchQuery?: string;
}
