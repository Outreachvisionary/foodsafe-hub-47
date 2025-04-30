
import { TrainingStatus, TrainingType, TrainingCategory } from './enums';

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
  title: string;
  description: string;
  courses: string[];
  required_for: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  department_id?: string;
  is_active: boolean;
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
  category: TrainingCategory;
  tags?: string[];
}

export interface TrainingModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content_type: "video" | "document" | "quiz" | "interactive";
  content_url: string;
  duration_minutes: number;
  order: number;
}

export interface TrainingStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  complianceRate: number;
  byDepartment: Record<string, {
    total: number;
    completed: number;
    complianceRate: number;
  }>;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
}
