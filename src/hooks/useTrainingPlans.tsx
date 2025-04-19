
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingPlan, TrainingPriority } from '@/types/training';
import { useToast } from '@/hooks/use-toast';

const useTrainingPlans = () => {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('training_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;

      // Map database response to TrainingPlan interface
      const mappedPlans: TrainingPlan[] = (data || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        target_roles: Array.isArray(plan.target_roles) ? plan.target_roles : [],
        courses: Array.isArray(plan.courses) ? plan.courses : [],
        duration_days: plan.duration_days || 0,
        is_required: Boolean(plan.is_required),
        priority: (plan.priority || 'medium') as TrainingPriority,
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
      
      setPlans(mappedPlans);
    } catch (err) {
      console.error('Error fetching training plans:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch training plans'));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  
  const createPlan = async (planData: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      // Convert from our interface to the database schema
      const dbPlan = {
        name: planData.name,
        description: planData.description,
        target_roles: planData.target_roles || [],
        courses: planData.courses || [],
        duration_days: planData.duration_days || 0,
        is_required: planData.is_required || false,
        priority: planData.priority || 'medium',
        status: planData.status || 'Active',
        start_date: planData.start_date,
        end_date: planData.end_date,
        is_automated: planData.is_automated || false,
        automation_trigger: planData.automation_trigger,
        target_departments: planData.target_departments || [],
        related_standards: planData.related_standards || [],
        created_by: planData.created_by || 'Current User'
      };
      
      const { data, error } = await supabase
        .from('training_plans')
        .insert(dbPlan)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform to our TrainingPlan type
      const newPlan: TrainingPlan = {
        id: data.id,
        name: data.name,
        description: data.description,
        target_roles: Array.isArray(data.target_roles) ? data.target_roles : [],
        courses: Array.isArray(data.courses) ? data.courses : [],
        duration_days: data.duration_days || 0,
        is_required: Boolean(data.is_required),
        priority: (data.priority || 'medium') as TrainingPriority,
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
      
      setPlans(prev => [newPlan, ...prev]);
      
      toast({
        title: 'Training Plan Created',
        description: `${newPlan.name} has been successfully created.`,
        variant: 'default'
      });
      
      return newPlan;
    } catch (err) {
      console.error('Error creating training plan:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to create training plan. Please try again.',
        variant: 'destructive'
      });
      
      return null;
    }
  };
  
  const updatePlan = async (id: string, planData: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      // Convert from our interface to the database schema
      const dbPlan = {
        name: planData.name,
        description: planData.description,
        target_roles: planData.target_roles || [],
        courses: planData.courses || [],
        duration_days: planData.duration_days || 0,
        is_required: planData.is_required || false,
        priority: planData.priority || 'medium',
        status: planData.status,
        start_date: planData.start_date,
        end_date: planData.end_date,
        is_automated: planData.is_automated || false,
        automation_trigger: planData.automation_trigger,
        target_departments: planData.target_departments || [],
        related_standards: planData.related_standards || [],
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('training_plans')
        .update(dbPlan)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform database response to our TrainingPlan interface
      const updatedPlan: TrainingPlan = {
        id: data.id,
        name: data.name,
        description: data.description,
        target_roles: Array.isArray(data.target_roles) ? data.target_roles : [],
        courses: Array.isArray(data.courses) ? data.courses : [],
        duration_days: data.duration_days || 0,
        is_required: Boolean(data.is_required),
        priority: (data.priority || 'medium') as TrainingPriority,
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
      
      // Update plans in state
      setPlans(prev => 
        prev.map(plan => 
          plan.id === id ? updatedPlan : plan
        )
      );
      
      toast({
        title: 'Training Plan Updated',
        description: `${updatedPlan.name} has been successfully updated.`,
        variant: 'default'
      });
      
      return updatedPlan;
    } catch (err) {
      console.error('Error updating training plan:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to update training plan. Please try again.',
        variant: 'destructive'
      });
      
      return null;
    }
  };
  
  const deletePlan = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('training_plans')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from state
      setPlans(prev => prev.filter(plan => plan.id !== id));
      
      toast({
        title: 'Training Plan Deleted',
        description: 'The training plan has been successfully deleted.',
        variant: 'default'
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting training plan:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to delete training plan. Please try again.',
        variant: 'destructive'
      });
      
      return false;
    }
  };
  
  return {
    plans,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan
  };
};

export default useTrainingPlans;
