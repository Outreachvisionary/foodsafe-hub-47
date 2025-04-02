import { supabase } from '@/integrations/supabase/client';
import { TrainingAutomationConfig, AutoAssignRule } from '@/types/training';

/**
 * Service for training configuration management
 */
export const trainingConfigService = {
  /**
   * Get the current training automation configuration
   * Creates a default config if none exists
   */
  getAutomationConfig: async (): Promise<TrainingAutomationConfig> => {
    try {
      // Try to fetch existing config
      const { data, error } = await supabase
        .from('training_automation_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      // If we found a config, return it
      if (data && data.length > 0) {
        return data[0] as TrainingAutomationConfig;
      }
      
      // Otherwise create a default config
      const defaultConfig: Partial<TrainingAutomationConfig> = {
        enabled: true,
        new_employee_trigger: true,
        role_change_trigger: true,
        document_changes_trigger: true,
        rules: [],
        created_by: 'system'
      };
      
      const { data: newConfig, error: insertError } = await supabase
        .from('training_automation_config')
        .insert(defaultConfig)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return newConfig as TrainingAutomationConfig;
    } catch (error) {
      console.error('Error getting training automation config:', error);
      // Return a fallback config if DB operations fail
      return {
        id: 'fallback',
        enabled: false,
        new_employee_trigger: false,
        role_change_trigger: false,
        document_changes_trigger: false,
        rules: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system'
      };
    }
  },
  
  /**
   * Update the training automation configuration
   * @param config Updated configuration
   */
  updateAutomationConfig: async (config: TrainingAutomationConfig): Promise<boolean> => {
    try {
      // Ensure we have an ID
      if (!config.id) {
        throw new Error('Config ID is required for update');
      }
      
      // Update the config
      const { error } = await supabase
        .from('training_automation_config')
        .update({
          enabled: config.enabled,
          new_employee_trigger: config.new_employee_trigger,
          role_change_trigger: config.role_change_trigger,
          document_changes_trigger: config.document_changes_trigger,
          rules: config.rules,
          updated_at: new Date().toISOString()
        })
        .eq('id', config.id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating training automation config:', error);
      return false;
    }
  },
  
  /**
   * Add a new auto-assign rule to the configuration
   * @param rule New rule to add
   */
  addAutoAssignRule: async (rule: AutoAssignRule): Promise<boolean> => {
    try {
      // Get the current config
      const config = await trainingConfigService.getAutomationConfig();
      
      // Add the new rule to the rules array
      const updatedRules = [...(config.rules || []), rule];
      
      // Update the config with the new rules
      const success = await trainingConfigService.updateAutomationConfig({
        ...config,
        rules: updatedRules
      });
      
      return success;
    } catch (error) {
      console.error('Error adding auto-assign rule:', error);
      return false;
    }
  },
  
  /**
   * Remove an auto-assign rule from the configuration
   * @param ruleId ID of the rule to remove
   */
  removeAutoAssignRule: async (ruleId: string): Promise<boolean> => {
    try {
      // Get the current config
      const config = await trainingConfigService.getAutomationConfig();
      
      // Filter out the rule to remove
      const updatedRules = (config.rules || []).filter(r => r.id !== ruleId);
      
      // Update the config with the filtered rules
      const success = await trainingConfigService.updateAutomationConfig({
        ...config,
        rules: updatedRules
      });
      
      return success;
    } catch (error) {
      console.error('Error removing auto-assign rule:', error);
      return false;
    }
  }
};

export default trainingConfigService;
