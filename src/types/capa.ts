
// Define the CAPA type and related interfaces for the CAPA system

export type CAPA = {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  createdAt: string; // Note: this is createdAt, not createdDate
  dueDate: string;
  completionDate?: string;
  verificationDate?: string;
  assignedTo: string;
  createdBy: string;
  source: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  department?: string;
  verificationMethod?: string;
  effectivenessCriteria?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  verifiedBy?: string;
  isFsma204Compliant?: boolean;
  relatedDocuments?: RelatedDocument[];
  relatedTraining?: RelatedTraining[];
};

// Additional types for reference relationships
export type RelatedDocument = {
  id: string;
  title?: string;
  documentId: string;
  documentType?: string;
  type?: string;
  addedAt: string;
};

export type RelatedTraining = {
  id: string;
  title?: string;
  trainingId: string;
  type?: string;
  addedAt: string;
};

export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';

export type CAPASource = 'audit' | 'complaint' | 'internal-qc' | 'supplier-issue' | 'haccp' | 'traceability' | 'other';

export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

export type CAPAEffectivenessRating = 'excellent' | 'good' | 'poor' | 'not_assessed';

export type CAPAEffectivenessMetrics = {
  capaId: string;
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  score: number;
  notes?: string;
  rating: CAPAEffectivenessRating;
};

export type CAPAStats = {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byDepartment: Record<string, number>;
};

export type CAPAFetchParams = {
  status?: CAPAStatus | 'All';
  priority?: string | 'All';
  assignedTo?: string | 'All';
  source?: string | 'All';
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  dueDate?: string;
};

export type CAPAFilter = {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
  assignedTo?: string;
};

// Map database status to internal representation
export const mapDbStatusToInternal = (dbStatus: DbCAPAStatus): CAPAStatus => {
  switch (dbStatus) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending Verification': return 'Pending Verification';
    case 'Verified': return 'Verified';
    default: return 'Open';
  }
};
