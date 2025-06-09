
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
        name: plan.name || plan.title || 'Untitled Plan',
        target_roles: plan.target_roles || plan.targetRoles || [],
        target_departments: plan.target_departments || plan.targetDepartments || [],
        courses: plan.courses || plan.coursesIncluded || [],
        priority: plan.priority || 'Medium',
        startDate: plan.start_date || plan.startDate,
        endDate: plan.end_date || plan.endDate,
        duration_days: plan.duration_days || plan.durationDays,
        is_required: plan.is_required || plan.isRequired || false
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
        title: planData.title || planData.name,
        description: planData.description,
        target_roles: planData.target_roles || planData.targetRoles || [],
        target_departments: planData.target_departments || planData.targetDepartments || [],
        courses: planData.courses || planData.coursesIncluded || [],
        priority: planData.priority || 'Medium',
        status: planData.status || 'Active',
        is_active: planData.is_active !== false,
        is_required: planData.is_required || planData.isRequired || false,
        created_by: 'current_user',
        start_date: planData.startDate || planData.start_date,
        end_date: planData.endDate || planData.end_date,
        duration_days: planData.durationDays || planData.duration_days
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
        name: data.name || data.title || 'Untitled Plan',
        target_roles: data.target_roles || [],
        target_departments: data.target_departments || [],
        courses: data.courses || [],
        priority: data.priority || 'Medium',
        startDate: data.start_date,
        endDate: data.end_date,
        duration_days: data.duration_days,
        is_required: data.is_required || false
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
        start_date: updates.startDate || updates.start_date,
        end_date: updates.endDate || updates.end_date,
        duration_days: updates.durationDays || updates.duration_days,
        is_required: updates.isRequired || updates.is_required
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
        name: data.name || data.title || 'Untitled Plan',
        target_roles: data.target_roles || [],
        target_departments: data.target_departments || [],
        courses: data.courses || [],
        priority: data.priority || 'Medium',
        startDate: data.start_date,
        endDate: data.end_date,
        duration_days: data.duration_days,
        is_required: data.is_required || false
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
