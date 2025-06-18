
import { supabase } from '@/integrations/supabase/client';
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';
import { toast } from 'sonner';

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  comments?: string;
  required: boolean;
  [key: string]: any; // Index signature for Json compatibility
}

export interface WorkflowConfig {
  requiresApproval: boolean;
  approvers: string[];
  autoAdvance: boolean;
  deadlines: Record<string, number>; // days
  [key: string]: any; // Index signature for Json compatibility
}

// Get workflow configuration based on CAPA priority and source
export const getWorkflowConfig = (priority: string, source: string): WorkflowConfig => {
  const configs: Record<string, WorkflowConfig> = {
    'Critical': {
      requiresApproval: true,
      approvers: ['Quality Manager', 'Food Safety Director', 'Operations Manager'],
      autoAdvance: false,
      deadlines: { investigation: 3, implementation: 7, verification: 5 }
    },
    'High': {
      requiresApproval: true,
      approvers: ['Quality Manager', 'Department Head'],
      autoAdvance: false,
      deadlines: { investigation: 5, implementation: 14, verification: 7 }
    },
    'Medium': {
      requiresApproval: true,
      approvers: ['Quality Manager'],
      autoAdvance: true,
      deadlines: { investigation: 7, implementation: 21, verification: 10 }
    },
    'Low': {
      requiresApproval: false,
      approvers: [],
      autoAdvance: true,
      deadlines: { investigation: 10, implementation: 30, verification: 14 }
    }
  };
  
  return configs[priority] || configs['Medium'];
};

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

// Generate workflow steps based on CAPA and config
const generateWorkflowSteps = (capa: any, config: WorkflowConfig): WorkflowStep[] => {
  const steps: WorkflowStep[] = [];
  
  // Investigation step
  steps.push({
    id: 'investigation',
    name: 'Root Cause Investigation',
    status: 'pending',
    assignedTo: capa.assigned_to,
    dueDate: new Date(Date.now() + config.deadlines.investigation * 24 * 60 * 60 * 1000).toISOString(),
    required: true
  });

  // Approval steps if required
  if (config.requiresApproval) {
    config.approvers.forEach((approver, index) => {
      steps.push({
        id: `approval_${index}`,
        name: `${approver} Approval`,
        status: 'pending',
        assignedTo: approver,
        dueDate: new Date(Date.now() + (config.deadlines.investigation + 2) * 24 * 60 * 60 * 1000).toISOString(),
        required: true
      });
    });
  }

  // Implementation step
  steps.push({
    id: 'implementation',
    name: 'Action Implementation',
    status: 'pending',
    assignedTo: capa.assigned_to,
    dueDate: new Date(Date.now() + config.deadlines.implementation * 24 * 60 * 60 * 1000).toISOString(),
    required: true
  });

  // Verification step
  steps.push({
    id: 'verification',
    name: 'Effectiveness Verification',
    status: 'pending',
    assignedTo: 'Quality Manager',
    dueDate: new Date(Date.now() + (config.deadlines.implementation + config.deadlines.verification) * 24 * 60 * 60 * 1000).toISOString(),
    required: true
  });

  return steps;
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

// Update CAPA status based on workflow progress
const updateCAPAStatusBasedOnWorkflow = async (capaId: string): Promise<void> => {
  // This would typically check all workflow steps and determine
  // the appropriate CAPA status based on completion
  
  const { data: activities } = await supabase
    .from('capa_activities')
    .select('*')
    .eq('capa_id', capaId)
    .order('performed_at', { ascending: false });

  // Logic to determine new status based on workflow progress
  // This is a simplified version - real implementation would be more complex
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

// Check for overdue CAPAs and send notifications
export const checkOverdueCAPAs = async (): Promise<void> => {
  try {
    const { data: overdueCAPAs } = await supabase
      .from('capa_actions')
      .select('*')
      .lt('due_date', new Date().toISOString())
      .in('status', ['Open', 'In Progress']);

    for (const capa of overdueCAPAs || []) {
      // Update status to overdue
      await supabase
        .from('capa_actions')
        .update({ status: 'Overdue' })
        .eq('id', capa.id);

      // Create notification activity
      await supabase
        .from('capa_activities')
        .insert({
          capa_id: capa.id,
          action_type: 'overdue_notification',
          action_description: 'CAPA is now overdue',
          performed_by: 'System',
          metadata: { originalDueDate: capa.due_date }
        });
    }
  } catch (error) {
    console.error('Error checking overdue CAPAs:', error);
  }
};

// Auto-assign CAPAs based on rules
export const autoAssignCAPA = async (capa: CAPA): Promise<string> => {
  const assignmentRules: Record<string, string> = {
    'Contamination': 'Food Safety Manager',
    'Equipment Malfunction': 'Maintenance Manager',
    'Documentation Error': 'Quality Manager',
    'Process Deviation': 'Operations Manager',
    'Regulatory Non-Compliance': 'Compliance Manager'
  };

  // Determine assignee based on source or reason
  const assignee = assignmentRules[capa.source] || 'Quality Manager';
  
  return assignee;
};
