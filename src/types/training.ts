
import { TrainingCategory, TrainingStatus, TrainingType } from './enums';

export interface TrainingSession {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  startDate?: string;
  start_date?: string;
  participants?: string[];
  created_at: string;
  updated_at: string;
  training_type: string;
  completion_status: string;
  assigned_to: string[];
  created_by: string;
  is_recurring: boolean;
  department?: string;
  required_roles?: string[];
  training_category?: string;
  due_date?: string;
  materials_id?: string[];
  recurring_interval?: number;
}

export interface TrainingPlan {
  id: string;
  name: string;
  title?: string;
  description?: string;
  target_roles: string[];
  targetRoles?: string[];
  target_departments: string[];
  targetDepartments?: string[];
  courses: string[];
  duration_days: number;
  durationDays?: number;
  is_required: boolean;
  isRequired?: boolean;
  priority: string;
  status: string;
  start_date: string;
  startDate?: string;
  end_date: string;
  endDate?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  required_for: string[];
  is_active: boolean;
  is_automated: boolean;
  automation_trigger?: string;
  related_standards?: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  duration_hours: number;
  duration_minutes: number;
  passing_score: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export enum TrainingPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface DepartmentStat {
  department: string;
  name: string;
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
  employeeId: string;
  employeeName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: string;
}
