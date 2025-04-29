
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

// Define CAPA interface with snake_case properties to match what's being used in existing components
export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  created_at: string;
  created_by: string;
  due_date: string;
  assigned_to: string;
  source: string;
  source_id?: string;
  source_reference: string;
  completion_date?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  effectiveness_criteria?: string;
  effectiveness_rating?: CAPAEffectivenessRating;
  effectiveness_verified?: boolean;
  verification_date?: string;
  verification_method?: string;
  verified_by?: string;
  department?: string;
  fsma204_compliant?: boolean;
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

// Export training-related types
export interface TrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  sessionId: string;
  status: string;
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

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  duration: number;
  format: string;
}
