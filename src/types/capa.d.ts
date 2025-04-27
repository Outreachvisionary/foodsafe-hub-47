
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

export type CAPAPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type CAPASource = 'Audit' | 'Customer Complaint' | 'Internal' | 'Regulatory' | 'Other';

export type CAPAEffectivenessRating = 'Not_Effective' | 'Partially_Effective' | 'Effective' | 'Highly_Effective';

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
  sourceReference?: string;
  fsma204Compliant?: boolean;
  relatedDocuments: any[];
  relatedTraining: any[];
}

export interface CAPAActivity {
  id: string;
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_by: string;
  performed_at: string;
  old_status?: CAPAStatus;
  new_status?: CAPAStatus;
  metadata?: any;
}

// Add DB to App mapping adapter for CAPA
export interface CAPAFromDB {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  created_by: string;
  due_date: string;
  assigned_to: string;
  source: string;
  completion_date?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  effectiveness_criteria?: string;
  effectiveness_rating?: string;
  effectiveness_verified?: boolean;
  verification_date?: string;
  verification_method?: string;
  verified_by?: string;
  department?: string;
  source_id?: string;
  source_reference?: string;
  fsma204_compliant?: boolean;
}

export function mapDBToAppCAPA(dbCapa: CAPAFromDB): CAPA {
  return {
    id: dbCapa.id,
    title: dbCapa.title,
    description: dbCapa.description,
    status: mapDBToCAPAStatus(dbCapa.status),
    priority: dbCapa.priority as CAPAPriority,
    createdAt: dbCapa.created_at,
    createdBy: dbCapa.created_by,
    dueDate: dbCapa.due_date,
    assignedTo: dbCapa.assigned_to,
    source: dbCapa.source as CAPASource,
    completionDate: dbCapa.completion_date,
    rootCause: dbCapa.root_cause,
    correctiveAction: dbCapa.corrective_action,
    preventiveAction: dbCapa.preventive_action,
    effectivenessCriteria: dbCapa.effectiveness_criteria,
    effectivenessRating: dbCapa.effectiveness_rating as CAPAEffectivenessRating,
    effectivenessVerified: dbCapa.effectiveness_verified,
    verificationDate: dbCapa.verification_date,
    verificationMethod: dbCapa.verification_method,
    verifiedBy: dbCapa.verified_by,
    department: dbCapa.department,
    sourceId: dbCapa.source_id,
    sourceReference: dbCapa.source_reference,
    fsma204Compliant: dbCapa.fsma204_compliant,
    relatedDocuments: [],
    relatedTraining: []
  };
}

function mapDBToCAPAStatus(status: string): CAPAStatus {
  const statusMap: Record<string, CAPAStatus> = {
    'Open': 'Open',
    'In Progress': 'In_Progress',
    'Under Review': 'Under_Review',
    'Completed': 'Completed',
    'Closed': 'Closed',
    'Rejected': 'Rejected',
    'On Hold': 'On_Hold',
    'Overdue': 'Overdue',
    'Pending Verification': 'Pending_Verification',
    'Verified': 'Verified'
  };
  
  return statusMap[status] || 'Open';
}

// Interface for stats
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

// Filter interface for CAPA queries
export interface CAPAFilter {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

// Parameters for fetching CAPAs
export interface CAPAFetchParams {
  status?: CAPAStatus;
  priority?: CAPAPriority;
  source?: CAPASource;
  searchQuery?: string;
  dueDate?: string;
}
