
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

// Update CAPA interface to use consistent naming with snake_case
// to match what's being used in the codebase
export interface CAPA {
  id: string;
  title: string;
  description: string;
  status: CAPAStatus;
  priority: string;
  created_at: string; // Switched to snake_case to match API
  created_by: string; // Switched to snake_case to match API
  due_date: string; // Switched to snake_case to match API
  assigned_to: string; // Switched to snake_case to match API
  source: string;
  source_id?: string; // Switched to snake_case to match API
  source_reference: string; // Switched to snake_case to match API
  completion_date?: string; // Switched to snake_case to match API
  root_cause?: string; // Switched to snake_case to match API
  corrective_action?: string; // Switched to snake_case to match API
  preventive_action?: string; // Switched to snake_case to match API
  effectiveness_criteria?: string; // Switched to snake_case to match API
  effectiveness_rating?: CAPAEffectivenessRating; // Switched to snake_case to match API
  effectiveness_verified?: boolean; // Switched to snake_case to match API
  verification_date?: string; // Switched to snake_case to match API
  verification_method?: string; // Switched to snake_case to match API
  verified_by?: string; // Switched to snake_case to match API
  department?: string;
  fsma204_compliant?: boolean; // Switched to snake_case to match API
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
