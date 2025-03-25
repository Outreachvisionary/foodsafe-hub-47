
// Re-export our database types to maintain compatibility
export type { TrainingStatus, TrainingSession, TrainingRecord } from './database';

export interface EmployeeRole {
  id: string;
  name: string;
  description?: string;
  department?: string;
  createdAt?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  courses: string[];
  targetRoles: string[];
  targetDepartments: string[];
  durationDays: number;
  priority: TrainingPriority;
  startDate: string;
  endDate: string;
  status: string;
  createdBy: string;
  createdDate: string;
  relatedStandards?: string[];
  isAutomated?: boolean;
  automationTrigger?: string;
  recurringSchedule?: {
    frequency: string;
    interval: number;
    startDate: string;
  };
}

export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';

// Add missing types referenced elsewhere
export interface DepartmentTrainingStats {
  department: string;
  departmentName?: string;
  totalEmployees?: number;
  completedTrainings?: number;
  pendingTrainings?: number;
  compliancePercentage?: number;
  compliance: number;
  completedCount: number;
  overdueCount: number;
  employeeCount: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
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
    recertificationInterval?: number;
  }>;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: number;
  requiredFor: string[];
}

export interface AutoAssignRule {
  id: string;
  name: string;
  triggerType: string;
  targetRoles: string[];
  targetDepartments: string[];
  coursesToAssign: string[];
  priority: string;
  type?: string;
  conditions?: Array<{
    key: string;
    operator: string;
    value: string | number;
  }>;
}

export interface TrainingAutomationConfig {
  enabled: boolean;
  rules: AutoAssignRule[];
  documentChangesTrigger?: boolean;
  newEmployeeTrigger?: boolean;
  roleCangeTrigger?: boolean;
  triggerEvents?: {
    newHire: boolean;
    roleChange: boolean;
    documentUpdate: boolean;
    competencyFailure: boolean;
    certificationExpiry: boolean;
  };
  notificationSettings?: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
    reminderDays: number[];
    escalationThreshold: number;
    escalationTargets: string[];
  };
}

export interface DocumentControlIntegration {
  linkToDocuments: boolean;
  autoAssignOnDocumentChange: boolean;
  documentCategories: string[];
  trainingRequired?: boolean;
  affectedRoles?: string[];
  linkedCourseIds?: string[];
  documentType?: string;
  documentId?: string;
  trainingDeadlineDays?: number;
}
