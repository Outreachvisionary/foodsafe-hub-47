
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkflowSteps, updateWorkflowStep, WorkflowStep } from '@/services/workflow/workflowStepService';
import { toast } from 'sonner';

export const useWorkflowSteps = (capaId: string) => {
  const queryClient = useQueryClient();

  const {
    data: steps = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['workflow-steps', capaId],
    queryFn: () => getWorkflowSteps(capaId),
    enabled: !!capaId
  });

  const updateStepMutation = useMutation({
    mutationFn: ({ 
      stepId, 
      status, 
      comments, 
      completedBy 
    }: { 
      stepId: string; 
      status: 'approved' | 'rejected' | 'completed';
      comments: string;
      completedBy: string;
    }) => updateWorkflowStep(stepId, status, comments, completedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-steps', capaId] });
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      toast.success('Workflow step updated successfully');
    },
    onError: (error: any) => {
      console.error('Update workflow step error:', error);
      toast.error(`Failed to update workflow step: ${error.message || 'Unknown error'}`);
    }
  });

  return {
    steps,
    isLoading,
    error,
    updateStep: updateStepMutation.mutate,
    isUpdating: updateStepMutation.isPending
  };
};
