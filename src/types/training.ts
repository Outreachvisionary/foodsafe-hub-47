
import { TrainingStatus, TrainingType, TrainingCategory } from '@/types/enums';

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  instructor?: string;
  participants: string[];
  completionRate?: number;
}

// Make department optional to prevent type error, since it's used inconsistently
export interface DepartmentStat {
  name: string;
  department: string;
  completed: number;
  overdue: number;
  totalAssigned: number;
  complianceRate: number;
}

export interface TrainingStatistics {
  totalSessions: number;
  completedSessions: number;
  overdueSessions: number;
  complianceRate: number;
  byDepartment?: DepartmentStat[];
}

export interface Certification {
  id: string;
  name: string;
  employee: string;
  expiryDate: string;
}

export interface TrainingContextType {
  sessions: TrainingSession[];
  departmentStats: DepartmentStat[];
  isLoading: boolean;
  statistics: TrainingStatistics;
  fetchTrainingSessions: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  addTrainingSession: (session: Partial<TrainingSession>) => Promise<void>;
  updateTrainingSession: (id: string, updates: Partial<TrainingSession>) => Promise<void>;
  deleteTrainingSession: (id: string) => Promise<void>;
  expiringCertifications: Certification[];
}

// Export TrainingRecord, TrainingPlan, and TrainingPriority types
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
  durationDays?: number;
  isRequired?: boolean;
}

export type TrainingPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TrainingCourse {
  id: string;
  title: string;
  description?: string;
  category: TrainingCategory;
  type: TrainingType;
  status: string;
  duration: number;
  format: string;
}

// Additional type to ensure compatibility
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  profile?: {
    certifications: string[];
    department: string;
  };
}
