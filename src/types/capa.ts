
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
  sourceId?: string; // Adding sourceId for LinkedCAPAsList component
  sourceReference?: {
    type: string;
    title: string;
    url?: string;
    date?: string;
  };
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

// Using capitalized values to match database
export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';

export type CAPASource = 'audit' | 'complaint' | 'internal-qc' | 'supplier-issue' | 'haccp' | 'traceability' | 'other';

// Updating the DbCAPAStatus to match the actual database values
export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

// Update effectiveness rating to match component usage
export type CAPAEffectivenessRating = 'Highly Effective' | 'Effective' | 'Partially Effective' | 'Ineffective' | 'not_assessed';

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
  from?: string; // Adding from for CAPAFetchService
  to?: string;   // Adding to for CAPAFetchService
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

// Export mapStatusToDb for backward compatibility
export const mapStatusToDb = (status: CAPAStatus): DbCAPAStatus => {
  switch (status) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending Verification': return 'Pending Verification';
    case 'Verified': return 'Verified';
    default: return 'Open';
  }
};

// Map lowercase status to official capitalized status
export const normalizeStatus = (status: string): CAPAStatus => {
  switch(status.toLowerCase()) {
    case 'open': return 'Open';
    case 'in progress': 
    case 'in-progress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'overdue': return 'Overdue';
    case 'pending verification':
    case 'pending-verification': return 'Pending Verification';
    case 'verified': return 'Verified';
    default: return 'Open';
  }
};
