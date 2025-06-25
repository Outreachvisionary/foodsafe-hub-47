
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingPlanService, TrainingPlan, TrainingSession } from '@/services/trainingPlanService';
import { useToast } from '@/hooks/use-toast';

export const useTrainingPlans = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const trainingPlansQuery = useQuery({
    queryKey: ['training-plans'],
    queryFn: trainingPlanService.getTrainingPlans,
  });

  const trainingSessionsQuery = useQuery({
    queryKey: ['training-sessions'],
    queryFn: trainingPlanService.getTrainingSessions,
  });

  const createTrainingPlanMutation = useMutation({
    mutationFn: trainingPlanService.createTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      toast({ title: 'Success', description: 'Training plan created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create training plan', variant: 'destructive' });
    },
  });

  const createTrainingSessionMutation = useMutation({
    mutationFn: trainingPlanService.createTrainingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
      toast({ title: 'Success', description: 'Training session created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create training session', variant: 'destructive' });
    },
  });

  return {
    trainingPlans: trainingPlansQuery.data || [],
    trainingSessions: trainingSessionsQuery.data || [],
    isLoading: trainingPlansQuery.isLoading || trainingSessionsQuery.isLoading,
    createTrainingPlan: createTrainingPlanMutation.mutate,
    createTrainingSession: createTrainingSessionMutation.mutate,
    refetch: () => {
      trainingPlansQuery.refetch();
      trainingSessionsQuery.refetch();
    }
  };
};
