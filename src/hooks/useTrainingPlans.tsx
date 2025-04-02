
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrainingPlan } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

export function useTrainingPlans() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('training_plans')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPlans(data || []);
      } catch (err) {
        console.error('Error fetching training plans:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch training plans'));
        toast({
          title: 'Error',
          description: 'Failed to load training plans. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPlans();
  }, [toast]);

  const createTrainingPlan = async (planData: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('training_plans')
        .insert(planData)
        .select()
        .single();
        
      if (error) throw error;
      
      setPlans(prev => [data as TrainingPlan, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Training plan created successfully.',
      });
      
      return data as TrainingPlan;
    } catch (err) {
      console.error('Error creating training plan:', err);
      toast({
        title: 'Error',
        description: 'Failed to create training plan. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingPlan = async (
    planId: string,
    updates: Partial<TrainingPlan>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('training_plans')
        .update(updates)
        .eq('id', planId);
        
      if (error) throw error;
      
      // Update the local state
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === planId ? { ...plan, ...updates } : plan
        )
      );
      
      toast({
        title: 'Success',
        description: 'Training plan updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training plan:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training plan. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    error,
    createTrainingPlan,
    updateTrainingPlan
  };
}
