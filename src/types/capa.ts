
// Define CAPA types

export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | string;
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical' | string;
export type CAPASource = 'audit' | 'customer-complaint' | 'internal-qc' | 'supplier-issue' | 'other' | string;
export type CAPAEffectivenessRating = 'Ineffective' | 'Partially Effective' | 'Effective' | 'Highly Effective' | 'excellent' | 'good' | 'adequate' | 'poor' | 'ineffective' | string;

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
}

export interface CAPAFetchParams {
  status?: string;
  priority?: string;
  source?: string | string[];
  searchQuery?: string;
  dueDate?: string;
  assignedTo?: string;
  createdBy?: string;
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
