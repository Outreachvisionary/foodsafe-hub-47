
// CAPA Status types for internal representation vs database representation
export type CAPAStatus = 'open' | 'in-progress' | 'pending-verification' | 'closed' | 'verified' | 'cancelled';
export type DbCAPAStatus = 'open' | 'in_progress' | 'pending_verification' | 'closed' | 'verified' | 'cancelled';

// CAPA Priority types
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical';

// CAPA Source types
export type CAPASource = 'audit' | 'complaint' | 'non-conformance' | 'incident' | 'other';

// CAPA Effectiveness Rating
export type CAPAEffectivenessRating = 'excellent' | 'good' | 'fair' | 'poor' | 'not-determined';

// Database-friendly CAPA effectiveness rating
export type DbCAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Not Effective';

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
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  assignedTo?: string;
  department?: string;
  from?: string;
  to?: string;
  searchQuery?: string;
  limit?: number;
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

// Removed the castToCapaStatus and castToCapaPriority functions as they're not needed
// and were causing errors
