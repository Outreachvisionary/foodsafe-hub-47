
// Re-export types from database
export type { TrainingStatus, TrainingRecord, TrainingSession } from './database';

export interface ExtendedTrainingRecord extends TrainingRecord {
  courseName?: string;
  instructorName?: string;
}

// Training plan interface
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
  department?: string; // Add for compatibility with existing component
  compliance?: number; // Add for compatibility with existing component
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
