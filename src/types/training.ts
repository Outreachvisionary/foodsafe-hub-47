
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
