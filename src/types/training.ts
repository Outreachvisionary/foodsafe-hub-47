
import { TrainingStatus, TrainingType, TrainingCategory } from '@/types/enums';

// Re-export the enums for use elsewhere
export { TrainingStatus, TrainingType, TrainingCategory };

// Define training completion status type
export type TrainingCompletionStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';

// Define training priority type
export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  prerequisite_courses?: string[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  title?: string; // Added for compatibility with existing code
  description: string;
  targetRoles: string[];
  targetDepartments: string[];
  courses: string[];
  durationDays: number;
  isRequired: boolean;
  priority: TrainingPriority;
  status: string;
  startDate: string;
  endDate: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  required_for: string[];
  is_active: boolean;
}

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  due_date?: string; // Added for compatibility
  department?: string; // Added for compatibility
  training_type?: TrainingType; // Added for compatibility
  training_category?: TrainingCategory; // Added for compatibility
  assigned_to?: string[]; // Added for compatibility
  participants: string[];
  completionStatus?: TrainingCompletionStatus;
  completion_status?: string; // Added for compatibility
  materials_id?: string[]; // Added for compatibility
  required_roles?: string[]; // Added for compatibility
  is_recurring?: boolean; // Added for compatibility
  recurring_interval?: string; // Added for compatibility
  created_by?: string; // Added for compatibility
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

export interface DepartmentStat {
  department: string;
  total: number;
  completed: number;
  overdue: number;
  compliance: number; // Add this property
}

export interface TrainingStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  complianceRate: number;
  byDepartment: DepartmentStat[];
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  recentActivity: any[];
}
