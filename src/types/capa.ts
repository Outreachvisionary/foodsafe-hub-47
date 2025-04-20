
// Define the types for CAPA module

export type CAPAStatus = 'open' | 'in-progress' | 'pending-verification' | 'closed' | 'verified' | 'cancelled';
export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';
export type CAPASource = 'audit' | 'complaint' | 'incident' | 'nonconformance' | 'internal' | 'supplier' | 'other' | 'haccp' | 'traceability';
export type CAPAEffectivenessRating = 'excellent' | 'good' | 'adequate' | 'poor' | 'ineffective';

// Database CAPA status (for consistency with db column format)
export type DbCAPAStatus = 'open' | 'in_progress' | 'pending_verification' | 'closed' | 'verified' | 'cancelled';

// UI Display status mapping
export const capaStatusDisplayMap: Record<CAPAStatus, string> = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'pending-verification': 'Pending Verification',
  'closed': 'Closed',
  'verified': 'Verified',
  'cancelled': 'Cancelled'
};

export interface RelatedDocument {
  id: string;
  title?: string;
  documentId: string;
  type?: string;
  documentType?: string;
  addedAt: string;
}

export interface RelatedTraining {
  id: string;
  title?: string;
  trainingId: string;
  type?: string;
  addedAt: string;
}

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
  effectivenessRating?: CAPAEffectivenessRating;
  verificationMethod?: string;
  verifiedBy?: string;
  isFsma204Compliant: boolean;
  relatedDocuments?: RelatedDocument[];
  relatedTraining?: RelatedTraining[];
  sourceReference?: SourceReference;
}

export interface SourceReference {
  type: string;
  title: string;
  url?: string;
  date?: string;
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
  checkedDate?: string; // Added for stats service
}

export interface CAPAFilter {
  status?: CAPAStatus[] | CAPAStatus;
  priority?: CAPAPriority[] | CAPAPriority;
  source?: CAPASource[] | CAPASource;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  assignedTo?: string[] | string;
  department?: string[] | string;
}

export interface CAPAStats {
  total: number;
  openCount: number;
  inProgressCount: number;
  closedCount: number;
  verifiedCount: number;
  pendingVerificationCount: number;
  overdueCount: number;
  byStatus: { name: string; value: number }[];
  byPriority: { name: string; value: number }[];
  bySource: { name: string; value: number }[];
  fsma204ComplianceRate?: number;
  effectivenessStats?: {
    effective: number;
    partiallyEffective: number;
    ineffective: number;
  };
  averageTimeToClose?: number;
  averageClosureTime?: number;
  overdue?: number;
  recentItems?: CAPA[];
  completionRates?: Record<string, number>;
}

export interface CAPAEffectivenessMetrics {
  score: number;
  rating?: CAPAEffectivenessRating;
  notes?: string;
  rootCauseEliminated?: boolean;
  preventiveMeasuresImplemented?: boolean;
  documentationComplete?: boolean;
  recurrenceCheck?: string;
  checkedDate?: string;
  assessmentDate?: string;
}

export interface CAPAFetchParams {
  status?: CAPAStatus[] | string;
  priority?: CAPAPriority[] | string;
  source?: CAPASource | string;
  sourceId?: string;
  assignedTo?: string;
  department?: string;
  searchQuery?: string; 
  from?: string;
  to?: string; 
  dueDate?: string;
  limit?: number;
  page?: number;
  id?: string;
}

// Map functions for database conversions
export const mapStatusToDisplay = (status: CAPAStatus): string => {
  return capaStatusDisplayMap[status] || status;
};

export const mapDisplayStatusToInternal = (displayStatus: string): CAPAStatus => {
  for (const [key, value] of Object.entries(capaStatusDisplayMap)) {
    if (value === displayStatus) {
      return key as CAPAStatus;
    }
  }
  return 'open';  // Default fallback
};

export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  if (status === 'in-progress') return 'in_progress';
  if (status === 'pending-verification') return 'pending_verification';
  return status as DbCAPAStatus;
};

export const mapDbStatusToInternal = (dbStatus: DbCAPAStatus): CAPAStatus => {
  if (dbStatus === 'in_progress') return 'in-progress';
  if (dbStatus === 'pending_verification') return 'pending-verification';
  return dbStatus as CAPAStatus;
};

// Define utility functions to cast string values to our type enums
export const castToCapaStatus = (status: string): CAPAStatus => {
  const validStatuses: CAPAStatus[] = ['open', 'in-progress', 'pending-verification', 'closed', 'verified', 'cancelled'];
  return validStatuses.includes(status as CAPAStatus) 
    ? status as CAPAStatus 
    : 'open';
};

export const castToCapaPriority = (priority: string): CAPAPriority => {
  const validPriorities: CAPAPriority[] = ['critical', 'high', 'medium', 'low'];
  return validPriorities.includes(priority as CAPAPriority)
    ? priority as CAPAPriority
    : 'medium';
};
