
import { CAPAStatus, CAPAEffectivenessRating } from '@/types/enums';

export type CAPAPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export type CAPASource = 
  | 'Audit'
  | 'Customer_Complaint'
  | 'Inspection'
  | 'Non_Conformance'
  | 'Supplier_Issue'
  | 'Employee_Suggestion'
  | 'Food_Safety_Event'
  | 'Management_Review'
  | 'Regulatory'
  | 'Other'
  | 'Internal_QC';

export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  createdAt: string;
  createdBy: string;
  dueDate: string;
  assignedTo: string;
  source: string;
  sourceId?: string;
  sourceReference: string;
  completionDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  effectivenessCriteria?: string;
  effectivenessRating?: CAPAEffectivenessRating;
  effectivenessVerified?: boolean;
  verificationDate?: string;
  verificationMethod?: string;
  verifiedBy?: string;
  department?: string;
  fsma204Compliant?: boolean;
  relatedDocuments: string[];
  relatedTraining: string[];
}

export interface CAPAActivity {
  id: string;
  capaId: string;
  actionType: string;
  actionDescription: string;
  performedAt: string;
  performedBy: string;
  oldStatus?: CAPAStatus;
  newStatus?: CAPAStatus;
  metadata?: Record<string, any>;
}

export interface CAPAFilter {
  status?: CAPAStatus | CAPAStatus[];
  priority?: CAPAPriority | CAPAPriority[];
  source?: CAPASource | CAPASource[];
  department?: string | string[];
  createdDateFrom?: string;
  createdDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  assignedTo?: string | string[];
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CAPAFetchParams extends CAPAFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchQuery?: string;
}

export interface CAPAStats {
  total: number;
  openCount: number;
  closedCount: number;
  overdueCount: number;
  pendingVerificationCount: number;
  effectivenessRate: number;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
  byDepartment: Record<string, number>;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
  overdue: number;
}

// Add training related types needed by NC components
export enum TrainingStatus {
  NotStarted = "Not_Started",
  InProgress = "In_Progress",
  Completed = "Completed",
  Expired = "Expired",
  Overdue = "Overdue"
}

export enum TrainingType {
  OnBoarding = "On_Boarding",
  Compliance = "Compliance",
  Skills = "Skills",
  Leadership = "Leadership",
  Safety = "Safety",
  Technical = "Technical"
}

export enum TrainingCategory {
  Required = "Required",
  Optional = "Optional",
  Certification = "Certification",
  Regulatory = "Regulatory"
}

export interface TrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  sessionId: string;
  status: TrainingStatus;
  assignedDate: string;
  dueDate: string;
  completionDate?: string;
  score?: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  targetRoles: string[];
  targetDepartments: string[];
  courses: string[];
  priority: TrainingPriority;
  status: string;
  startDate?: string;
  endDate?: string;
}

export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';
