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

interface TrainingContextType {
  trainingRecords: TrainingRecord[];
  loading: boolean;
  error: string | null;
  enrollUser: (sessionId: string, userId: string) => Promise<void>;
  startTraining: (recordId: string) => Promise<void>;
  completeTraining: (recordId: string, score: number) => Promise<void>;
  getTrainingRecordsByStatus: (status: TrainingStatus) => TrainingRecord[];
  getPendingTrainings: () => TrainingRecord[];
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

interface TrainingProviderProps {
  children: ReactNode;
}

export const TrainingProvider: React.FC<TrainingProviderProps> = ({ children }) => {
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
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

  const value: TrainingContextType = {
    trainingRecords,
    loading,
    error,
    enrollUser,
    startTraining,
    completeTraining,
    getTrainingRecordsByStatus,
    getPendingTrainings,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingContext;
