
import { useState, useEffect } from 'react';
import { TrainingPlan, TrainingPriority } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

interface UseTrainingPlansProps {
  initialData?: TrainingPlan[];
}

const useTrainingPlans = ({ initialData = [] }: UseTrainingPlansProps = {}) => {
  const [plans, setPlans] = useState<TrainingPlan[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrainingPlans = async () => {
    setIsLoading(true);
    try {
      // Here you'd normally fetch from an API
      // For now, simulate with mock data
      const mockPlans: TrainingPlan[] = [
        {
          id: '1',
          name: 'New Employee Onboarding',
          description: 'Training plan for new employees',
          target_roles: ['Employee'],
          target_departments: ['All'],
          courses: ['course1', 'course2'],
          duration_days: 30,
          is_required: true,
          priority: TrainingPriority.High,
          status: 'active',
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          created_by: 'admin',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          is_active: true,
          is_automated: false
        }
      ];
      
      setPlans(mockPlans);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching training plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTrainingPlan = async (planData: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    setIsLoading(true);
    try {
      // Create a new plan object
      const newPlan: TrainingPlan = {
        id: Date.now().toString(),
        name: planData.name || '',
        description: planData.description || '',
        target_roles: planData.target_roles || [],
        target_departments: planData.target_departments || [],
        courses: planData.courses || [],
        duration_days: planData.duration_days || 0,
        is_required: planData.is_required || false,
        priority: planData.priority as TrainingPriority || TrainingPriority.Medium,
        status: planData.status || 'draft',
        start_date: planData.start_date || new Date().toISOString(),
        end_date: planData.end_date || new Date().toISOString(),
        created_by: 'current-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        is_automated: false
      };
      
      // Add to state
      setPlans(prevPlans => [...prevPlans, newPlan]);
      return newPlan;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error creating training plan:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrainingPlan = async (id: string, planData: Partial<TrainingPlan>): Promise<TrainingPlan> => {
    setIsLoading(true);
    try {
      // Find and update the plan
      const updatedPlans = plans.map(plan => {
        if (plan.id === id) {
          return {
            ...plan,
            ...planData,
            name: planData.name || plan.name,
            description: planData.description || plan.description,
            target_roles: planData.target_roles || plan.target_roles,
            target_departments: planData.target_departments || plan.target_departments,
            courses: planData.courses || plan.courses,
            duration_days: planData.duration_days || plan.duration_days,
            is_required: planData.is_required ?? plan.is_required,
            priority: planData.priority || plan.priority,
            status: planData.status || plan.status,
            start_date: planData.start_date || plan.start_date,
            end_date: planData.end_date || plan.end_date,
            updated_at: new Date().toISOString()
          };
        }
        return plan;
      });
      
      setPlans(updatedPlans);
      const updatedPlan = updatedPlans.find(p => p.id === id);
      if (!updatedPlan) throw new Error('Plan not found after update');
      return updatedPlan;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error updating training plan:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrainingPlan = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Filter out the deleted plan
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error deleting training plan:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingPlans();
  }, []);

  return {
    plans,
    isLoading,
    error,
    fetchTrainingPlans,
    createTrainingPlan,
    updateTrainingPlan,
    deleteTrainingPlan
  };
};

export default useTrainingPlans;
