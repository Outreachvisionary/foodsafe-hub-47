
export type TrainingStatus = 
  | 'Not Started' 
  | 'In Progress' 
  | 'Completed' 
  | 'Overdue' 
  | 'Failed'
  | 'Cancelled';

export type TrainingCategory = 
  | 'haccp' 
  | 'gmp' 
  | 'food-safety' 
  | 'regulatory' 
  | 'quality-control' 
  | 'equipment' 
  | 'allergen-management' 
  | 'sanitation' 
  | 'workplace-safety' 
  | 'other';

export type TrainingType = 
  | 'classroom' 
  | 'online' 
  | 'on-job' 
  | 'self-study';

export type TrainingPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

// Add missing TrainingCompletionStatus for backward compatibility
export type TrainingCompletionStatus = TrainingStatus;

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: TrainingType;
  training_category: TrainingCategory;
  department?: string;
  start_date?: string;
  due_date: string;
  assigned_to: string[];
  materials_id?: string[];
  is_recurring?: boolean;
  recurring_interval?: number;
  required_roles?: string[];
  completion_status?: TrainingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

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
  notes?: string;
  last_recurrence?: string;
  next_recurrence?: string;
}

export interface TrainingStatistics {
  overallCompliance: number;
  departmentCompliance: Array<{
    department: string;
    completed: number;
    total: number;
    compliance: number;
  }>;
  expiringCertifications: Array<{
    name: string;
    employee: string;
    expires: string;
  }>;
  upcomingTrainings: Array<{
    name: string;
    date: string;
    participants: number;
  }>;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  courses?: string[];
  target_roles?: string[];
  target_departments?: string[];
  duration_days?: number;
  is_required?: boolean;
  is_automated?: boolean;
  automation_trigger?: string;
  start_date?: string;
  end_date?: string;
  priority?: TrainingPriority;
  status?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  related_standards?: string[];
}

// Department statistics interface for dashboard component
export interface DepartmentStat {
  department: string;
  totalAssigned: number;
  completed: number;
  overdue: number;
  compliance: number;
  name: string;
  complianceRate: number;
}
