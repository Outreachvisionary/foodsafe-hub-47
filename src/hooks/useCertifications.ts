
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificationService, Certification, EmployeeCertification, CertificationStats } from '@/services/certificationService';
import { useToast } from '@/hooks/use-toast';

export const useCertifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const certificationsQuery = useQuery({
    queryKey: ['certifications'],
    queryFn: certificationService.getCertifications,
  });

  const employeeCertificationsQuery = useQuery({
    queryKey: ['employee-certifications'],
    queryFn: certificationService.getEmployeeCertifications,
  });

  const statsQuery = useQuery({
    queryKey: ['certification-stats'],
    queryFn: certificationService.getCertificationStatistics,
  });

  const createCertificationMutation = useMutation({
    mutationFn: certificationService.createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({ title: 'Success', description: 'Certification created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create certification', variant: 'destructive' });
    },
  });

  const updateCertificationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Certification> }) =>
      certificationService.updateCertification(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({ title: 'Success', description: 'Certification updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update certification', variant: 'destructive' });
    },
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: certificationService.deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({ title: 'Success', description: 'Certification deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete certification', variant: 'destructive' });
    },
  });

  const createEmployeeCertificationMutation = useMutation({
    mutationFn: certificationService.createEmployeeCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-certifications'] });
      queryClient.invalidateQueries({ queryKey: ['certification-stats'] });
      toast({ title: 'Success', description: 'Employee certification added successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add employee certification', variant: 'destructive' });
    },
  });

  const updateEmployeeCertificationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EmployeeCertification> }) =>
      certificationService.updateEmployeeCertification(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-certifications'] });
      queryClient.invalidateQueries({ queryKey: ['certification-stats'] });
      toast({ title: 'Success', description: 'Employee certification updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update employee certification', variant: 'destructive' });
    },
  });

  return {
    // Data
    certifications: certificationsQuery.data || [],
    employeeCertifications: employeeCertificationsQuery.data || [],
    stats: statsQuery.data || {
      total_certifications: 0,
      active_certifications: 0,
      expiring_soon: 0,
      expired_certifications: 0
    },
    
    // Loading states
    isLoading: certificationsQuery.isLoading || employeeCertificationsQuery.isLoading || statsQuery.isLoading,
    
    // Mutations
    createCertification: createCertificationMutation.mutate,
    updateCertification: updateCertificationMutation.mutate,
    deleteCertification: deleteCertificationMutation.mutate,
    createEmployeeCertification: createEmployeeCertificationMutation.mutate,
    updateEmployeeCertification: updateEmployeeCertificationMutation.mutate,
    
    // Refetch
    refetch: () => {
      certificationsQuery.refetch();
      employeeCertificationsQuery.refetch();
      statsQuery.refetch();
    }
  };
};
