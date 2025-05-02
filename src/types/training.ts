
import { TrainingStatus, TrainingType, TrainingCategory } from '@/types/enums';

export interface Training {
  id: string;
  title: string;
  description?: string;
  status: TrainingStatus;
  type: TrainingType;
  category?: TrainingCategory;
  start_date: string;
  due_date?: string;
  completion_date?: string;
  completion_score?: number;
  assigned_to: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  completion_certificate?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  required_roles?: string[];
  department_id?: string;
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date?: string;
  completed_date?: string;
  score?: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  target_roles?: string[];
  target_departments?: string[];
  duration_days?: number;
  is_required: boolean;
  start_date?: string;
  end_date?: string;
  status: string;
  priority?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  courses: string[];
  coursesIncluded?: Course[];
  is_automated: boolean;
  automation_trigger?: string;
  related_standards?: string[];
  required_for?: string[];
  is_active?: boolean;
}

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: TrainingType;
  training_category?: TrainingCategory;
  start_date?: string;
  due_date?: string;
  completion_status: TrainingStatus;
  assigned_to: string[];
  department?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_recurring: boolean;
  recurring_interval?: number;
  materials_id?: string[];
  required_roles?: string[];
  participants?: string[];
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  content_url?: string;
  duration_minutes: number;
  passing_score: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
  category: string;
  tags?: string[];
  is_active: boolean;
  duration_hours?: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  duration_hours?: number;
  is_active: boolean;
  prerequisite_courses?: string[];
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
  department?: string;
  role?: string;
  hire_date?: string;
  status: 'active' | 'inactive' | 'onboarding';
}

export interface DocumentControlIntegration {
  document_id: string;
  training_required: boolean;
  training_session_id?: string;
  update_triggers_training: boolean;
  target_roles?: string[];
  expiration_triggers_training?: boolean;
}

export interface TrainingAutomationConfig {
  id: string;
  enabled: boolean;
  document_changes_trigger: boolean;
  new_employee_trigger: boolean;
  role_change_trigger: boolean;
  rules: AutoAssignRule[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface AutoAssignRule {
  id: string;
  trigger_type: 'document_change' | 'new_employee' | 'role_change' | 'department_change' | 'standard_update';
  condition: {
    document_category?: string[];
    role?: string[];
    department?: string[];
    standard?: string[];
  };
  training_plan_id?: string;
  training_session_id?: string;
  is_active: boolean;
}

export interface DepartmentStat {
  name: string;
  department: string;
  total: number;
  completed: number;
  overdue: number;
  compliance: number;
  totalAssigned: number;
  complianceRate: number;
}

export interface Certification {
  id: string;
  name: string;
  employee: string;
  employeeId: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: 'active' | 'expired' | 'revoked';
}

export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';
