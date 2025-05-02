
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
          title: 'New Employee Onboarding',
          description: 'Training plan for new employees',
          target_roles: ['Employee'],
          targetRoles: ['Employee'],
          target_departments: ['All'],
          targetDepartments: ['All'],
          courses: ['course1', 'course2'],
          duration_days: 30,
          durationDays: 30,
          is_required: true,
          isRequired: true,
          priority: TrainingPriority.High,
          status: 'active',
          start_date: '2023-01-01',
          startDate: '2023-01-01',
          end_date: '2023-12-31',
          endDate: '2023-12-31',
          created_by: 'admin',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          required_for: ['all'],
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
        title: planData.title || '',
        description: planData.description || '',
        target_roles: planData.target_roles || [],
        targetRoles: planData.targetRoles || planData.target_roles || [],
        target_departments: planData.target_departments || [],
        targetDepartments: planData.targetDepartments || planData.target_departments || [],
        courses: planData.courses || [],
        duration_days: planData.duration_days || 0,
        durationDays: planData.durationDays || planData.duration_days || 0,
        is_required: planData.is_required || false,
        isRequired: planData.isRequired || planData.is_required || false,
        priority: planData.priority as TrainingPriority || TrainingPriority.Medium,
        status: planData.status || 'draft',
        start_date: planData.start_date || new Date().toISOString(),
        startDate: planData.startDate || planData.start_date || new Date().toISOString(),
        end_date: planData.end_date || new Date().toISOString(),
        endDate: planData.endDate || planData.end_date || new Date().toISOString(),
        created_by: 'current-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        required_for: planData.required_for || [],
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
            title: planData.title || plan.title,
            description: planData.description || plan.description,
            target_roles: planData.target_roles || plan.target_roles,
            targetRoles: planData.targetRoles || planData.target_roles || plan.targetRoles,
            courses: planData.courses || plan.courses,
            duration_days: planData.duration_days || plan.duration_days,
            durationDays: planData.durationDays || planData.duration_days || plan.durationDays,
            is_required: planData.is_required ?? plan.is_required,
            isRequired: planData.isRequired ?? planData.is_required ?? plan.isRequired,
            priority: planData.priority || plan.priority,
            status: planData.status || plan.status,
            start_date: planData.start_date || plan.start_date,
            startDate: planData.startDate || planData.start_date || plan.startDate,
            end_date: planData.end_date || plan.end_date,
            endDate: planData.endDate || planData.end_date || plan.endDate,
            target_departments: planData.target_departments || plan.target_departments,
            targetDepartments: planData.targetDepartments || planData.target_departments || plan.targetDepartments,
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
