// This is a placeholder file to fix import errors
// A more complete implementation would need all types defined properly

export type CAPA = {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  createdAt: string; // Note: this is createdAt, not createdDate
  dueDate: string;
  completionDate?: string;
  assignedTo: string;
  createdBy: string;
  source: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
};

export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

export type DbCAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification' | 'Verified';

export type CAPAStats = {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byDepartment: Record<string, number>; // Added this field
};

export type CAPAFetchParams = {
  status?: CAPAStatus | 'All';
  priority?: string | 'All';
  assignedTo?: string | 'All';
  source?: string | 'All';
  startDate?: string; // Use startDate instead of from
  endDate?: string;   // Use endDate instead of to
  searchQuery?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

// Add the mapDbStatusToInternal function
export const mapDbStatusToInternal = (dbStatus: DbCAPAStatus): CAPAStatus => {
  switch (dbStatus) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Pending Verification': return 'Pending Verification';
    case 'Verified': return 'Pending Verification'; // Map Verified to Pending Verification for compatibility
    default: return 'Open';
  }
};
