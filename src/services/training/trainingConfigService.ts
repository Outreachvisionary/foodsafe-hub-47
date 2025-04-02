
import { supabase } from '@/integrations/supabase/client';
import { TrainingAutomationConfig } from '@/types/training';

/**
 * Service for managing training automation configuration
 */
const trainingConfigService = {
  /**
   * Get the current training automation configuration
   * @returns The current configuration
   */
  getAutomationConfig: async (): Promise<TrainingAutomationConfig | null> => {
    try {
      const { data, error } = await supabase
        .from('training_automation_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching training automation config:', error);
        return null;
      }
      
      return data as TrainingAutomationConfig || null;
    } catch (error) {
      console.error('Error in getAutomationConfig:', error);
      return null;
    }
  },
  
  /**
   * Update the training automation configuration
   * @param config The new configuration
   * @returns Boolean indicating success
   */
  updateAutomationConfig: async (config: Partial<TrainingAutomationConfig>): Promise<boolean> => {
    try {
      // Check if a config exists
      const { data: existingConfig, error: checkError } = await supabase
        .from('training_automation_config')
        .select('id')
        .limit(1);
        
      if (checkError) {
        console.error('Error checking existing config:', checkError);
        return false;
      }
      
      if (existingConfig && existingConfig.length > 0) {
        // Update existing config
        const { error } = await supabase
          .from('training_automation_config')
          .update(config)
          .eq('id', existingConfig[0].id);
          
        if (error) {
          console.error('Error updating training automation config:', error);
          return false;
        }
      } else {
        // Create new config
        const { error } = await supabase
          .from('training_automation_config')
          .insert({
            ...config,
            enabled: config.enabled ?? true,
            new_employee_trigger: config.new_employee_trigger ?? true,
            role_change_trigger: config.role_change_trigger ?? true,
            document_changes_trigger: config.document_changes_trigger ?? true
          });
          
        if (error) {
          console.error('Error creating training automation config:', error);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateAutomationConfig:', error);
      return false;
    }
  },
  
  /**
   * Get document categories from document_category_types table
   */
  getDocumentCategories: async (): Promise<{id: number, name: string, description: string}[]> => {
    try {
      const { data, error } = await supabase
        .from('document_category_types')
        .select('id, name, description')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
        
      if (error) {
        console.error('Error fetching document categories:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getDocumentCategories:', error);
      return [];
    }
  },
  
  /**
   * Get document status types from document_status_types table
   */
  getDocumentStatusTypes: async (): Promise<{id: number, name: string, description: string}[]> => {
    try {
      const { data, error } = await supabase
        .from('document_status_types')
        .select('id, name, description')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
        
      if (error) {
        console.error('Error fetching document status types:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getDocumentStatusTypes:', error);
      return [];
    }
  },
  
  /**
   * Set up a training requirement for a document category
   * @param documentCategoryId The document category ID
   * @param trainingSessionIds Array of training session IDs to require
   * @returns Boolean indicating success
   */
  setDocumentCategoryTrainingRequirements: async (
    documentCategoryId: number, 
    trainingSessionIds: string[]
  ): Promise<boolean> => {
    try {
      // First get the document category details
      const { data: category, error: catError } = await supabase
        .from('document_category_types')
        .select('name')
        .eq('id', documentCategoryId)
        .single();
        
      if (catError || !category) {
        console.error('Error fetching document category:', catError);
        return false;
      }
      
      // Update relevant training sessions to link to this category
      const { error: updateError } = await supabase
        .from('training_sessions')
        .update({ training_category: category.name })
        .in('id', trainingSessionIds);
        
      if (updateError) {
        console.error('Error updating training sessions:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in setDocumentCategoryTrainingRequirements:', error);
      return false;
    }
  }
};

export default trainingConfigService;
