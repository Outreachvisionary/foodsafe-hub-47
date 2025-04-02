
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrainingAutomationConfig } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';
import trainingConfigService from '@/services/training/trainingConfigService';

export function useTrainingConfig() {
  const [config, setConfig] = useState<TrainingAutomationConfig | null>(null);
  const [documentCategories, setDocumentCategories] = useState<{id: number, name: string, description: string}[]>([]);
  const [documentStatusTypes, setDocumentStatusTypes] = useState<{id: number, name: string, description: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch automation config
        const configData = await trainingConfigService.getAutomationConfig();
        setConfig(configData);
        
        // Fetch document categories
        const categories = await trainingConfigService.getDocumentCategories();
        setDocumentCategories(categories);
        
        // Fetch document status types
        const statusTypes = await trainingConfigService.getDocumentStatusTypes();
        setDocumentStatusTypes(statusTypes);
      } catch (err) {
        console.error('Error fetching training configuration:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch training configuration'));
        toast({
          title: 'Error',
          description: 'Failed to load training configuration. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const updateConfig = async (updates: Partial<TrainingAutomationConfig>): Promise<boolean> => {
    try {
      setLoading(true);
      
      const success = await trainingConfigService.updateAutomationConfig(updates);
      
      if (success) {
        // Update local state
        setConfig(prev => prev ? { ...prev, ...updates } : null);
        
        toast({
          title: 'Success',
          description: 'Training configuration updated successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update training configuration.',
          variant: 'destructive',
        });
      }
      
      return success;
    } catch (err) {
      console.error('Error updating training configuration:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training configuration. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setDocumentCategoryTrainingRequirements = async (
    categoryId: number, 
    trainingSessionIds: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const success = await trainingConfigService.setDocumentCategoryTrainingRequirements(
        categoryId, 
        trainingSessionIds
      );
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Document category training requirements updated successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update document category training requirements.',
          variant: 'destructive',
        });
      }
      
      return success;
    } catch (err) {
      console.error('Error updating document category training requirements:', err);
      toast({
        title: 'Error',
        description: 'Failed to update document category training requirements. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    documentCategories,
    documentStatusTypes,
    loading,
    error,
    updateConfig,
    setDocumentCategoryTrainingRequirements
  };
}
