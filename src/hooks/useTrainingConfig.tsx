
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrainingAutomationConfig } from '@/types/training';

const useTrainingConfig = () => {
  const [config, setConfig] = useState<TrainingAutomationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('training_automation_config')
          .select('*')
          .limit(1)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No config found, create default
            const defaultConfig: Partial<TrainingAutomationConfig> = {
              enabled: true,
              rules: [],
              documentChangesTrigger: true,
              newEmployeeTrigger: true,
              roleCangeTrigger: true
            };
            
            const { data: createdConfig, error: createError } = await supabase
              .from('training_automation_config')
              .insert(defaultConfig)
              .select()
              .single();
              
            if (createError) throw createError;
            
            setConfig(createdConfig as TrainingAutomationConfig);
          } else {
            throw error;
          }
        } else {
          setConfig(data as TrainingAutomationConfig);
        }
      } catch (err) {
        console.error('Error fetching training automation config:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch training config'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, []);
  
  const updateConfig = async (updatedConfig: Partial<TrainingAutomationConfig>): Promise<boolean> => {
    try {
      if (!config) return false;
      
      const { error } = await supabase
        .from('training_automation_config')
        .update(updatedConfig)
        .eq('id', config.id);
        
      if (error) throw error;
      
      setConfig(prev => prev ? { ...prev, ...updatedConfig } : null);
      return true;
    } catch (err) {
      console.error('Error updating training automation config:', err);
      setError(err instanceof Error ? err : new Error('Failed to update training config'));
      return false;
    }
  };
  
  return {
    config,
    loading,
    error,
    updateConfig
  };
};

export default useTrainingConfig;
