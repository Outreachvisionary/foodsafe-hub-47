
export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue';
export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TrainingType = 'Onboarding' | 'Compliance' | 'Technical' | 'Safety' | 'Leadership';
export type TrainingCategory = 'Food Safety' | 'Quality' | 'Regulatory' | 'Operations' | 'Management' | 'Other';

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  target_roles?: string[];
  courses?: string[];
  priority?: string;
  status?: string;
  is_required?: boolean;
  duration_days?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;
  is_automated?: boolean;
  target_departments?: string[];
  automation_trigger?: string;
  created_by?: string;
  related_standards?: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  duration_hours?: number;
  prerequisite_courses?: string[];
  created_at: string;
  created_by: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  training_type: TrainingType;
  assigned_to: string[];
  start_date?: string;
  due_date?: string;
  completion_status?: TrainingStatus;
  is_recurring?: boolean;
  recurring_interval?: number;
  department?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  training_category?: TrainingCategory;
  materials_id?: string[];
  required_roles?: string[];
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status?: TrainingStatus;
  assigned_date?: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  notes?: string;
  last_recurrence?: string;
  next_recurrence?: string;
}
