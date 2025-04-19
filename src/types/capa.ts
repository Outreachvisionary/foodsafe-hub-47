
// Define the types for CAPA (Corrective and Preventive Actions)

export type CAPAStatus = 'open' | 'in-progress' | 'closed' | 'verified';
export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';
export type CAPASource = 'audit' | 'complaint' | 'haccp' | 'internal' | 'supplier' | 'traceability' | 'regulatory';
export type CAPAEffectivenessRating = 'effective' | 'partially-effective' | 'ineffective';

export interface CAPASourceReference {
  type: 'audit' | 'complaint' | 'haccp' | 'supplier' | 'traceability';
  id: string;
  title: string;
  date?: string;
  url?: string;
}

export interface CAPARelatedDocument {
  id: string;
  documentId: string;
  title?: string;
  type?: string;
  documentType?: string;
  addedAt: string;
}

export interface CAPARelatedTraining {
  id: string;
  trainingId: string;
  title?: string;
  type?: string;
  addedAt: string;
}

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  source: CAPASource;
  sourceId?: string;
  sourceReference?: CAPASourceReference;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  verificationMethod?: string;
  dueDate: string;
  completionDate?: string;
  verificationDate?: string;
  assignedTo: string;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  department?: string;
  effectivenessVerified: boolean;
  effectivenessCriteria?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  isFsma204Compliant: boolean;
  verifiedBy?: string;
  relatedDocuments?: CAPARelatedDocument[];
  relatedTraining?: CAPARelatedTraining[];
}

export interface CAPAFilter {
  status?: CAPAStatus[];
  priority?: CAPAPriority[];
  source?: CAPASource[];
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string[];
  department?: string[];
  searchTerm?: string;
}

export interface CAPAStats {
  total: number;
  openCount: number;
  inProgressCount: number;
  closedCount: number;
  verifiedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byDepartment: Record<string, number>;
  openByMonth?: Record<string, number>;
  closedByMonth?: Record<string, number>;
  averageResolutionDays?: number;
  fsma204ComplianceRate?: number;
  effectivenessStats?: {
    total: number;
    effective: number;
    partiallyEffective: number;
    ineffective: number;
  };
}

export interface CAPAAction {
  id: string;
  capaId: string;
  type: 'corrective' | 'preventive';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completionDate?: string;
  assignedTo: string;
  evidence?: string;
}

export interface CAPAEffectivenessMetrics {
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

export interface CAPAActivity {
  id: string;
  capaId: string;
  performedAt: string;
  oldStatus?: CAPAStatus;
  newStatus?: CAPAStatus;
  actionType: string;
  actionDescription: string;
  performedBy: string;
  metadata?: any;
}
