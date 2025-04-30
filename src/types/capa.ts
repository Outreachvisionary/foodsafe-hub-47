
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';

// Re-export the enums for use elsewhere
export { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating };

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  source: CAPASource;
  source_id?: string;
  assigned_to: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  completion_date?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  verification_method?: string;
  effectiveness_criteria?: string;
  effectiveness_rating?: CAPAEffectivenessRating;
  verified_by?: string;
  verification_date?: string;
  fsma204_compliant?: boolean;
  department_id?: string;
  facility_id?: string;
  department?: string;
  source_reference?: string;
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
  metadata?: Record<string, any>;
}

export interface CAPAStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<CAPASource, number>;
  byDepartment?: Record<string, number>;
  recentActivities: CAPAActivity[];
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
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CAPAFetchParams extends CAPAFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchQuery?: string;
}

export interface CAPAEffectivenessAssessment {
  id: string;
  capa_id: string;
  assessment_date: string;
  root_cause_eliminated: boolean;
  preventive_measures_implemented: boolean;
  documentation_complete: boolean;
  score: number;
  rating: CAPAEffectivenessRating;
  recurrence_check: string;
  notes?: string;
  created_by: string;
}
