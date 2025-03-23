
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
  passThreshold?: number;
  certificationIssued?: boolean;
  instructorId?: string;
  instructorName?: string;
  attachments?: TrainingAttachment[];
  notes?: string;
  relatedStandards?: string[]; // ISO, FSSC, etc.
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

// Dashboard Stats Types
export interface TrainingStats {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  overdue: number;
  compliance: number; // Percentage
  avgScore: number;
  certExpiringCount: number;
}

export interface DepartmentTrainingStats {
  department: Department;
  compliance: number;
  completedCount: number;
  overdueCount: number;
  employeeCount: number;
}
