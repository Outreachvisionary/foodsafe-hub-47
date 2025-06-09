
import { supabase } from '@/integrations/supabase/client';

export interface TrainingAutomationConfig {
  id: string;
  enabled: boolean;
  rules: Record<string, any>;
  document_changes_trigger: boolean;
  new_employee_trigger: boolean;
  role_change_trigger: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const getAutomationConfig = async (): Promise<TrainingAutomationConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('training_automation_config')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;

    return {
      id: data.id,
      enabled: data.enabled,
      rules: typeof data.rules === 'object' && data.rules !== null 
        ? data.rules as Record<string, any>
        : {},
      document_changes_trigger: data.document_changes_trigger,
      new_employee_trigger: data.new_employee_trigger,
      role_change_trigger: data.role_change_trigger,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by
    };
  } catch (error) {
    console.error('Error fetching automation config:', error);
    return null;
  }
};

export const updateAutomationConfig = async (
  id: string,
  updates: Partial<TrainingAutomationConfig>
): Promise<TrainingAutomationConfig> => {
  try {
    const { data, error } = await supabase
      .from('training_automation_config')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      enabled: data.enabled,
      rules: typeof data.rules === 'object' && data.rules !== null 
        ? data.rules as Record<string, any>
        : {},
      document_changes_trigger: data.document_changes_trigger,
      new_employee_trigger: data.new_employee_trigger,
      role_change_trigger: data.role_change_trigger,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by
    };
  } catch (error) {
    console.error('Error updating automation config:', error);
    throw error;
  }
};

export default {
  getAutomationConfig,
  updateAutomationConfig
};
