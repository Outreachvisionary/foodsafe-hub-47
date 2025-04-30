
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';

export { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating };

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: CAPAPriority;
  created_at: string;
  updated_at: string;
  due_date: string;
  completion_date?: string;
  verified_date?: string;
  source: CAPASource;
  source_id?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  assigned_to: string;
  created_by: string;
  department?: string;
  fsma204_compliant: boolean;
  verification_method?: string;
  verified_by?: string;
  effectiveness_criteria?: string;
  effectiveness_verified?: boolean;
  effectiveness_rating?: CAPAEffectivenessRating;
}

export interface CAPAActivity {
  id: string;
  capa_id: string;
  action_type: string;
  action_description: string;
  performed_at: string;
  performed_by: string;
  old_status?: CAPAStatus;
  new_status?: CAPAStatus;
  metadata?: any;
}

export interface CAPAAttachment {
  id: string;
  capa_id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface CAPARelatedDocument {
  id: string;
  capa_id: string;
  document_id: string;
  added_at: string;
  added_by: string;
  document_type?: string;
}

export interface CAPAStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<CAPASource, number>;
  byDepartment: Record<string, number>;
  recentActivities: CAPAActivity[];
}

export interface CAPAFilter {
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  department?: string | string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}
