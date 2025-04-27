
export type CAPAStatus = 
  | 'Open' 
  | 'In_Progress' 
  | 'Under_Review' 
  | 'Completed' 
  | 'Closed' 
  | 'Rejected'
  | 'On_Hold';

export type EffectivenessRating = 
  | 'Not_Effective' 
  | 'Partially_Effective' 
  | 'Effective' 
  | 'Highly_Effective';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  completionDate?: string;
  assignedTo: string;
  source: string;
  sourceId?: string;
  department?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  effectivenessCriteria?: string;
  effectivenessRating?: EffectivenessRating;
  effectivenessVerified?: boolean;
  verificationDate?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  fsma204Compliant?: boolean;
}

export interface CAPAAction {
  id: string;
  capaId: string;
  description: string;
  actionType: 'Corrective' | 'Preventive';
  status: 'Open' | 'In_Progress' | 'Completed';
  assignedTo: string;
  dueDate: string;
  completionDate?: string;
  comments?: string;
}

export interface CAPAActivity {
  id: string;
  capaId: string;
  actionType: string;
  actionDescription: string;
  performedBy: string;
  performedAt: string;
  oldStatus?: CAPAStatus;
  newStatus?: CAPAStatus;
  metadata?: Record<string, any>;
}
