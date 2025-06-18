
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { capaService } from '@/services/api';
import { toast } from 'sonner';

export const useCAPAs = () => {
  const queryClient = useQueryClient();

  const {
    data: capas = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['capas'],
    queryFn: capaService.getCAPAs,
    retry: (failureCount, error) => {
      // Don't retry RLS policy errors
      if (error?.message?.toLowerCase().includes('policy')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const createMutation = useMutation({
    mutationFn: capaService.createCAPA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      toast.success('CAPA created successfully');
    },
    onError: (error: any) => {
      console.error('Create CAPA error:', error);
      toast.error(`Failed to create CAPA: ${error.message || 'Unknown error'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      capaService.updateCAPA(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      toast.success('CAPA updated successfully');
    },
    onError: (error: any) => {
      console.error('Update CAPA error:', error);
      toast.error(`Failed to update CAPA: ${error.message || 'Unknown error'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: capaService.deleteCAPA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      toast.success('CAPA deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete CAPA error:', error);
      toast.error(`Failed to delete CAPA: ${error.message || 'Unknown error'}`);
    },
  });

  return {
    capas,
    isLoading,
    error: error?.message || null,
    isError,
    createCAPA: createMutation.mutate,
    updateCAPA: updateMutation.mutate,
    deleteCAPA: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
