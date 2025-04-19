import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingPlan } from '@/types/training';

export interface TrainingContextType {
  trainingPlans: TrainingPlan[];
  isLoading: boolean; // Add this property
  error: Error | null;
  fetchTrainingPlans: () => Promise<void>;
  createTrainingPlan: (planData: Omit<TrainingPlan, 'id' | 'created_at' | 'updated_at'>) => Promise<TrainingPlan>; // Add this method
  updateTrainingPlan: (id: string, updates: Partial<TrainingPlan>) => Promise<void>;
  deleteTrainingPlan: (id: string) => Promise<void>;
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
  children: React.ReactNode;
}

export const TrainingProvider: React.FC<TrainingProviderProps> = ({ children }) => {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrainingPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTrainingPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch training plans'));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTrainingPlan = useCallback(async (planData: Omit<TrainingPlan, 'id' | 'created_at' | 'updated_at'>): Promise<TrainingPlan> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('training_plans')
        .insert([planData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setTrainingPlans(prevPlans => [data, ...prevPlans]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create training plan'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTrainingPlan = useCallback(async (id: string, updates: Partial<TrainingPlan>) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('training_plans')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTrainingPlans(prevPlans =>
        prevPlans.map(plan => (plan.id === id ? { ...plan, ...updates } : plan))
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update training plan'));
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTrainingPlan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('training_plans')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTrainingPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete training plan'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainingPlans();
  }, [fetchTrainingPlans]);

  return (
    <TrainingContext.Provider
      value={{
        trainingPlans,
        isLoading: loading, // Add this property
        error,
        fetchTrainingPlans,
        createTrainingPlan: handleCreateTrainingPlan, // Add this method
        updateTrainingPlan,
        deleteTrainingPlan,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};
