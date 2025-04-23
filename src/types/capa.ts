
// Define CAPA types

export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | string;
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical' | string;
export type CAPASource = 'audit' | 'customer-complaint' | 'internal-qc' | 'supplier-issue' | 'other' | string;
export type CAPAEffectivenessRating = 'Ineffective' | 'Partially Effective' | 'Effective' | 'Highly Effective' | 'excellent' | 'good' | 'adequate' | 'poor' | 'ineffective' | string;

// Database CAPA status type (for mapping between frontend and backend)
export type DbCAPAStatus = 'open' | 'in_progress' | 'closed' | 'overdue' | 'pending_verification' | string;

// Extended version for the effectiveness monitor
export type ExtendedCAPAEffectivenessRating = 'excellent' | 'good' | 'adequate' | 'poor' | 'ineffective' | string;

// Metrics for effectiveness assessment
export interface CAPAEffectivenessMetrics {
  score: number;
  rating: CAPAEffectivenessRating | ExtendedCAPAEffectivenessRating;
  notes?: string;
}

// Source reference for a CAPA
export interface CAPASourceReference {
  type: string;
  title: string;
  date?: string;
  url?: string;
}

// Related document for a CAPA
export interface CAPARelatedDocument {
  id: string;
  documentId?: string;
  title?: string;
  type?: string;
  documentType?: string;
  addedAt: string;
}

// Related training for a CAPA
export interface CAPARelatedTraining {
  id: string;
  trainingId?: string;
  title?: string;
  type?: string;
  addedAt: string;
}

// CAPA Activity tracking
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

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  source: CAPASource;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  dueDate: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  effectivenessCriteria?: string;
  sourceId?: string;
  department?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  completionDate?: string;
  verificationDate?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessVerified?: boolean;
  isFsma204Compliant?: boolean;
  
  // Added these properties to match component usage
  sourceReference?: CAPASourceReference;
  relatedDocuments?: CAPARelatedDocument[];
  relatedTraining?: CAPARelatedTraining[];
  createdDate?: string; // Alias for createdAt
}

export interface CAPAFilter {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource | CAPASource[];
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string;
  createdBy?: string;
  department?: string;
}

// Update CAPAFetchParams with all the missing properties
export interface CAPAFetchParams {
  status?: string;
  priority?: string;
  source?: string | string[];
  searchQuery?: string;
  dueDate?: string;
  assignedTo?: string;
  createdBy?: string;
  department?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byDepartment?: Record<string, number>;
  effectivenessRate?: number;
}

// Helper functions for mapping between frontend and backend status
export const mapDbStatusToInternal = (dbStatus: DbCAPAStatus): CAPAStatus => {
  switch (dbStatus) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'overdue': return 'Overdue';
    case 'pending_verification': return 'Pending Verification';
    default: return dbStatus as unknown as CAPAStatus;
  }
};

export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  const normalized = status.toLowerCase().replace(/\s/g, '_');
  switch (normalized) {
    case 'open': return 'open';
    case 'in_progress': return 'in_progress';
    case 'closed': return 'closed';
    case 'overdue': return 'overdue';
    case 'pending_verification': return 'pending_verification';
    default: return normalized as DbCAPAStatus;
  }
};

// Helper functions for badge colors
export const getStatusColor = (status: CAPAStatus): string => {
  const normalized = status.toLowerCase().replace(/[-\s]/g, '');
  switch (normalized) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'inprogress':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'verified':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'pendingverification':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityColor = (priority: CAPAPriority): string => {
  const normalized = priority.toLowerCase();
  switch (normalized) {
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
