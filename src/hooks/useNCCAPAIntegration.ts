
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCAPAFromNC, linkCAPAToNC, getLinkedCAPAs } from '@/services/nonConformanceService';
import { getCAPAs } from '@/services/capaService';
import { toast } from 'sonner';

export const useNCCAPAIntegration = (ncId: string) => {
  const queryClient = useQueryClient();

  // Fetch linked CAPAs
  const {
    data: linkedCAPAs = [],
    isLoading: isLoadingLinkedCAPAs,
    refetch: refetchLinkedCAPAs
  } = useQuery({
    queryKey: ['linked-capas', ncId],
    queryFn: () => getLinkedCAPAs(ncId),
    enabled: !!ncId,
  });

  // Fetch available CAPAs for linking
  const {
    data: availableCAPAs = [],
    isLoading: isLoadingAvailableCAPAs
  } = useQuery({
    queryKey: ['available-capas'],
    queryFn: () => getCAPAs(),
  });

  // Generate CAPA mutation
  const generateCAPAMutation = useMutation({
    mutationFn: ({ isAutomatic }: { isAutomatic: boolean }) =>
      generateCAPAFromNC(ncId, isAutomatic),
    onSuccess: (capa) => {
      toast.success('CAPA generated successfully');
      refetchLinkedCAPAs();
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      return capa;
    },
    onError: (error: any) => {
      toast.error(`Failed to generate CAPA: ${error.message}`);
    },
  });

  // Link CAPA mutation
  const linkCAPAMutation = useMutation({
    mutationFn: (capaId: string) => linkCAPAToNC(ncId, capaId),
    onSuccess: () => {
      toast.success('CAPA linked successfully');
      refetchLinkedCAPAs();
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to link CAPA: ${error.message}`);
    },
  });

  return {
    linkedCAPAs,
    availableCAPAs,
    isLoadingLinkedCAPAs,
    isLoadingAvailableCAPAs,
    generateCAPA: generateCAPAMutation.mutate,
    linkCAPA: linkCAPAMutation.mutate,
    isGeneratingCAPA: generateCAPAMutation.isPending,
    isLinkingCAPA: linkCAPAMutation.isPending,
    refetchLinkedCAPAs,
  };
};
