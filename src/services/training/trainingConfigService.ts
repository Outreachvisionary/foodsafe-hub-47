
import { supabase } from '@/integrations/supabase/client';
import { TrainingAutomationConfig } from '@/types/training';

const trainingConfigService = {
  /**
   * Get automation configuration
   */
  getAutomationConfig: async (): Promise<TrainingAutomationConfig | null> => {
    try {
      const { data, error } = await supabase
        .from('training_automation_config')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No config found, create default
          return await trainingConfigService.updateAutomationConfig({
            enabled: true,
            rules: [],
            documentChangesTrigger: true,
            newEmployeeTrigger: true,
            roleCangeTrigger: true
          });
        }
        throw error;
      }
      
      return data as TrainingAutomationConfig;
    } catch (error) {
      console.error('Error getting training automation config:', error);
      return null;
    }
  },
  
  /**
   * Update automation configuration
   */
  updateAutomationConfig: async (config: Partial<TrainingAutomationConfig>): Promise<TrainingAutomationConfig | null> => {
    try {
      // Check if config exists
      const { data: existingConfig, error: checkError } = await supabase
        .from('training_automation_config')
        .select('id')
        .limit(1)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      let result;
      
      if (existingConfig) {
        // Update existing config
        const { data, error } = await supabase
          .from('training_automation_config')
          .update(config)
          .eq('id', existingConfig.id)
          .select('*')
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new config
        const { data, error } = await supabase
          .from('training_automation_config')
          .insert(config)
          .select('*')
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result as TrainingAutomationConfig;
    } catch (error) {
      console.error('Error updating training automation config:', error);
      return null;
    }
  },
};

export default trainingConfigService;
