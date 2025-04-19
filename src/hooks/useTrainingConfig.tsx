
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrainingAutomationConfig {
  id: string;
  enabled: boolean;
  documentChangesTrigger: boolean;
  newEmployeeTrigger: boolean;
  roleChangeTrigger: boolean;
  rules: any[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useTrainingConfig = () => {
  const [config, setConfig] = useState<TrainingAutomationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('training_automation_config')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      
      // Transform data from database shape to our TypeScript interface
      const transformedConfig: TrainingAutomationConfig = {
        id: data.id,
        enabled: data.enabled,
        documentChangesTrigger: data.document_changes_trigger,
        newEmployeeTrigger: data.new_employee_trigger,
        roleChangeTrigger: data.role_change_trigger,
        rules: Array.isArray(data.rules) ? data.rules : [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by
      };
      
      setConfig(transformedConfig);
    } catch (err) {
      console.error('Error fetching training config:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch training configuration'));
      
      // Create default config if none exists
      if (err instanceof Error && err.message.includes('No rows found')) {
        await createDefaultConfig();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createDefaultConfig = async () => {
    try {
      const defaultConfig = {
        enabled: true,
        document_changes_trigger: true,
        new_employee_trigger: true,
        role_change_trigger: true,
        rules: [],
        created_by: (await supabase.auth.getUser()).data.user?.id || 'system'
      };
      
      const { data, error } = await supabase
        .from('training_automation_config')
        .insert([defaultConfig])
        .select()
        .single();
      
      if (error) throw error;
      
      const transformedConfig: TrainingAutomationConfig = {
        id: data.id,
        enabled: data.enabled,
        documentChangesTrigger: data.document_changes_trigger,
        newEmployeeTrigger: data.new_employee_trigger,
        roleChangeTrigger: data.role_change_trigger,
        rules: Array.isArray(data.rules) ? data.rules : [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by
      };
      
      setConfig(transformedConfig);
      toast.success('Created default training automation configuration');
    } catch (err) {
      console.error('Error creating default config:', err);
      setError(err instanceof Error ? err : new Error('Failed to create default configuration'));
      toast.error('Failed to create default configuration');
    }
  };

  const updateConfig = async (updates: Partial<TrainingAutomationConfig>) => {
    try {
      if (!config) {
        throw new Error('Cannot update: configuration not loaded');
      }
      
      // Convert from our interface to database format
      const dbUpdates: Record<string, any> = {};
      
      if (updates.enabled !== undefined) dbUpdates.enabled = updates.enabled;
      if (updates.documentChangesTrigger !== undefined) dbUpdates.document_changes_trigger = updates.documentChangesTrigger;
      if (updates.newEmployeeTrigger !== undefined) dbUpdates.new_employee_trigger = updates.newEmployeeTrigger;
      if (updates.roleChangeTrigger !== undefined) dbUpdates.role_change_trigger = updates.roleChangeTrigger;
      if (updates.rules !== undefined) dbUpdates.rules = updates.rules;
      
      const { data, error } = await supabase
        .from('training_automation_config')
        .update(dbUpdates)
        .eq('id', config.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform data from database shape to our TypeScript interface
      const updatedConfig: TrainingAutomationConfig = {
        id: data.id,
        enabled: data.enabled,
        documentChangesTrigger: data.document_changes_trigger,
        newEmployeeTrigger: data.new_employee_trigger,
        roleChangeTrigger: data.role_change_trigger,
        rules: Array.isArray(data.rules) ? data.rules : [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by
      };
      
      setConfig(updatedConfig);
      toast.success('Training automation configuration updated');
      return true;
    } catch (err) {
      console.error('Error updating config:', err);
      setError(err instanceof Error ? err : new Error('Failed to update configuration'));
      toast.error('Failed to update configuration');
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, updateConfig, refreshConfig: fetchConfig };
};
