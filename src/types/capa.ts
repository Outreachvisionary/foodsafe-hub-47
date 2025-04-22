
// Define CAPA types

export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | string;
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical' | string;
export type CAPASource = 'audit' | 'customer-complaint' | 'internal-qc' | 'supplier-issue' | 'other' | string;
export type CAPAEffectivenessRating = 'Ineffective' | 'Partially Effective' | 'Effective' | 'Highly Effective' | string;

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
