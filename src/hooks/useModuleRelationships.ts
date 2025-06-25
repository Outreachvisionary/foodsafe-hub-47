
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moduleIntegrationService, ModuleRelationship } from '@/services/moduleIntegrationService';

export const useModuleRelationships = (sourceId: string, sourceType: string, targetType?: string) => {
  const queryClient = useQueryClient();

  const {
    data: relationships = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['module-relationships', sourceId, sourceType, targetType],
    queryFn: () => moduleIntegrationService.getRelatedItems(sourceId, sourceType, targetType),
    enabled: !!sourceId && !!sourceType
  });

  const createRelationshipMutation = useMutation({
    mutationFn: (relationship: Omit<ModuleRelationship, 'id' | 'created_at'>) =>
      moduleIntegrationService.createRelationship(relationship),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['module-relationships', sourceId, sourceType] 
      });
    }
  });

  const triggerWorkflowMutation = useMutation({
    mutationFn: ({ workflowType, data }: { workflowType: string; data: any }) =>
      moduleIntegrationService.triggerWorkflow(sourceType, sourceId, workflowType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['module-relationships'] 
      });
    }
  });

  return {
    relationships,
    isLoading,
    error,
    createRelationship: createRelationshipMutation.mutate,
    isCreating: createRelationshipMutation.isPending,
    triggerWorkflow: triggerWorkflowMutation.mutate,
    isTriggeringWorkflow: triggerWorkflowMutation.isPending
  };
};
