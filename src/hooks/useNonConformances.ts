
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nonConformanceService } from '@/services/api';
import { toast } from 'sonner';

export const useNonConformances = () => {
  const queryClient = useQueryClient();

  const {
    data: nonConformances = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['non-conformances'],
    queryFn: nonConformanceService.getNonConformances,
  });

  const createMutation = useMutation({
    mutationFn: nonConformanceService.createNonConformance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      toast.success('Non-conformance created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create non-conformance: ${error.message}`);
    },
  });

  return {
    nonConformances,
    isLoading,
    error,
    createNonConformance: createMutation.mutate,
    isCreating: createMutation.isPending,
    refresh: refetch,
  };
};
