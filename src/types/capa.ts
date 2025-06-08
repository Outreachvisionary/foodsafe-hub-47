
export type CAPAStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue' | 'Pending Verification';
export type CAPAPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type CAPASource = 'Audit' | 'Complaint' | 'Non-Conformance' | 'Management Review' | 'Supplier Issue' | 'Other';
export type CAPAEffectivenessRating = 'Effective' | 'Partially Effective' | 'Not Effective';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  priority: CAPAPriority;
  status: CAPAStatus;
  assigned_to: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  completion_date?: string;
  verification_date?: string;
  source: CAPASource;
  source_id?: string;
  department?: string;
  effectiveness_verified?: boolean;
  effectiveness_rating?: CAPAEffectivenessRating;
  effectiveness_criteria?: string;
  verification_method?: string;
  verified_by?: string;
  fsma204_compliant?: boolean;
}

export interface CreateCAPARequest {
  title: string;
  description: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  priority: CAPAPriority;
  assigned_to: string;
  created_by: string;
  due_date: string;
  source: CAPASource;
  source_id?: string;
  department?: string;
  effectiveness_criteria?: string;
}

export interface UpdateCAPARequest {
  id: string;
  title?: string;
  description?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  priority?: CAPAPriority;
  status?: CAPAStatus;
  assigned_to?: string;
  due_date?: string;
  completion_date?: string;
  verification_date?: string;
  department?: string;
  effectiveness_verified?: boolean;
  effectiveness_rating?: CAPAEffectivenessRating;
  effectiveness_criteria?: string;
  verification_method?: string;
  verified_by?: string;
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

export interface CAPAEffectivenessAssessment {
  id: string;
  capa_id: string;
  assessment_date: string;
  root_cause_eliminated?: boolean;
  preventive_measures_implemented?: boolean;
  documentation_complete?: boolean;
  score?: number;
  rating?: CAPAEffectivenessRating;
  recurrence_check?: string;
  notes?: string;
  created_by: string;
}

export interface CAPAFilter {
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  assigned_to?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface CAPAListProps {
  capas: CAPA[];
  onCAPAClick?: (capa: CAPA) => void;
  onCAPAEdit?: (capa: CAPA) => void;
  onCAPADelete?: (capaId: string) => void;
}

// Enum values for easy iteration
export const CAPAStatusValues = ['Open', 'In Progress', 'Closed', 'Overdue', 'Pending Verification'] as const;
export const CAPAPriorityValues = ['Low', 'Medium', 'High', 'Critical'] as const;
export const CAPASourceValues = ['Audit', 'Complaint', 'Non-Conformance', 'Management Review', 'Supplier Issue', 'Other'] as const;
export const CAPAEffectivenessRatingValues = ['Effective', 'Partially Effective', 'Not Effective'] as const;
