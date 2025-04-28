export type CAPAStatus = 
  | 'Open'
  | 'In_Progress'
  | 'Closed'
  | 'Overdue'
  | 'Pending_Verification'
  | 'Verified';

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
  sourceReference: string; // Add this field
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
