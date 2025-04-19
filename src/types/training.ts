
export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Canceled';
export type TrainingPriority = 'low' | 'medium' | 'high' | 'critical';
export type TrainingType = 'compliance' | 'onboarding' | 'skills' | 'safety' | 'food-safety' | 'technical' | 'management' | 'Online' | 'In-person' | 'Video' | 'Document';
export type TrainingCategory = 'haccp' | 'gmp' | 'fsma' | 'safety' | 'quality' | 'operations' | 'maintenance' | 'regulatory' | 'other';
export type TrainingCompletionStatus = 'completed' | 'in-progress' | 'not-started' | 'canceled';
export type EmployeeRole = 'admin' | 'manager' | 'supervisor' | 'line-worker' | 'quality' | 'maintenance' | 'operations' | 'hr';
export type Department = 'production' | 'quality' | 'maintenance' | 'operations' | 'management' | 'hr' | 'sales' | 'administration';

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
  next_recurrence?: string;
  last_recurrence?: string;
  notes?: string;
}

export interface ExtendedTrainingRecord extends TrainingRecord {
  courseName: string;
  instructorName?: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: TrainingType;
  training_category: TrainingCategory;
  department?: string;
  start_date: string;
  due_date: string;
  assigned_to?: string[];
  materials_id?: string;
  required_roles?: string[];
  is_recurring?: boolean;
  recurring_interval?: string;
  completion_status: TrainingCompletionStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  targetRoles?: EmployeeRole[];
  target_roles?: EmployeeRole[];
  coursesIncluded?: string[];
  courses?: string[];
  durationDays?: number;
  duration_days?: number;
  isRequired?: boolean;
  is_required?: boolean;
  priority?: TrainingPriority;
  status?: string;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  isAutomated?: boolean;
  is_automated?: boolean;
  automationTrigger?: string;
  automation_trigger?: string;
  created_by?: string;
  createdDate?: string;
  created_at?: string;
  updated_at?: string;
  targetDepartments?: Department[];
  target_departments?: Department[];
  relatedStandards?: string[];
  related_standards?: string[];
  recurringSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    interval: number;
    startDate: string;
    endDate?: string;
  };
}

export interface DepartmentTrainingStats {
  departmentName: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  overdue: number;
  compliancePercentage: number;
  completedCount: number;
  overdueCount: number;
  employeeCount: number;
}

export interface TrainingAutomationConfig {
  id: string;
  name: string;
  description?: string;
  triggerEvent: 'onboarding' | 'role_change' | 'compliance_update' | 'scheduled';
  targetRoles?: EmployeeRole[];
  targetDepartments?: Department[];
  trainingPlanId: string;
  daysToComplete: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}
