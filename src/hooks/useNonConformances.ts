
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllNonConformances, 
  createNonConformance, 
  updateNonConformance, 
  deleteNonConformance,
  getNonConformanceById 
} from '@/services/nonConformanceService';
import { toast } from 'sonner';
import { NonConformance } from '@/types/non-conformance';

export const useNonConformances = () => {
  const queryClient = useQueryClient();

  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['non-conformances'],
    queryFn: getAllNonConformances,
  });

  const nonConformances = result?.data || [];

  const createMutation = useMutation({
    mutationFn: createNonConformance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      toast.success('Non-conformance created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create non-conformance: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<NonConformance> }) =>
      updateNonConformance(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      toast.success('Non-conformance updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update non-conformance: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNonConformance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      toast.success('Non-conformance deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete non-conformance: ${error.message}`);
    },
  });

  return {
    nonConformances,
    isLoading,
    error,
    createNonConformance: createMutation.mutate,
    updateNonConformance: updateMutation.mutate,
    deleteNonConformance: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refresh: refetch,
  };
};

export const useNonConformance = (id: string) => {
  return useQuery({
    queryKey: ['non-conformance', id],
    queryFn: () => getNonConformanceById(id),
    enabled: !!id,
  });
};
