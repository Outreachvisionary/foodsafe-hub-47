
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkflowStep {
  id: string;
  capa_id: string;
  step_name: string;
  step_order: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  assigned_to: string;
  description: string;
  completed_at?: string;
  completed_by?: string;
  comments?: string;
  created_at: string;
}

export const getWorkflowSteps = async (capaId: string): Promise<WorkflowStep[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('capa_workflow_steps')
      .select('*')
      .eq('capa_id', capaId)
      .order('step_order', { ascending: true });

    if (error) throw error;
    
    // If no steps exist, initialize them
    if (!data || data.length === 0) {
      console.log('No workflow steps found, initializing...');
      await initializeWorkflowSteps(capaId, 'current-user');
      
      // Fetch the newly created steps
      const { data: newData, error: newError } = await (supabase as any)
        .from('capa_workflow_steps')
        .select('*')
        .eq('capa_id', capaId)
        .order('step_order', { ascending: true });
      
      if (newError) throw newError;
      return newData || [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching workflow steps:', error);
    return [];
  }
};

export const initializeWorkflowSteps = async (capaId: string, assignedTo: string): Promise<void> => {
  const defaultSteps = [
    {
      step_name: 'investigation',
      step_order: 1,
      assigned_to: assignedTo,
      description: 'Investigate and identify the root cause of the issue',
      status: 'pending'
    },
    {
      step_name: 'action_plan',
      step_order: 2,
      assigned_to: assignedTo,
      description: 'Define corrective and preventive actions',
      status: 'pending'
    },
    {
      step_name: 'approval',
      step_order: 3,
      assigned_to: 'Quality Manager',
      description: 'Review and approve the CAPA plan',
      status: 'pending'
    },
    {
      step_name: 'implementation',
      step_order: 4,
      assigned_to: assignedTo,
      description: 'Execute the approved corrective actions',
      status: 'pending'
    },
    {
      step_name: 'verification',
      step_order: 5,
      assigned_to: 'Quality Manager',
      description: 'Verify that actions were effective',
      status: 'pending'
    }
  ];

  try {
    const stepsToInsert = defaultSteps.map(step => ({
      capa_id: capaId,
      ...step
    }));

    const { error } = await (supabase as any)
      .from('capa_workflow_steps')
      .insert(stepsToInsert);

    if (error) throw error;
    console.log('Workflow steps initialized successfully');
  } catch (error) {
    console.error('Error initializing workflow steps:', error);
    throw error;
  }
};

export const updateWorkflowStep = async (
  stepId: string,
  status: 'approved' | 'rejected' | 'completed',
  comments: string,
  completedBy: string
): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('capa_workflow_steps')
      .update({
        status,
        comments,
        completed_by: completedBy,
        completed_at: new Date().toISOString()
      })
      .eq('id', stepId);

    if (error) throw error;

    // Log the activity
    const { data: step } = await (supabase as any)
      .from('capa_workflow_steps')
      .select('capa_id, step_name')
      .eq('id', stepId)
      .single();

    if (step) {
      await supabase
        .from('capa_activities')
        .insert({
          capa_id: step.capa_id,
          action_type: 'workflow_step_updated',
          action_description: `Workflow step "${step.step_name}" ${status}`,
          performed_by: completedBy,
          metadata: { stepId, status, comments }
        });
    }
  } catch (error) {
    console.error('Error updating workflow step:', error);
    throw error;
  }
};
