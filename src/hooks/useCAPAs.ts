
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { capaService } from '@/services/api';
import { toast } from 'sonner';

export const useCAPAs = () => {
  const queryClient = useQueryClient();

  const {
    data: capas = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['capas'],
    queryFn: capaService.getCAPAs,
  });

  const createMutation = useMutation({
    mutationFn: capaService.createCAPA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      toast.success('CAPA created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create CAPA: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      capaService.updateCAPA(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      toast.success('CAPA updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update CAPA: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: capaService.deleteCAPA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      toast.success('CAPA deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete CAPA: ${error.message}`);
    },
  });

  return {
    capas,
    isLoading,
    error,
    createCAPA: createMutation.mutate,
    updateCAPA: updateMutation.mutate,
    deleteCAPA: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
