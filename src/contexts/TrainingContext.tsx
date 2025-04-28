import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  TrainingSession,
  TrainingMaterial,
  TrainingStatus,
  TrainingCategory,
  TrainingType,
  TrainingPriority,
} from '@/types/training';

interface TrainingContextType {
  trainingSessions: TrainingSession[];
  trainingMaterials: TrainingMaterial[];
  loading: boolean;
  error: string | null;
  fetchTrainingSessions: () => Promise<void>;
  fetchTrainingMaterials: () => Promise<void>;
  createTrainingSession: (
    sessionData: Partial<TrainingSession>
  ) => Promise<TrainingSession | null>;
  updateTrainingSession: (
    id: string,
    updates: Partial<TrainingSession>
  ) => Promise<TrainingSession | null>;
  deleteTrainingSession: (id: string) => Promise<void>;
  createTrainingMaterial: (
    materialData: Partial<TrainingMaterial>
  ) => Promise<TrainingMaterial | null>;
  updateTrainingMaterial: (
    id: string,
    updates: Partial<TrainingMaterial>
  ) => Promise<TrainingMaterial | null>;
  deleteTrainingMaterial: (id: string) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType>({
  trainingSessions: [],
  trainingMaterials: [],
  loading: false,
  error: null,
  fetchTrainingSessions: async () => {},
  fetchTrainingMaterials: async () => {},
  createTrainingSession: async () => null,
  updateTrainingSession: async () => null,
  deleteTrainingSession: async () => {},
  createTrainingMaterial: async () => null,
  updateTrainingMaterial: async () => null,
  deleteTrainingMaterial: async () => {},
});

export const useTraining = () => useContext(TrainingContext);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trainingSessions, setTrainingSessions] = useState<
    TrainingSession[]
  >([]);
  const [trainingMaterials, setTrainingMaterials] = useState<
    TrainingMaterial[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainingSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*');

      if (error) {
        throw error;
      }

      setTrainingSessions(data as TrainingSession[]);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      setError('Failed to fetch training sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrainingMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('training_materials')
        .select('*');

      if (error) {
        throw error;
      }

      setTrainingMaterials(data as TrainingMaterial[]);
    } catch (error) {
      console.error('Error fetching training materials:', error);
      setError('Failed to fetch training materials');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fix the error around line 192 by mapping the session data properly:
  const createTrainingSession = async (sessionData: Partial<TrainingSession>) => {
    try {
      setLoading(true);
      // Convert session data to match database schema
      const transformedSession = {
        title: sessionData.title,
        description: sessionData.description,
        training_type: sessionData.training_type,
        training_category: sessionData.training_category,
        department: sessionData.department,
        start_date: sessionData.start_date,
        due_date: sessionData.due_date,
        completion_status: sessionData.completion_status || 'Not Started',
        is_recurring: sessionData.is_recurring || false,
        recurring_interval: sessionData.recurring_interval,
        assigned_to: sessionData.assigned_to || [],
        required_roles: sessionData.required_roles || [],
        materials_id: sessionData.materials_id || [],
        created_by: sessionData.created_by || 'system'
      };

      const { data, error } = await supabase
        .from('training_sessions')
        .insert([transformedSession]);

      if (error) throw error;

      if (data) {
        setTrainingSessions(prev => [...prev, data[0] as TrainingSession]);
      }

      return data ? (data[0] as TrainingSession) : null;
    } catch (error) {
      console.error('Error creating training session:', error);
      setError('Failed to create training session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingSession = async (
    id: string,
    updates: Partial<TrainingSession>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('training_sessions')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      setTrainingSessions(prev =>
        prev.map(session => (session.id === id ? (data![0] as TrainingSession) : session))
      );
      return data ? (data[0] as TrainingSession) : null;
    } catch (error) {
      console.error('Error updating training session:', error);
      setError('Failed to update training session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainingSession = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('training_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrainingSessions(prev => prev.filter(session => session.id !== id));
    } catch (error) {
      console.error('Error deleting training session:', error);
      setError('Failed to delete training session');
    } finally {
      setLoading(false);
    }
  };

  const createTrainingMaterial = async (
    materialData: Partial<TrainingMaterial>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('training_materials')
        .insert([materialData])
        .select();

      if (error) throw error;

      setTrainingMaterials(prev => [...prev, data![0] as TrainingMaterial]);
      return data ? (data[0] as TrainingMaterial) : null;
    } catch (error) {
      console.error('Error creating training material:', error);
      setError('Failed to create training material');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingMaterial = async (
    id: string,
    updates: Partial<TrainingMaterial>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('training_materials')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      setTrainingMaterials(prev =>
        prev.map(material =>
          material.id === id ? (data![0] as TrainingMaterial) : material
        )
      );
      return data ? (data[0] as TrainingMaterial) : null;
    } catch (error) {
      console.error('Error updating training material:', error);
      setError('Failed to update training material');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainingMaterial = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('training_materials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrainingMaterials(prev =>
        prev.filter(material => material.id !== id)
      );
    } catch (error) {
      console.error('Error deleting training material:', error);
      setError('Failed to delete training material');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingSessions();
    fetchTrainingMaterials();
  }, [fetchTrainingSessions, fetchTrainingMaterials]);

  const value: TrainingContextType = {
    trainingSessions,
    trainingMaterials,
    loading,
    error,
    fetchTrainingSessions,
    fetchTrainingMaterials,
    createTrainingSession,
    updateTrainingSession,
    deleteTrainingSession,
    createTrainingMaterial,
    updateTrainingMaterial,
    deleteTrainingMaterial,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};
