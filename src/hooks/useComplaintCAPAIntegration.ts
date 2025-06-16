
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCAPAFromComplaint } from '@/services/complaintService';
import { getCAPAs } from '@/services/capaService';
import { toast } from 'sonner';

export const useComplaintCAPAIntegration = (complaintId: string) => {
  const queryClient = useQueryClient();

  // Fetch available CAPAs for linking
  const {
    data: availableCAPAs = [],
    isLoading: isLoadingAvailableCAPAs
  } = useQuery({
    queryKey: ['available-capas'],
    queryFn: () => getCAPAs(),
  });

  // Generate CAPA from complaint mutation
  const generateCAPAMutation = useMutation({
    mutationFn: (userId: string) => createCAPAFromComplaint(complaintId, userId),
    onSuccess: (capa) => {
      toast.success('CAPA generated successfully from complaint');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['capas'] });
      return capa;
    },
    onError: (error: any) => {
      toast.error(`Failed to generate CAPA: ${error.message}`);
    },
  });

  return {
    availableCAPAs,
    isLoadingAvailableCAPAs,
    generateCAPA: generateCAPAMutation.mutate,
    isGeneratingCAPA: generateCAPAMutation.isPending,
  };
};
