
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TrainingStatus } from '@/types/enums';

interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date: string;
  completion_date: string | null;
  score: number | null;
  pass_threshold: number;
  notes: string | null;
  last_recurrence: string | null;
  next_recurrence: string | null;
}

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  duration: number;
  start_date: string;
  end_date: string;
  instructor: string;
  location: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  target_roles: string[];
  target_departments: string[];
  courses: string[];
  priority: string;
  status: string;
  duration_days?: number;
  is_required?: boolean;
}

interface DepartmentStat {
  department: string;
  totalAssigned: number;
  completed: number;
  overdue: number;
  compliance: number;
}

interface TrainingContextType {
  trainingRecords: TrainingRecord[];
  sessions: TrainingSession[];
  trainingPlans: TrainingPlan[];
  departmentStats: DepartmentStat[];
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  enrollUser: (sessionId: string, userId: string) => Promise<void>;
  startTraining: (recordId: string) => Promise<void>;
  completeTraining: (recordId: string, score: number) => Promise<void>;
  getTrainingRecordsByStatus: (status: TrainingStatus) => TrainingRecord[];
  getPendingTrainings: () => TrainingRecord[];
  fetchPlans: () => Promise<void>;
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<void>;
  deleteTrainingPlan: (planId: string) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

// Export alias for backward compatibility
export const useTrainingContext = useTraining;

interface TrainingProviderProps {
  children: ReactNode;
}

export const TrainingProvider: React.FC<TrainingProviderProps> = ({ children }) => {
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([
    { department: 'Production', totalAssigned: 50, completed: 45, overdue: 5, compliance: 90 },
    { department: 'Quality', totalAssigned: 25, completed: 23, overdue: 2, compliance: 92 },
    { department: 'Maintenance', totalAssigned: 30, completed: 25, overdue: 5, compliance: 83 },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const enrollUser = async (sessionId: string, userId: string) => {
    try {
      setLoading(true);
      // Create enrollment record with correct enum value
      const enrollment = {
        session_id: sessionId,
        employee_id: userId,
        employee_name: 'User Name',
        status: TrainingStatus.Not_Started,
        assigned_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      // Simulate API call to enroll user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state with new training record
      setTrainingRecords(prevRecords => [
        ...prevRecords,
        {
          id: Math.random().toString(36).substr(2, 9),
          session_id: sessionId,
          employee_id: userId,
          employee_name: 'User Name',
          status: TrainingStatus.Not_Started,
          assigned_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          completion_date: null,
          score: null,
          pass_threshold: 80,
          notes: null,
          last_recurrence: null,
          next_recurrence: null,
        }
      ]);
      
      setError(null);
    } catch (error) {
      setError('Failed to enroll user');
    } finally {
      setLoading(false);
    }
  };

  const startTraining = async (recordId: string) => {
    try {
      setLoading(true);
      // Update status to In_Progress
      const updatedRecord = {
        status: TrainingStatus.In_Progress,
      };
      
      // Simulate API call to start training
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state with updated training record
      setTrainingRecords(prevRecords =>
        prevRecords.map(record =>
          record.id === recordId ? { ...record, status: TrainingStatus.In_Progress } : record
        )
      );
      
      setError(null);
    } catch (error) {
      setError('Failed to start training');
    } finally {
      setLoading(false);
    }
  };

  const completeTraining = async (recordId: string, score: number) => {
    try {
      setLoading(true);
      // Simulate API call to complete training
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state with completed training record
      setTrainingRecords(prevRecords =>
        prevRecords.map(record =>
          record.id === recordId
            ? {
                ...record,
                status: TrainingStatus.Completed,
                completion_date: new Date().toISOString(),
                score: score,
              }
            : record
        )
      );
      
      setError(null);
    } catch (error) {
      setError('Failed to complete training');
    } finally {
      setLoading(false);
    }
  };

  const getTrainingRecordsByStatus = (status: TrainingStatus) => {
    return trainingRecords.filter(record => record.status === status);
  };

  const getPendingTrainings = () => {
    return getTrainingRecordsByStatus(TrainingStatus.Not_Started);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPlans: TrainingPlan[] = [
        {
          id: '1',
          name: 'Food Safety Basics',
          description: 'Essential food safety training for all staff',
          target_roles: ['Production Staff', 'Quality Team'],
          target_departments: ['Production', 'Quality'],
          courses: ['FS-101', 'HACCP-101'],
          priority: 'High',
          status: 'Active',
          duration_days: 5,
          is_required: true,
        },
      ];
      
      setTrainingPlans(mockPlans);
    } catch (error) {
      setError('Failed to fetch training plans');
    } finally {
      setLoading(false);
    }
  };

  const createTrainingPlan = async (plan: Partial<TrainingPlan>) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPlan: TrainingPlan = {
        id: Math.random().toString(36).substr(2, 9),
        name: plan.name || 'New Training Plan',
        description: plan.description || '',
        target_roles: plan.target_roles || [],
        target_departments: plan.target_departments || [],
        courses: plan.courses || [],
        priority: plan.priority || 'Medium',
        status: plan.status || 'Active',
        duration_days: plan.duration_days,
        is_required: plan.is_required,
      };
      
      setTrainingPlans(prev => [...prev, newPlan]);
    } catch (error) {
      setError('Failed to create training plan');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainingPlan = async (planId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTrainingPlans(prev => prev.filter(plan => plan.id !== planId));
    } catch (error) {
      setError('Failed to delete training plan');
    } finally {
      setLoading(false);
    }
  };

  const value: TrainingContextType = {
    trainingRecords,
    sessions,
    trainingPlans,
    departmentStats,
    loading,
    isLoading: loading,
    error,
    enrollUser,
    startTraining,
    completeTraining,
    getTrainingRecordsByStatus,
    getPendingTrainings,
    fetchPlans,
    createTrainingPlan,
    deleteTrainingPlan,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingContext;
