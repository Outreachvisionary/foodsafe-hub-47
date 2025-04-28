
export type CAPAStatus = 
  | 'Open'
  | 'In_Progress'
  | 'Closed'
  | 'Overdue'
  | 'Pending_Verification'
  | 'Verified';

export type CAPAPriority = 
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export type CAPASource = 
  | 'Audit'
  | 'Customer_Complaint'
  | 'Inspection'
  | 'Non_Conformance'
  | 'Supplier_Issue'
  | 'Employee_Suggestion'
  | 'Food_Safety_Event'
  | 'Management_Review'
  | 'Regulatory'
  | 'Other';

export type CAPAEffectivenessRating = 
  | 'Effective'
  | 'Partially_Effective'
  | 'Not_Effective'
  | 'Not_Verified';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  assignedTo: string;
  source: string;
  sourceId?: string;
  sourceReference: string;
  completionDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  effectivenessCriteria?: string;
  effectivenessRating?: string;
  effectivenessVerified?: boolean;
  verificationDate?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  department?: string;
  fsma204Compliant?: boolean;
  relatedDocuments: string[];
  relatedTraining: string[];
}

export interface CAPAActivity {
  id: string;
  capaId: string;
  activityType: string;
  description: string;
  timestamp: string;
  user: string;
  metadata?: Record<string, any>;
}

export interface CAPAFilter {
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  department?: string | string[];
  createdDateFrom?: string;
  createdDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  assignedTo?: string | string[];
  searchTerm?: string;
}

export interface CAPAFetchParams extends CAPAFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byDepartment: Record<string, number>;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
  overdue: number;
}
