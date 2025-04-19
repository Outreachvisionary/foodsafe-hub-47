
// Define the types for Training

export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
export type TrainingCompletionStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
export type TrainingType = 'classroom' | 'online' | 'self-study' | 'on-the-job' | 'workshop' | 'certification';
export type TrainingCategory = 'food-safety' | 'gmp' | 'haccp' | 'quality' | 'regulatory' | 'technical' | 'leadership' | 'other';
export type TrainingPriority = 'critical' | 'high' | 'medium' | 'low';
export type EmployeeRole = 'operator' | 'supervisor' | 'manager' | 'qc' | 'maintenance' | 'administrative' | 'executive';
export type Department = 'production' | 'quality' | 'maintenance' | 'warehouse' | 'rd' | 'admin' | 'executive' | 'sales' | 'it';

export interface TrainingRecord {
  id: string;
  employee_id: string;
  session_id: string;
  status: TrainingStatus;
  completion_date?: string;
  score?: number;
  due_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  assigned_date: string;
}

export interface ExtendedTrainingRecord extends TrainingRecord {
  courseName: string;
  instructorName: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  training_type: TrainingType;
  training_category: TrainingCategory;
  department: string;
  start_date: string;
  due_date: string;
  assigned_to: string[];
  materials_id: string[];
  required_roles: string[];
  is_recurring: boolean;
  recurring_interval: string;
  completion_status: TrainingCompletionStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentTrainingStats {
  department: string;
  name: string;
  completed: number;
  overdue: number;
  totalAssigned: number;
  complianceRate: number;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  target_roles: string[];
  courses: string[];
  duration_days: number;
  is_required: boolean;
  priority: TrainingPriority;
  status: string;
  start_date: string;
  end_date: string;
  is_automated: boolean;
  automation_trigger?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  target_departments: string[];
  related_standards: string[];
}

export interface TrainingAutomationConfig {
  id: string;
  enabled: boolean;
  rules: any[];
  documentChangesTrigger: boolean;
  newEmployeeTrigger: boolean;
  roleCangeTrigger: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface AutoAssignRule {
  id: string;
  name: string;
  conditions: {
    key: string;
    operator: string;
    value: any;
  }[];
  training_plan_id: string;
}

export interface DocumentControlIntegration {
  enabled: boolean;
  documentTypes: string[];
  assignToViewers: boolean;
  assignToEditors: boolean;
  assignToApprovers: boolean;
}
