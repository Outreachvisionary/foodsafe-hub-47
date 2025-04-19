
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
            
            // Map database properties to interface properties
            const mappedConfig: TrainingAutomationConfig = {
              id: createdConfig.id,
              enabled: createdConfig.enabled,
              // Parse JSON or use empty array as fallback
              rules: Array.isArray(createdConfig.rules) ? createdConfig.rules : [],
              documentChangesTrigger: createdConfig.document_changes_trigger,
              newEmployeeTrigger: createdConfig.new_employee_trigger,
              roleCangeTrigger: createdConfig.role_change_trigger,
              created_at: createdConfig.created_at,
              updated_at: createdConfig.updated_at,
              created_by: createdConfig.created_by,
            };
            
            setConfig(mappedConfig);
          } else {
            throw error;
          }
        } else {
          // Map database properties to interface properties
          const mappedConfig: TrainingAutomationConfig = {
            id: data.id,
            enabled: data.enabled,
            // Parse JSON or use empty array as fallback
            rules: Array.isArray(data.rules) ? data.rules : [],
            documentChangesTrigger: data.document_changes_trigger,
            newEmployeeTrigger: data.new_employee_trigger,
            roleCangeTrigger: data.role_change_trigger,
            created_at: data.created_at,
            updated_at: data.updated_at,
            created_by: data.created_by,
          };
          
          setConfig(mappedConfig);
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
      
      // Map interface properties to database properties
      const dbUpdates = {
        enabled: updatedConfig.enabled,
        rules: updatedConfig.rules || [],
        document_changes_trigger: updatedConfig.documentChangesTrigger,
        new_employee_trigger: updatedConfig.newEmployeeTrigger,
        role_change_trigger: updatedConfig.roleCangeTrigger,
      };
      
      const { error } = await supabase
        .from('training_automation_config')
        .update(dbUpdates)
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
