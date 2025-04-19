
// Define the common types used across the training system

export type TrainingType = 'onboarding' | 'food-safety' | 'regulatory' | 'quality' | 'procedural' | 'operational' | 'technical' | 'soft-skills';

export type TrainingCategory = 'haccp' | 'gmp' | 'fsma' | 'allergen' | 'sanitation' | 'quality' | 'safety' | 'compliance' | 'leadership' | 'technical' | 'other';

export type TrainingPriority = 'critical' | 'high' | 'medium' | 'low';

export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';

export type TrainingCompletionStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';

export type Department = string;

export type EmployeeRole = string;

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
  completion_status: TrainingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  target_roles: EmployeeRole[];
  courses: string[];
  duration_days: number;
  is_required: boolean;
  priority: TrainingPriority;
  status: string;
  start_date: string;
  end_date: string;
  is_automated: boolean;
  automation_trigger: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  target_departments: Department[];
  related_standards: string[];
  // Legacy fields for compatibility
  targetRoles?: EmployeeRole[];
  coursesIncluded?: string[];
  durationDays?: number;
  isRequired?: boolean;
  startDate?: string;
  endDate?: string;
  isAutomated?: boolean;
  automationTrigger?: string;
  createdBy?: string;
  createdDate?: string;
  targetDepartments?: Department[];
  relatedStandards?: string[];
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  last_recurrence?: string;
  next_recurrence?: string;
  employee_id: string;
  employee_name: string;
  notes?: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  duration_hours: number;
  prerequisite_courses: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentTrainingStats {
  id: string;
  name: string;
  totalTrainings: number;
  completedTrainings: number;
  overdueTrainings: number;
  complianceRate: number;
  averageScore?: number;
}

export interface TrainingCompetencyData {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  completedTrainings: number;
  requiredTrainings: number;
  competencyScore: number;
  lastAssessmentDate: string;
  certifications: string[];
}
