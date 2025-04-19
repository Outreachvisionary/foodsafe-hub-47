
export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: string;
  training_category?: string;
  department?: string;
  start_date?: string;
  due_date?: string;
  assigned_to: string[];
  materials_id?: string[];
  required_roles?: string[];
  is_recurring?: boolean;
  recurring_interval?: number;
  completion_status: TrainingStatus;
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
  last_recurrence?: string;
  next_recurrence?: string;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  targetRoles: string[];
  targetDepartments?: string[];
  coursesIncluded: string[];
  durationDays: number;
  isRequired: boolean;
  priority?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  isAutomated?: boolean;
  automationTrigger?: string;
  relatedStandards?: string[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
  
  // Database equivalents
  courses?: string[];
  duration_days?: number;
  is_required?: boolean;
  start_date?: string;
  end_date?: string;
  is_automated?: boolean;
  automation_trigger?: string;
  target_roles?: string[];
  target_departments?: string[];
  related_standards?: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  durationHours?: number;
  prerequisites?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
