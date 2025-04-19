
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingPlan, TrainingPriority } from '@/types/training';

export interface TrainingContextType {
  trainingPlans: TrainingPlan[];
  isLoading: boolean;
  error: Error | null;
  fetchTrainingPlans: () => Promise<void>;
  createTrainingPlan: (planData: Omit<TrainingPlan, 'id' | 'created_at' | 'updated_at'>) => Promise<TrainingPlan>;
  updateTrainingPlan: (id: string, updates: Partial<TrainingPlan>) => Promise<void>;
  deleteTrainingPlan: (id: string) => Promise<void>;
  // Mock data for dashboard
  sessions: any[];
  departmentStats: {
    department: string;
    name: string;
    completed: number;
    overdue: number;
    totalAssigned: number;
    complianceRate: number;
  }[];
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

// Create a hook to use the TrainingContext
export const useTrainingContext = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTrainingContext must be used within a TrainingProvider');
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

  // Mock data for dashboard
  const mockSessions = [
    { id: '1', title: 'Food Safety Basics', due_date: new Date().toISOString(), assigned_to: ['user1', 'user2'], training_type: 'classroom', completion_status: 'in-progress' },
    { id: '2', title: 'GMP Training', due_date: new Date(Date.now() + 86400000).toISOString(), assigned_to: ['user3'], training_type: 'online', completion_status: 'not-started' },
  ];
  
  const mockDepartmentStats = [
    { department: 'Production', name: 'Production', completed: 45, overdue: 5, totalAssigned: 50, complianceRate: 90 },
    { department: 'Quality', name: 'Quality', completed: 38, overdue: 2, totalAssigned: 40, complianceRate: 95 },
    { department: 'Maintenance', name: 'Maintenance', completed: 18, overdue: 7, totalAssigned: 25, complianceRate: 72 },
    { department: 'R&D', name: 'R&D', completed: 12, overdue: 3, totalAssigned: 15, complianceRate: 80 },
  ];

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

      // Transform data to ensure priority is of type TrainingPriority
      const formattedPlans: TrainingPlan[] = (data || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        target_roles: Array.isArray(plan.target_roles) ? plan.target_roles : [],
        courses: Array.isArray(plan.courses) ? plan.courses : [],
        duration_days: plan.duration_days || 0,
        is_required: Boolean(plan.is_required),
        priority: (plan.priority as TrainingPriority) || 'medium',
        status: plan.status,
        start_date: plan.start_date,
        end_date: plan.end_date,
        is_automated: Boolean(plan.is_automated),
        automation_trigger: plan.automation_trigger,
        created_by: plan.created_by,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
        target_departments: Array.isArray(plan.target_departments) ? plan.target_departments : [],
        related_standards: Array.isArray(plan.related_standards) ? plan.related_standards : []
      }));

      setTrainingPlans(formattedPlans);
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

      // Transform to ensure priority is of type TrainingPriority
      const newPlan: TrainingPlan = {
        id: data.id,
        name: data.name,
        description: data.description,
        target_roles: Array.isArray(data.target_roles) ? data.target_roles : [],
        courses: Array.isArray(data.courses) ? data.courses : [],
        duration_days: data.duration_days || 0,
        is_required: Boolean(data.is_required),
        priority: (data.priority as TrainingPriority) || 'medium',
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        is_automated: Boolean(data.is_automated),
        automation_trigger: data.automation_trigger,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        target_departments: Array.isArray(data.target_departments) ? data.target_departments : [],
        related_standards: Array.isArray(data.related_standards) ? data.related_standards : []
      };

      setTrainingPlans(prev => [newPlan, ...prev]);
      return newPlan;
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
        isLoading: loading,
        error,
        fetchTrainingPlans,
        createTrainingPlan: handleCreateTrainingPlan,
        updateTrainingPlan,
        deleteTrainingPlan,
        sessions: mockSessions,
        departmentStats: mockDepartmentStats
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export default TrainingContext;
