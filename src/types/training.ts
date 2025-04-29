
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

export interface DepartmentStat {
  name: string;
  department?: string;
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
