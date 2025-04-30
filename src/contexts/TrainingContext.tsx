
import React, { createContext, useContext, useState } from 'react';
import { TrainingStats, TrainingPlan, TrainingCourse, Training, TrainingRecord } from '@/types/training';

interface TrainingContextType {
  sessions?: Training[];
  trainingRecords?: TrainingRecord[];
  plans?: TrainingPlan[];
  courses?: TrainingCourse[];
  stats?: TrainingStats;
  departmentStats?: Record<string, any>;
  isLoading?: boolean;
  error?: string | null;
  loadTrainingSessions?: () => Promise<void>;
  createTrainingSession?: (session: Partial<Training>) => Promise<Training>;
  updateTrainingSession?: (id: string, updates: Partial<Training>) => Promise<Training>;
  fetchTrainingPlans?: () => Promise<TrainingPlan[]>;
  createTrainingPlan?: (plan: Partial<TrainingPlan>) => Promise<TrainingPlan>;
  updateTrainingPlan?: (id: string, updates: Partial<TrainingPlan>) => Promise<TrainingPlan>;
  fetchTrainingCourses?: () => Promise<TrainingCourse[]>;
  createTrainingCourse?: (course: Partial<TrainingCourse>) => Promise<TrainingCourse>;
  updateTrainingCourse?: (id: string, updates: Partial<TrainingCourse>) => Promise<TrainingCourse>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Training[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [stats, setStats] = useState<TrainingStats | undefined>(undefined);
  const [departmentStats, setDepartmentStats] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add mock implementations for all the functions
  const loadTrainingSessions = async (): Promise<void> => {
    // Mock implementation
  };

  const createTrainingSession = async (session: Partial<Training>): Promise<Training> => {
    // Mock implementation
    return {} as Training;
  };

  const updateTrainingSession = async (id: string, updates: Partial<Training>): Promise<Training> => {
    // Mock implementation
    return {} as Training;
  };

  const fetchTrainingPlans = async (): Promise<TrainingPlan[]> => {
    // Mock implementation
    return [] as TrainingPlan[];
  };

  const createTrainingPlan = async (plan: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    // Mock implementation
    return {} as TrainingPlan;
  };

  const updateTrainingPlan = async (id: string, updates: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    // Mock implementation
    return {} as TrainingPlan;
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
