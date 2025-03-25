
// Re-export our database types to maintain compatibility
export { TrainingStatus, TrainingSession, TrainingRecord } from './database';

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
