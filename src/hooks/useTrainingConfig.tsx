
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrainingAutomationConfig } from '@/types/training';
import { trainingConfigService } from '@/services/training/trainingConfigService';

export function useTrainingConfig() {
  const [config, setConfig] = useState<TrainingAutomationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrainingConfig = async () => {
      try {
        setLoading(true);
        const configData = await trainingConfigService.getAutomationConfig();
        setConfig(configData);
      } catch (err) {
        console.error('Error fetching training config:', err);
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

    fetchTrainingConfig();
  }, [toast]);

  const updateConfig = async (
    updates: Partial<TrainingAutomationConfig>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!config) throw new Error('No configuration loaded');
      
      const updatedConfig = { ...config, ...updates };
      const success = await trainingConfigService.updateAutomationConfig(updatedConfig);
      
      if (!success) throw new Error('Failed to update configuration');
      
      setConfig(updatedConfig);
      
      toast({
        title: 'Success',
        description: 'Training configuration updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training config:', err);
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

  return {
    config,
    loading,
    error,
    updateConfig
  };
}
