// Employee Types
export type EmployeeRole = 'Operator' | 'Supervisor' | 'Manager' | 'Quality' | 'Admin' | 'Executive';

export type Department = 'Production' | 'Quality' | 'Maintenance' | 'R&D' | 'HR' | 'Management' | 'Logistics' | 'IT';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  department: Department;
  hireDate: string;
  activeStatus: 'Active' | 'Inactive' | 'On Leave';
  trainingRecords: TrainingRecord[];
  certifications: Certification[];
  competencyAssessments: CompetencyAssessment[];
}

// Training Types
export type TrainingType = 'Classroom' | 'Online' | 'On-the-job' | 'Workshop' | 'Self-study';

export type TrainingStatus = 
  | 'Not Started' 
  | 'In Progress' 
  | 'Completed' 
  | 'Overdue' 
  | 'Expired' 
  | 'Cancelled';

export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TrainingCategory = 
  | 'SPC' 
  | 'Compliance' 
  | 'Safety' 
  | 'GMP' 
  | 'HACCP' 
  | 'Quality' 
  | 'Technical' 
  | 'Soft Skills' 
  | 'Leadership';

export interface TrainingRecord {
  id: string;
  employeeId: string;
  courseId: string;
  courseName: string;
  assignedDate: string;
  dueDate: string;
  completionDate?: string;
  status: TrainingStatus;
  score?: number; // If applicable
  competencyScore?: number; // New field for competency tracking
  passThreshold?: number;
  certificationIssued?: boolean;
  instructorId?: string;
  instructorName?: string;
  attachments?: TrainingAttachment[];
  notes?: string;
  relatedStandards?: string[]; // ISO, FSSC, etc.
  trainingCategory?: TrainingCategory;
  isRecurring?: boolean;
  recurringInterval?: number; // In months
  lastRecurrence?: string;
  nextRecurrence?: string;
  linkedDocuments?: string[]; // Document IDs from Document Control
  autoAssigned?: boolean; // Flag for auto-assigned training
  autoAssignReason?: 'New Hire' | 'Role Change' | 'Document Update' | 'Compliance Requirement' | 'Remediation';
}

export interface TrainingAttachment {
  id: string;
  name: string;
  type: 'Certificate' | 'Attendance' | 'Assessment' | 'Other';
  uploadDate: string;
  fileName: string;
  fileSize: number;
  url: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  type: TrainingType;
  category?: TrainingCategory; // New field for categorization
  duration: number; // In minutes
  materials: CourseMaterial[];
  assessments: CourseAssessment[];
  requiredRoles: EmployeeRole[];
  requiredDepartments: Department[];
  relatedStandards: string[];
  retrainingInterval?: number; // In months
  createdDate: string;
  updatedDate: string;
  activeStatus: 'Active' | 'Inactive' | 'Draft';
  prerequisites?: string[]; // Course IDs
  isSPCRelated?: boolean;
  spcToolsUsed?: string[]; // e.g., "Control Charts", "Pareto Analysis"
  complianceRequirement?: boolean; // Is this required for compliance
  requiresRecertification?: boolean;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'Video' | 'Document' | 'Presentation' | 'Quiz' | 'Interactive';
  url: string;
  duration?: number; // In minutes
  required: boolean;
}

export interface CourseAssessment {
  id: string;
  title: string;
  type: 'Quiz' | 'Practical' | 'Project' | 'Observation';
  questions?: AssessmentQuestion[];
  passThreshold: number; // Percentage
  attempts: number;
  timeLimit?: number; // In minutes
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'Multiple Choice' | 'True/False' | 'Short Answer' | 'Matching';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Certification {
  id: string;
  employeeId: string;
  name: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  attachmentUrl?: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  relatedStandards?: string[];
  category?: TrainingCategory;
  requiresRecertification?: boolean;
  recertificationInterval?: number; // In months
  lastRecertificationDate?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  courses: string[]; // Course IDs
  targetRoles: EmployeeRole[];
  targetDepartments: Department[];
  durationDays: number;
  priority: TrainingPriority;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Cancelled';
  createdBy: string;
  createdDate: string;
  relatedStandards?: string[];
  relatedDocuments?: string[]; // Document IDs from Document Control
  isAutomated?: boolean;
  automationTrigger?: 'NewHire' | 'RoleChange' | 'DocumentUpdate' | 'RecurringTraining' | 'Custom';
  autoAssignRules?: AutoAssignRule[];
  recurringSchedule?: RecurringSchedule;
}

export interface AutoAssignRule {
  id: string;
  type: 'Role' | 'Department' | 'NewHire' | 'DocumentUpdate' | 'CompetencyScore' | 'Custom';
  conditions: {
    key: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
    value: string | number | boolean;
  }[];
  action: 'Assign' | 'Notify' | 'Escalate';
}

export interface RecurringSchedule {
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Biannually' | 'Annually';
  interval: number; // e.g., every 2 weeks, every 3 months
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number;
}

export interface CompetencyAssessment {
  id: string;
  employeeId: string;
  courseId?: string;
  title: string;
  assessmentDate: string;
  assessor: string;
  assessorRole: EmployeeRole;
  score: number;
  passThreshold: number;
  result: 'Pass' | 'Fail' | 'Needs Improvement';
  competencies: Competency[];
  notes?: string;
  followUpRequired: boolean;
  followUpActions?: string[];
  followUpDueDate?: string;
  autoRemediation?: boolean;
  remediationPlan?: string; // Training plan ID for auto-remediation
  escalatedTo?: string; // Employee ID for escalation
  escalationDate?: string;
}

export interface Competency {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: 1 | 2 | 3 | 4 | 5; // 1=Poor, 5=Excellent
  targetRating: number;
  comments?: string;
}

export interface TrainingAutomationConfig {
  enabled: boolean;
  triggerEvents: {
    newHire: boolean;
    roleChange: boolean;
    documentUpdate: boolean;
    competencyFailure: boolean;
    certificationExpiry: boolean;
  };
  notificationSettings: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
    reminderDays: number[]; // e.g., [1, 7, 14] days before due
    escalationThreshold: number; // Days overdue before escalation
    escalationTargets: EmployeeRole[]; // Roles to escalate to
  };
}

export interface DocumentControlIntegration {
  documentId: string;
  documentType: 'SOP' | 'Work Instruction' | 'Policy' | 'Form';
  documentVersion: string;
  linkedCourseIds: string[];
  affectedRoles: EmployeeRole[];
  trainingRequired: boolean;
  trainingDeadlineDays: number; // Days to complete training
}

export interface SPCTrainingModule {
  id: string;
  title: string;
  toolType: 'Control Chart' | 'Pareto Analysis' | 'Fishbone Diagram' | 'Scatter Plot' | 'Histogram';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  interactiveElements: {
    simulators?: boolean;
    exercises?: boolean;
    assessments?: boolean;
  };
  requiredForRoles: EmployeeRole[];
}

export interface TrainingStats {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  overdue: number;
  compliance: number; // Percentage
  avgScore: number;
  certExpiringCount: number;
  spcComplianceRate?: number;
  qualityTrainingCompletionRate?: number;
  remediationRate?: number; // Percentage of employees requiring remediation
}

export interface DepartmentTrainingStats {
  department: Department;
  compliance: number;
  completedCount: number;
  overdueCount: number;
  employeeCount: number;
  avgCompetencyScore?: number;
  spcProficiency?: number; // 0-100 scale
}
