
import { CAPAStatus, CAPASource, CAPAPriority, EffectivenessRating } from '@/types/enums';

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
  source: CAPASource;
  source_id?: string;
  due_date: string;
  completion_date?: string;
  verification_date?: string;
  effectiveness_criteria?: string;
  effectiveness_verified: boolean;
  effectiveness_rating?: EffectivenessRating;
  department?: string;
  verification_method?: string;
  verified_by?: string;
  fsma204_compliant: boolean;
  created_at: string;
  updated_at: string;
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

export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  byPriority: Record<CAPAPriority, number>;
  bySource: Record<CAPASource, number>;
  byDepartment: Record<string, number>;
  recentActivities: CAPAActivity[];
}

export interface CreateCAPARequest {
  title: string;
  description: string;
  priority: CAPAPriority;
  assigned_to: string;
  source: CAPASource;
  source_id?: string;
  due_date: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  effectiveness_criteria?: string;
  department?: string;
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
  effectiveness_criteria?: string;
  effectiveness_verified?: boolean;
  effectiveness_rating?: EffectivenessRating;
  department?: string;
  verification_method?: string;
  verified_by?: string;
}

// Export enums for backward compatibility
export { CAPAStatus, CAPASource, CAPAPriority, EffectivenessRating };
