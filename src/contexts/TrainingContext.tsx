import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingSession, TrainingRecord, TrainingStatus, TrainingCategory, TrainingStatistics, TrainingPlan, TrainingPriority } from '@/types/training';
import { getMockTrainingStatistics } from '@/services/mockDataService';

interface TrainingContextType {
  trainingSessions: TrainingSession[];
  trainingRecords: TrainingRecord[];
  trainingPlans: TrainingPlan[];
  statistics: TrainingStatistics | null;
  loading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  fetchRecords: (employeeId?: string) => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  createSession: (session: Partial<TrainingSession>) => Promise<void>;
  updateSession: (id: string, updates: Partial<TrainingSession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  updateTrainingRecord: (id: string, updates: Partial<TrainingRecord>) => Promise<void>;
  createTrainingPlan: (plan: Partial<TrainingPlan>) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType>({
  trainingSessions: [],
  trainingRecords: [],
  trainingPlans: [],
  statistics: null,
  loading: false,
  error: null,
  fetchSessions: async () => {},
  fetchRecords: async () => {},
  fetchPlans: async () => {},
  fetchStatistics: async () => {},
  createSession: async () => {},
  updateSession: async () => {},
  deleteSession: async () => {},
  updateTrainingRecord: async () => {},
  createTrainingPlan: async () => {}
});

export const useTraining = () => useContext(TrainingContext);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [statistics, setStatistics] = useState<TrainingStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would fetch from Supabase
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*');
      
      if (error) throw error;
      
      setTrainingSessions(data as TrainingSession[]);
    } catch (err: any) {
      console.error('Error fetching training sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecords = async (employeeId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('training_records')
        .select('*');
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTrainingRecords(data as TrainingRecord[]);
    } catch (err: any) {
      console.error('Error fetching training records:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('training_plans')
        .select('*');
      
      if (error) throw error;
      
      setTrainingPlans(data as TrainingPlan[]);
    } catch (err: any) {
      console.error('Error fetching training plans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now
      const mockStats = getMockTrainingStatistics();
      setStatistics(mockStats);
    } catch (err: any) {
      console.error('Error fetching training statistics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const createSession = async (session: Partial<TrainingSession>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!session.created_by) {
        throw new Error('created_by is required');
      }
      
      const { data, error } = await supabase
        .from('training_sessions')
        .insert(session)
        .select();
      
      if (error) throw error;
      
      setTrainingSessions([...trainingSessions, data[0] as TrainingSession]);
    } catch (err: any) {
      console.error('Error creating training session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateSession = async (id: string, updates: Partial<TrainingSession>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('training_sessions')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setTrainingSessions(
        trainingSessions.map(session => 
          session.id === id ? { ...session, ...updates } : session
        )
      );
    } catch (err: any) {
      console.error('Error updating training session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteSession = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('training_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTrainingSessions(trainingSessions.filter(session => session.id !== id));
    } catch (err: any) {
      console.error('Error deleting training session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateTrainingRecord = async (id: string, updates: Partial<TrainingRecord>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('training_records')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setTrainingRecords(
        trainingRecords.map(record => 
          record.id === id ? { ...record, ...updates } : record
        )
      );
    } catch (err: any) {
      console.error('Error updating training record:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const createTrainingPlan = async (plan: Partial<TrainingPlan>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!plan.created_by) {
        throw new Error('created_by is required');
      }
      
      const { data, error } = await supabase
        .from('training_plans')
        .insert(plan)
        .select();
      
      if (error) throw error;
      
      setTrainingPlans([...trainingPlans, data[0] as TrainingPlan]);
    } catch (err: any) {
      console.error('Error creating training plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchStatistics();
      await fetchSessions();
      // Other data will be loaded on demand
    };
    
    loadInitialData();
  }, []);
  
  return (
    <TrainingContext.Provider
      value={{
        trainingSessions,
        trainingRecords,
        trainingPlans,
        statistics,
        loading,
        error,
        fetchSessions,
        fetchRecords,
        fetchPlans,
        fetchStatistics,
        createSession,
        updateSession,
        deleteSession,
        updateTrainingRecord,
        createTrainingPlan
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};
