
import { CAPAStatus, CAPAPriority, CAPASource, EffectivenessRating } from '@/types/enums';

// Re-export enums for convenience
export { CAPAStatus, CAPAPriority, CAPASource, EffectivenessRating };

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  created_at: string;
  updated_at: string;
  created_by: string;
  due_date: string;
  assigned_to: string;
  source: CAPASource;
  source_id?: string;
  completion_date?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  effectiveness_criteria?: string;
  department?: string;
  fsma204_compliant?: boolean;
  effectiveness_verified?: boolean;
  effectiveness_rating?: EffectivenessRating;
  verification_date?: string;
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
  metadata?: Record<string, any>;
}

export interface CAPAStats {
  total: number;
  open: number;
  openCount: number;
  closed: number;
  closedCount: number;
  completed: number;
  inProgress: number;
  overdue: number;
  overdueCount: number;
  pendingVerificationCount: number;
  byStatus: Record<CAPAStatus, number>;
  bySource: Record<CAPASource, number>;
  byPriority: Record<CAPAPriority, number>;
  byDepartment: Record<string, number>;
  completedThisMonth: number;
  averageResolutionTime: number;
  upcomingDueDates: Array<{
    id: string;
    title: string;
    due_date: string;
    priority: string;
  }>;
  recentActivities: CAPAActivity[];
}

export interface CAPAFilter {
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  searchTerm?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  assignedTo?: string | string[];
  department?: string | string[];
}

export interface UpdateCAPARequest {
  title?: string;
  description?: string;
  status?: CAPAStatus;
  priority?: CAPAPriority;
  assigned_to?: string;
  due_date?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  effectiveness_criteria?: string;
  department?: string;
  effectiveness_verified?: boolean;
  effectiveness_rating?: EffectivenessRating;
  verification_date?: string;
  verification_method?: string;
  verified_by?: string;
}

export interface CreateCAPARequest {
  title: string;
  description: string;
  priority: CAPAPriority;
  source: CAPASource;
  assigned_to: string;
  created_by: string;
  due_date: string;
  department?: string;
}

export interface CAPAListProps {
  items: CAPA[];
  loading: boolean;
  error: string | null;
  onCAPAClick: (capa: CAPA) => void;
}

export interface CreateCAPADialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCAPARequest) => void;
}
