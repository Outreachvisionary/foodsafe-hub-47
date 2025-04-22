// CAPA Status types for internal representation vs database representation
export type CAPAStatus = 'open' | 'in-progress' | 'pending-verification' | 'closed' | 'verified' | 'cancelled';
export type DbCAPAStatus = 'open' | 'in_progress' | 'pending_verification' | 'closed' | 'verified' | 'cancelled';

// CAPA Priority types
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical';

// CAPA Source types
export type CAPASource = 'audit' | 'complaint' | 'non-conformance' | 'incident' | 'other';

// CAPA Effectiveness Rating
export type CAPAEffectivenessRating = 'excellent' | 'good' | 'fair' | 'poor' | 'not-determined';

// Extended effectiveness rating for components that need it
export type ExtendedCAPAEffectivenessRating = CAPAEffectivenessRating | 'adequate' | 'ineffective';

// Database-friendly CAPA effectiveness rating
export type DbCAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Not Effective';

// Interface for effectiveness metrics
export interface CAPAEffectivenessMetrics {
  score: number;
  rootCauseEliminated?: boolean;
  preventiveMeasuresImplemented?: boolean;
  documentationComplete?: boolean;
  recurrenceCheck?: string;
  checkedDate?: string;
  assessmentDate?: string;
  notes?: string;
  rating?: ExtendedCAPAEffectivenessRating;
}

// Color mappings for CAPA statuses
export const getStatusColor = (status: CAPAStatus) => {
  switch (status) {
    case 'open':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending-verification':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'verified':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Color mappings for CAPA priorities
export const getPriorityColor = (priority: CAPAPriority) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Create a StatusBadge component for consistent status display
export interface CAPAStats {
  total: number;
  openCount: number;
  inProgressCount: number;
  closedCount: number;
  verifiedCount: number;
  pendingVerificationCount: number;
  overdueCount: number;
  byStatus: Array<{ name: string; value: number }>;
  byPriority: Array<{ name: string; value: number }>;
  bySource: Array<{ name: string; value: number }>;
  fsma204ComplianceRate?: number;
  averageTimeToClose?: number;
  averageClosureTime?: number;
  effectivenessStats?: {
    effective: number;
    partiallyEffective: number;
    ineffective: number;
  };
}

// Filter interface for CAPA queries
export interface CAPAFilter {
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  assignedTo?: string;
  department?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

// Mapping functions for database interactions
export function mapStatusToDb(status: CAPAStatus): DbCAPAStatus {
  switch (status) {
    case 'in-progress': return 'in_progress';
    case 'pending-verification': return 'pending_verification';
    default: return status as DbCAPAStatus; // 'open', 'closed', 'verified', 'cancelled' are the same
  }
}

export function mapDbStatusToInternal(dbStatus: DbCAPAStatus): CAPAStatus {
  switch (dbStatus) {
    case 'in_progress': return 'in-progress';
    case 'pending_verification': return 'pending-verification';
    default: return dbStatus as CAPAStatus; // 'open', 'closed', 'verified', 'cancelled' are the same
  }
}

export function mapEffectivenessRatingToDb(rating: CAPAEffectivenessRating): DbCAPAEffectivenessRating {
  switch(rating) {
    case 'excellent':
    case 'good':
      return 'Effective';
    case 'fair':
      return 'Partially Effective';
    case 'poor':
      return 'Not Effective';
    case 'not-determined':
    default:
      return 'Partially Effective';
  }
}

export function mapDbEffectivenessRatingToInternal(dbRating: DbCAPAEffectivenessRating): CAPAEffectivenessRating {
  switch(dbRating) {
    case 'Effective':
      return 'excellent';
    case 'Partially Effective':
      return 'fair';
    case 'Not Effective':
      return 'poor';
    default:
      return 'not-determined';
  }
}

export interface SourceReference {
  type: string;
  url?: string;
  title?: string;
  date?: string;
}

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  source: CAPASource;
  sourceId: string;
  assignedTo: string;
  department?: string;
  dueDate: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  effectivenessCriteria?: string;
  completionDate?: string;
  createdBy: string;
  createdDate: string;
  lastUpdated?: string;
  isFsma204Compliant?: boolean;
  verificationMethod?: string;
  verificationDate?: string;
  verifiedBy?: string;
  effectivenessVerified?: boolean;
  effectivenessRating?: CAPAEffectivenessRating;
  sourceReference?: SourceReference;
  relatedDocuments?: Array<{
    id: string;
    documentId: string;
    title?: string;
    type?: string;
    documentType?: string;
    addedAt: string;
  }>;
  relatedTraining?: Array<{
    id: string;
    trainingId: string;
    title?: string;
    type?: string;
    addedAt: string;
  }>;
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

export interface CAPAFetchParams {
  id?: string;
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  assignedTo?: string;
  department?: string;
  from?: string;
  to?: string;
  searchQuery?: string;
  limit?: number;
  page?: number;
  dueDate?: string;
}

export interface CAPAEffectivenessResult {
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
