
export type CAPAStatus = 
  | 'Open'
  | 'In_Progress' 
  | 'Under_Review'
  | 'Completed'
  | 'Closed'
  | 'Rejected'
  | 'On_Hold'
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
  | 'Internal_Issue'
  | 'Regulatory'
  | 'Supplier_Issue'
  | 'Non_Conformance'
  | 'Management_Review'
  | 'Other';

export type CAPAEffectivenessRating =
  | 'Not_Effective'
  | 'Partially_Effective'
  | 'Effective'
  | 'Highly_Effective';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  assignedTo: string;
  source: CAPASource;
  completionDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  effectivenessCriteria?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessVerified?: boolean;
  verificationDate?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  department?: string;
  sourceId?: string;
  source_reference: string;
  fsma204Compliant?: boolean;
  relatedDocuments?: string[];
  relatedTraining?: string[];
}

export interface CAPAListProps {
  capas: CAPA[];
  onCAPAClick?: (capa: CAPA) => void;
}
