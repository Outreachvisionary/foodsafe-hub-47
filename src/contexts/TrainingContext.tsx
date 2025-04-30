
import React, { createContext, useContext, useState } from 'react';
import { TrainingPlan, TrainingCourse, TrainingRecord, TrainingSession, DepartmentStat } from '@/types/training';

interface TrainingContextType {
  sessions?: TrainingSession[];
  trainingRecords?: TrainingRecord[];
  plans?: TrainingPlan[];
  courses?: TrainingCourse[];
  stats?: any;
  departmentStats?: DepartmentStat[];
  isLoading?: boolean;
  error?: string | null;
  loadTrainingSessions?: () => Promise<void>;
  createTrainingSession?: (session: Partial<TrainingSession>) => Promise<TrainingSession>;
  updateTrainingSession?: (id: string, updates: Partial<TrainingSession>) => Promise<TrainingSession>;
  fetchTrainingPlans?: () => Promise<TrainingPlan[]>;
  createTrainingPlan?: (plan: Partial<TrainingPlan>) => Promise<TrainingPlan>;
  updateTrainingPlan?: (id: string, updates: Partial<TrainingPlan>) => Promise<TrainingPlan>;
  fetchTrainingCourses?: () => Promise<TrainingCourse[]>;
  createTrainingCourse?: (course: Partial<TrainingCourse>) => Promise<TrainingCourse>;
  updateTrainingCourse?: (id: string, updates: Partial<TrainingCourse>) => Promise<TrainingCourse>;
  deleteTrainingPlan?: (id: string) => Promise<void>;
  trainingPlans?: any[];
  fetchPlans?: () => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<any[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [stats, setStats] = useState<any | undefined>(undefined);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock implementations for functions
  const loadTrainingSessions = async (): Promise<void> => {
    // Mock implementation
  };

  const createTrainingSession = async (session: Partial<TrainingSession>): Promise<TrainingSession> => {
    // Mock implementation
    return {} as TrainingSession;
  };

  const updateTrainingSession = async (id: string, updates: Partial<TrainingSession>): Promise<TrainingSession> => {
    // Mock implementation
    return {} as TrainingSession;
  };

  const fetchTrainingPlans = async (): Promise<TrainingPlan[]> => {
    // Mock implementation
    return [] as TrainingPlan[];
  };

  const fetchPlans = async (): Promise<void> => {
    // Mock implementation
  };

  const createTrainingPlan = async (plan: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    // Mock implementation
    return {} as TrainingPlan;
  };

  const updateTrainingPlan = async (id: string, updates: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    // Mock implementation
    return {} as TrainingPlan;
  };

  const deleteTrainingPlan = async (id: string): Promise<void> => {
    // Mock implementation
  };

  const fetchTrainingCourses = async (): Promise<TrainingCourse[]> => {
    // Mock implementation
    return [] as TrainingCourse[];
  };

  const createTrainingCourse = async (course: Partial<TrainingCourse>): Promise<TrainingCourse> => {
    // Mock implementation
    return {} as TrainingCourse;
  };

  const updateTrainingCourse = async (id: string, updates: Partial<TrainingCourse>): Promise<TrainingCourse> => {
    // Mock implementation
    return {} as TrainingCourse;
  };

  const value: TrainingContextType = {
    sessions,
    trainingRecords,
    plans,
    courses,
    stats,
    departmentStats,
    isLoading,
    error,
    loadTrainingSessions,
    createTrainingSession,
    updateTrainingSession,
    fetchTrainingPlans,
    createTrainingPlan,
    updateTrainingPlan,
    fetchTrainingCourses,
    createTrainingCourse,
    updateTrainingCourse,
    deleteTrainingPlan,
    trainingPlans,
    fetchPlans,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = (): TrainingContextType => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
};

// Export useTraining as useTrainingContext for backward compatibility
export const useTrainingContext = useTraining;
