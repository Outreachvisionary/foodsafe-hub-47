
import { supabase } from '@/integrations/supabase/client';
import { TrainingAutomationConfig } from '@/types/training';

/**
 * Service for training configuration management
 */
export const trainingConfigService = {
  /**
   * Get the automation settings for the organization
   */
  getAutomationConfig: async (): Promise<TrainingAutomationConfig> => {
    try {
      // Try to get the configuration from Supabase
      const { data, error } = await supabase
        .from('training_automation_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching training automation config:', error);
        
        // Return default config if there's an error
        return {
          enabled: true,
          rules: [],
          documentChangesTrigger: true,
          newEmployeeTrigger: true,
          roleCangeTrigger: true,
        };
      }

      if (!data) {
        console.warn('No training configuration found, using default settings');
        // Return default config if no data is found
        return {
          enabled: true,
          rules: [],
          documentChangesTrigger: true,
          newEmployeeTrigger: true,
          roleCangeTrigger: true,
        };
      }

      // Map the database record to our TypeScript interface
      return {
        enabled: data.enabled,
        rules: data.rules || [],
        documentChangesTrigger: data.document_changes_trigger,
        newEmployeeTrigger: data.new_employee_trigger,
        roleCangeTrigger: data.role_change_trigger,
      };
    } catch (error) {
      console.error('Exception fetching training automation config:', error);
      
      // Return default config if there's an exception
      return {
        enabled: true,
        rules: [],
        documentChangesTrigger: true,
        newEmployeeTrigger: true,
        roleCangeTrigger: true,
      };
    }
  },
  
  /**
   * Update the automation settings for the organization
   */
  updateAutomationConfig: async (config: TrainingAutomationConfig): Promise<boolean> => {
    try {
      // Create a database record from our TypeScript interface
      const record = {
        enabled: config.enabled,
        rules: config.rules || [],
        document_changes_trigger: config.documentChangesTrigger,
        new_employee_trigger: config.newEmployeeTrigger,
        role_change_trigger: config.roleCangeTrigger,
        updated_at: new Date().toISOString()
      };

      // Check if a record already exists
      const { data: existingConfig } = await supabase
        .from('training_automation_config')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);

      let result;

      if (existingConfig && existingConfig.length > 0) {
        // Update existing record
        result = await supabase
          .from('training_automation_config')
          .update(record)
          .eq('id', existingConfig[0].id);
      } else {
        // Insert new record
        result = await supabase
          .from('training_automation_config')
          .insert(record);
      }

      if (result.error) {
        console.error('Error updating training automation config:', result.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception updating training automation config:', error);
      return false;
    }
  }
};

export default trainingConfigService;
