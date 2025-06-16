
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchComplaints, 
  createComplaint, 
  updateComplaint, 
  deleteComplaint,
  fetchComplaintById 
} from '@/services/complaintService';
import { toast } from 'sonner';
import { Complaint, ComplaintFilter, CreateComplaintRequest } from '@/types/complaint';

export const useComplaints = (filters?: ComplaintFilter) => {
  const queryClient = useQueryClient();

  const {
    data: complaints = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['complaints', filters],
    queryFn: () => fetchComplaints(filters),
  });

  const createMutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create complaint: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Complaint> }) =>
      updateComplaint(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update complaint: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete complaint: ${error.message}`);
    },
  });

  return {
    complaints,
    isLoading,
    error,
    createComplaint: createMutation.mutate,
    updateComplaint: updateMutation.mutate,
    deleteComplaint: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refresh: refetch,
  };
};

export const useComplaint = (id: string) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => fetchComplaintById(id),
    enabled: !!id,
  });
};

export default useComplaints;
