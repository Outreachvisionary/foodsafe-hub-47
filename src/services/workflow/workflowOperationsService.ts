
import { supabase } from '@/integrations/supabase/client';
import { CAPAStatus } from '@/types/enums';
import { toast } from 'sonner';

// Update CAPA status based on workflow progress
export const updateCAPAStatusBasedOnWorkflow = async (capaId: string): Promise<void> => {
  const { data: activities } = await supabase
    .from('capa_activities')
    .select('*')
    .eq('capa_id', capaId)
    .order('performed_at', { ascending: false });

  // Logic to determine new status based on workflow progress
  const completedSteps = activities?.filter(a => a.action_type === 'workflow_step_completed') || [];
  
  let newStatus: "Open" | "In Progress" | "Closed" | "Overdue" | "Pending Verification" = 'In Progress';
  if (completedSteps.length >= 4) { // All steps completed
    newStatus = 'Pending Verification';
  }

  await supabase
    .from('capa_actions')
    .update({ status: newStatus })
    .eq('id', capaId);
};

// Advance workflow to next step
export const advanceWorkflow = async (capaId: string, stepId: string, action: 'approve' | 'reject', comments?: string): Promise<void> => {
  try {
    // Record the action
    await supabase
      .from('capa_activities')
      .insert({
        capa_id: capaId,
        action_type: 'workflow_step_completed',
        action_description: `Step ${stepId} ${action}ed`,
        performed_by: 'Current User', // Should be actual user
        metadata: { stepId, action, comments }
      });

    // Update CAPA status based on workflow progress
    await updateCAPAStatusBasedOnWorkflow(capaId);

    toast.success(`Workflow step ${action}ed successfully`);
  } catch (error) {
    console.error('Error advancing workflow:', error);
    toast.error('Failed to advance workflow');
    throw error;
  }
};
