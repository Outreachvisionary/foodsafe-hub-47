
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingPlan } from '@/types/training';
import { toast } from 'sonner';

export const useTrainingPlans = () => {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database fields to match TrainingPlan interface
      const transformedPlans: TrainingPlan[] = (data || []).map(plan => ({
        ...plan,
        name: plan.name || 'Untitled Plan',
        target_roles: plan.target_roles || [],
        target_departments: plan.target_departments || [],
        courses: plan.courses || [],
        priority: (plan.priority || 'Medium') as any,
        startDate: plan.start_date,
        endDate: plan.end_date,
        duration_days: plan.duration_days,
        is_required: plan.is_required || false,
        is_active: plan.is_automated !== false // Map is_automated to is_active
      }));

      setTrainingPlans(transformedPlans);
    } catch (error) {
      console.error('Error fetching training plans:', error);
      toast.error('Failed to fetch training plans');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTrainingPlan = useCallback(async (planData: Partial<TrainingPlan>) => {
    setIsLoading(true);
    try {
      // Transform frontend data to database format
      const dbPlan = {
        name: planData.name,
        description: planData.description,
        target_roles: planData.target_roles || [],
        target_departments: planData.target_departments || [],
        courses: planData.courses || [],
        priority: planData.priority || 'Medium',
        status: planData.status || 'Active',
        is_automated: planData.is_active !== false, // Map is_active to is_automated
        is_required: planData.is_required || false,
        created_by: 'current_user',
        start_date: planData.startDate,
        end_date: planData.endDate,
        duration_days: planData.duration_days
      };

      const { data, error } = await supabase
        .from('training_plans')
        .insert([dbPlan])
        .select()
        .single();

      if (error) throw error;

      // Transform back to frontend format
      const newPlan: TrainingPlan = {
        ...data,
        name: data.name || 'Untitled Plan',
        target_roles: data.target_roles || [],
        target_departments: data.target_departments || [],
        courses: data.courses || [],
        priority: (data.priority || 'Medium') as any,
        startDate: data.start_date,
        endDate: data.end_date,
        duration_days: data.duration_days,
        is_required: data.is_required || false,
        is_active: data.is_automated !== false // Map is_automated to is_active
      };

      setTrainingPlans(prev => [newPlan, ...prev]);
      toast.success('Training plan created successfully');
      return newPlan;
    } catch (error) {
      console.error('Error creating training plan:', error);
      toast.error('Failed to create training plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTrainingPlan = useCallback(async (id: string, updates: Partial<TrainingPlan>) => {
    setIsLoading(true);
    try {
      // Transform updates to database format
      const dbUpdates = {
        ...updates,
        start_date: updates.startDate,
        end_date: updates.endDate,
        duration_days: updates.duration_days,
        is_required: updates.is_required,
        is_automated: updates.is_active // Map is_active to is_automated
      };

      const { data, error } = await supabase
        .from('training_plans')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform back to frontend format
      const updatedPlan: TrainingPlan = {
        ...data,
        name: data.name || 'Untitled Plan',
        target_roles: data.target_roles || [],
        target_departments: data.target_departments || [],
        courses: data.courses || [],
        priority: (data.priority || 'Medium') as any,
        startDate: data.start_date,
        endDate: data.end_date,
        duration_days: data.duration_days,
        is_required: data.is_required || false,
        is_active: data.is_automated !== false // Map is_automated to is_active
      };

      setTrainingPlans(prev => prev.map(plan => 
        plan.id === id ? updatedPlan : plan
      ));
      toast.success('Training plan updated successfully');
      return updatedPlan;
    } catch (error) {
      console.error('Error updating training plan:', error);
      toast.error('Failed to update training plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTrainingPlan = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('training_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrainingPlans(prev => prev.filter(plan => plan.id !== id));
      toast.success('Training plan deleted successfully');
    } catch (error) {
      console.error('Error deleting training plan:', error);
      toast.error('Failed to delete training plan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    trainingPlans,
    isLoading,
    fetchPlans,
    createTrainingPlan,
    updateTrainingPlan,
    deleteTrainingPlan
  };
};
