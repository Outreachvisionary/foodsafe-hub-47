import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { NonConformance } from '@/types/non-conformance';

export const useNonConformances = () => {
  const queryClient = useQueryClient();

  const {
    data: nonConformances = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['non-conformances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('non_conformances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newNC: any) => {
      const { data, error } = await supabase
        .from('non_conformances')
        .insert(newNC)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      toast.success('Non-conformance created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create non-conformance: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('non_conformances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      toast.success('Non-conformance updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update non-conformance: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('non_conformances')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
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
    error: error?.message || null,
    createNonConformance: createMutation.mutate,
    updateNonConformance: updateMutation.mutate,
    deleteNonConformance: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
    refresh: refetch,
  };
};