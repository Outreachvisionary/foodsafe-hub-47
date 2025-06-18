
import { supabase } from '@/integrations/supabase/client';
import { CAPAStatus } from '@/types/enums';
import { toast } from 'sonner';
import { getWorkflowConfig, generateWorkflowSteps, WorkflowConfig, WorkflowStep } from './workflowConfigService';
import { advanceWorkflow, updateCAPAStatusBasedOnWorkflow } from './workflowOperationsService';
import { checkOverdueCAPAs, autoAssignCAPA } from './workflowAutomationService';

// Initiate CAPA workflow
export const initiateWorkflow = async (capaId: string): Promise<void> => {
  try {
    const { data: capa, error } = await supabase
      .from('capa_actions')
      .select('*')
      .eq('id', capaId)
      .single();

    if (error) throw error;

    const config = getWorkflowConfig(capa.priority, capa.source);
    
    // Create workflow steps
    const steps = generateWorkflowSteps(capa, config);
    
    // Store workflow in metadata
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capaId,
        action_type: 'workflow_initiated',
        action_description: 'Workflow initiated with automated steps',
        performed_by: capa.created_by,
        metadata: { steps: steps, config: config }
      });

    // Update CAPA status to In Progress if it was Open
    if (capa.status === CAPAStatus.Open) {
      await supabase
        .from('capa_actions')
        .update({ status: 'In Progress' })
        .eq('id', capaId);
    }

    toast.success('CAPA workflow initiated successfully');
  } catch (error) {
    console.error('Error initiating workflow:', error);
    toast.error('Failed to initiate workflow');
    throw error;
  }
};

// Re-export functions for backward compatibility
export {
  getWorkflowConfig,
  generateWorkflowSteps,
  advanceWorkflow,
  updateCAPAStatusBasedOnWorkflow,
  checkOverdueCAPAs,
  autoAssignCAPA,
  type WorkflowConfig,
  type WorkflowStep
};
