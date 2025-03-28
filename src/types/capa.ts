
// Types for CAPA (Corrective and Preventive Action) module

export type CAPAStatus = 'open' | 'in-progress' | 'closed' | 'verified';

export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';

export type CAPASource = 'audit' | 'haccp' | 'supplier' | 'complaint' | 'traceability' | 'nonconformance';

export type CAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Not Effective';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  source: CAPASource;
  sourceId: string;
  priority: CAPAPriority;
  status: CAPAStatus;
  assignedTo: string;
  department: string;
  dueDate: string;
  createdDate: string;
  lastUpdated: string;
  completedDate?: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  verificationMethod?: string;
  verificationDate?: string;
  verifiedBy?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessScore?: number;
  relatedDocuments?: string[];
  relatedTraining?: string[];
  fsma204Compliant: boolean;
  sourceReference?: SourceReference; // Added to store details about the source
}

// New interface to store information about the source of a CAPA
export interface SourceReference {
  id: string;
  type: CAPASource;
  title: string;
  description?: string;
  date?: string;
  status?: string;
  url?: string; // URL to navigate to the source record
}

export interface CAPAFilters {
  status: string;
  priority: string;
  source: string;
  dueDate: string;
  department?: string;
  assignedTo?: string;
}

export interface CAPAFetchParams extends Partial<CAPAFilters> {
  sourceId?: string;
  limit?: number;
  offset?: number;
  searchQuery?: string; // Add searchQuery parameter
}

export interface CAPAEffectivenessMetrics {
  rootCauseEliminated: boolean;
  preventiveMeasuresImplemented: boolean;
  documentationComplete: boolean;
  recurrenceCheck: 'Passed' | 'Minor Issues' | 'Failed';
  score: number;
  notes?: string;
  assessmentDate?: string;
}

export interface CAPAReport {
  id: string;
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  filters: CAPAFilters;
  generatedBy: string;
  generatedDate: string;
  sections: Array<{
    title: string;
    content: any;
  }>;
  format: 'pdf' | 'excel' | 'csv' | 'html' | 'xml';
  regulatoryCompliant?: boolean;
}

export interface CAPAStats {
  total: number;
  byStatus: Record<CAPAStatus, number>;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<CAPASource, number>;
  overdue: number;
  averageClosureTime?: number;
  effectivenessRating?: {
    effective: number;
    partiallyEffective: number;
    notEffective: number;
  };
  fsma204ComplianceRate?: number;
}
