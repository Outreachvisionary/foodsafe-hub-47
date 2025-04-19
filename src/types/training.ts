// Define the TrainingStatus type directly
export type TrainingStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';

// Define TrainingRecord type directly instead of importing it
export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date?: string;
  due_date: string;
  completion_date?: string;
  score?: number;
  pass_threshold?: number;
  next_recurrence?: string;
  last_recurrence?: string;
  notes?: string;
}

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
  completion_status?: TrainingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ExtendedTrainingRecord extends TrainingRecord {
  courseName?: string;
  instructorName?: string;
}

// Training plan interface with ALL needed properties
export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  targetRoles: string[];
  coursesIncluded: string[];
  durationDays: number;
  isRequired: boolean;
  priority: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  isAutomated?: boolean;
  automationTrigger?: string;
  recurringSchedule?: {
    frequency: string;
    interval: number;
    startDate?: string;
  };
  courses?: string[]; // Add this for backward compatibility
  targetDepartments?: string[]; // Add this to fix TrainingPlans.tsx errors
  createdBy?: string; // Add this to fix the createdBy property errors
  createdDate?: string; // Add this for completeness
  relatedStandards?: string[]; // Add this for completeness
  created_by?: string; // For database compatibility
  created_at?: string; // For database compatibility
  updated_at?: string; // For database compatibility
  duration_days?: number; // For database compatibility
  target_roles?: string[]; // For database compatibility
  target_departments?: string[]; // For database compatibility
  is_required?: boolean; // For database compatibility
  is_automated?: boolean; // For database compatibility
  start_date?: string; // For database compatibility
  end_date?: string; // For database compatibility
  automation_trigger?: string; // For database compatibility
  related_standards?: string[]; // For database compatibility
}

export interface EmployeeRole {
  id: string;
  name: string;
  department: string;
  level: string;
}

export interface Department {
  id: string;
  name: string;
  manager?: string;
}

export interface TrainingPriority {
  id: string;
  level: string;
  color: string;
}

export interface DepartmentTrainingStats {
  departmentName: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  overdue: number;
  compliancePercentage: number;
  department?: string; // For compatibility with existing component
  compliance?: number; // For compatibility with existing component
  completedCount?: number; // For compatibility with DepartmentComplianceChart
  overdueCount?: number; // For compatibility with DepartmentComplianceChart
  employeeCount?: number; // For compatibility with DepartmentComplianceChart
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  hireDate?: string;
  competencyAssessments?: Array<{
    assessmentDate: string;
    score: number;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    expiryDate: string;
    requiresRecertification: boolean;
  }>;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  prerequisiteCourses?: string[];
}

export interface AutoAssignRule {
  type: 'Role' | 'Department' | 'NewHire' | 'CompetencyScore';
  conditions: Array<{
    key: string;
    operator: '=' | '>' | '<' | '>=' | '<=' | '!=';
    value: string | number;
  }>;
}

export interface TrainingAutomationConfig {
  enabled: boolean;
  rules: AutoAssignRule[];
  documentChangesTrigger: boolean;
  newEmployeeTrigger: boolean;
  roleCangeTrigger: boolean;
}

export interface DocumentControlIntegration {
  documentId: string;
  documentTitle: string;
  versionNumber: number;
  changeType: 'New' | 'Updated' | 'Expired';
  trainingRequired: boolean;
  trainingDeadlineDays?: number;
  affectedRoles?: string[];
}
