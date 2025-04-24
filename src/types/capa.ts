
// If the file doesn't exist, creating it with some basic types to fix errors

export type CAPAStatus = 'Open' | 'In_Progress' | 'Closed' | 'Overdue' | 'Pending_Verification' | 'Verified';

export type CAPAEffectivenessRating = 'Effective' | 'Partially_Effective' | 'Not_Effective';

export type CAPAPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type CAPASource = 'Audit' | 'Customer Complaint' | 'Internal QC' | 'Supplier Issue' | 'Other';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  createdAt: string;
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
  effectivenessRating?: CAPAEffectivenessRating | null;
  effectivenessCriteria?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  fsma204Compliant?: boolean;
  effectivenessVerified?: boolean;
  sourceId?: string;
  relatedDocuments?: any[];
  relatedTraining?: any[];
}

export interface CAPAFilter {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CAPAFetchParams {
  status?: CAPAStatus;
  priority?: string;
  source?: string;
  searchQuery?: string;
  dueDate?: string;
}
