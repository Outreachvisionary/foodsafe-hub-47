
import { TrainingStatus, TrainingType, TrainingCategory } from '@/types/enums';

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  last_recurrence?: string;
  next_recurrence?: string;
  notes?: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: TrainingType;
  training_category: TrainingCategory;
  assigned_to: string[];
  start_date: string;
  due_date: string;
  created_by: string;
  required_roles: string[];
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string;
}

// Missing interfaces that were causing build errors
export interface TrainingPlan {
  id: string;
  name: string;
  title?: string;
  description: string;
  courses: string[];
  coursesIncluded?: string[];
  target_roles: string[];
  targetRoles?: string[];
  target_departments: string[];
  targetDepartments?: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  department_id?: string;
  is_active: boolean;
  priority: TrainingPriority;
  status: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  duration_days?: number;
  isRequired?: boolean;
  is_required?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
  department?: string;
  role?: string;
  hire_date?: string;
  status?: string;
  [key: string]: any; // For flexible property access in auto-assign rules
}

export interface AutoAssignRule {
  id: string;
  name: string;
  conditions: AutoAssignCondition[];
  actions: AutoAssignAction[];
  is_active: boolean;
  priority: number;
}

export interface AutoAssignCondition {
  key: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
  value: string | number | boolean;
}

export interface AutoAssignAction {
  type: 'assign_training' | 'assign_plan' | 'notify';
  target_id: string;
  parameters?: Record<string, any>;
}

export interface TrainingAutomationConfig {
  id: string;
  enabled: boolean;
  rules: AutoAssignRule[];
  document_changes_trigger: boolean;
  new_employee_trigger: boolean;
  role_change_trigger: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface DocumentControlIntegration {
  id: string;
  document_id: string;
  training_requirements: string[];
  auto_assign_on_update: boolean;
  notification_settings: Record<string, any>;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  content_url?: string;
  duration_minutes: number;
  passing_score: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
  category: TrainingCategory;
  tags?: string[];
}

export interface Certification {
  id: string;
  name?: string;
  certificationName?: string;
  employee_id: string;
  employee_name: string;
  expiryDate: string;
  issued_date?: string;
  status?: string;
  certification_body?: string;
}

export interface DepartmentStat {
  name: string;
  department: string;
  completed: number;
  overdue: number;
  totalAssigned: number;
  complianceRate: number;
  compliance?: number; // Alias for backward compatibility
}

export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TrainingCompletionStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';

// Re-export types from enums for better compatibility
export { TrainingStatus, TrainingType, TrainingCategory };
