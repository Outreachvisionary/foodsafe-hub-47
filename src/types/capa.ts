
export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Verified';
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical';
export type CAPASource = 'audit' | 'complaint' | 'non_conformance' | 'supplier' | 'haccp' | 'traceability';
export type CAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Evaluated';

export interface SourceReference {
  type: string;
  title: string;
  id: string;
  url?: string;
  date?: string;
}

export interface CAPAEffectivenessMetrics {
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  score: number;
  checkedDate: string;
  notes?: string;
}

export interface CAPA {
  id: string;
  title: string;
  description: string;
  source: CAPASource;
  sourceId?: string;
  sourceReference?: SourceReference;
  priority: CAPAPriority;
  status: CAPAStatus;
  dueDate: string;
  assignedTo: string;
  department?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  completedDate?: string;
  verificationDate?: string;
  createdBy: string;
  lastUpdated: string;
  effectivenessVerified?: boolean;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessCriteria?: string;
  fsma204Compliant?: boolean;
  verificationMethod?: string;
  verifiedBy?: string;
}

// For compatibility with existing code
export interface CAPAAction extends CAPA {}
