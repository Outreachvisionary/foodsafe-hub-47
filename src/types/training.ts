
export type TrainingStatus = 
  | 'Not Started' 
  | 'In Progress' 
  | 'Completed' 
  | 'Overdue' 
  | 'Failed';

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

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: 'classroom' | 'online' | 'on-job' | 'self-study';
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
