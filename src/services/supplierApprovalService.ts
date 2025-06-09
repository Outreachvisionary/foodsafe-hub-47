
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ApprovalWorkflow {
  id: string;
  supplier_id: string;
  status: string;
  current_step: number;
  initiated_at: string;
  completed_at?: string;
  initiated_by: string;
  approvers?: string[];
  approval_history?: Record<string, any>;
  notes?: string;
  due_date?: string;
  updated_at?: string;
}

// Fetch all approval workflows
export const fetchApprovalWorkflows = async (): Promise<ApprovalWorkflow[]> => {
  try {
    const { data, error } = await supabase
      .from('supplier_approval_workflows')
      .select(`
        *,
        suppliers (name, category, country)
      `)
      .order('initiated_at', { ascending: false });
      
    if (error) throw error;
    
    // Convert Json type to Record<string, any> for approval_history
    return (data || []).map(item => ({
      ...item,
      approval_history: typeof item.approval_history === 'object' && item.approval_history !== null 
        ? item.approval_history as Record<string, any>
        : {}
    })) as ApprovalWorkflow[];
  } catch (error) {
    console.error('Error fetching approval workflows:', error);
    toast.error('Failed to load approval workflows');
    throw error;
  }
};

// Fetch a single approval workflow by ID
export const fetchApprovalWorkflowById = async (id: string): Promise<ApprovalWorkflow | null> => {
  try {
    const { data, error } = await supabase
      .from('supplier_approval_workflows')
      .select(`
        *,
        suppliers (*)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Convert Json type to Record<string, any> for approval_history
    return {
      ...data,
      approval_history: typeof data.approval_history === 'object' && data.approval_history !== null 
        ? data.approval_history as Record<string, any>
        : {}
    };
  } catch (error) {
    console.error(`Error fetching approval workflow with ID ${id}:`, error);
    toast.error('Failed to load approval workflow details');
    throw error;
  }
};

// Create a new approval workflow
export const createApprovalWorkflow = async (
  supplierId: string, 
  initiatedBy: string, 
  approvers: string[], 
  dueDate?: string
): Promise<ApprovalWorkflow> => {
  try {
    // Check if there's already an active workflow for this supplier
    const { data: existing } = await supabase
      .from('supplier_approval_workflows')
      .select('id, status')
      .eq('supplier_id', supplierId)
      .in('status', ['in_progress', 'pending']);
    
    if (existing && existing.length > 0) {
      toast.error('There is already an active approval workflow for this supplier');
      throw new Error('Duplicate workflow');
    }
    
    // Create the approval workflow
    const { data, error } = await supabase
      .from('supplier_approval_workflows')
      .insert({
        supplier_id: supplierId,
        status: 'in_progress',
        current_step: 1,
        initiated_by: initiatedBy,
        initiated_at: new Date().toISOString(),
        approvers,
        approval_history: {
          steps: [
            { 
              step: 1, 
              name: 'Document Review', 
              status: 'current',
              started_at: new Date().toISOString()
            },
            { 
              step: 2, 
              name: 'Compliance Verification', 
              status: 'pending'
            },
            { 
              step: 3, 
              name: 'Quality Evaluation', 
              status: 'pending'
            },
            { 
              step: 4, 
              name: 'Final Approval', 
              status: 'pending'
            }
          ]
        },
        due_date: dueDate,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Update the supplier status to reflect approval in progress
    await supabase
      .from('suppliers')
      .update({
        status: 'Pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', supplierId);
    
    return {
      ...data,
      approval_history: typeof data.approval_history === 'object' && data.approval_history !== null 
        ? data.approval_history as Record<string, any>
        : {}
    };
  } catch (error) {
    if (error.message !== 'Duplicate workflow') {
      console.error('Error creating approval workflow:', error);
      toast.error('Failed to create approval workflow');
    }
    throw error;
  }
};

// Advance the approval workflow to the next step
export const advanceWorkflowStep = async (
  workflowId: string, 
  approver: string, 
  notes?: string
): Promise<ApprovalWorkflow> => {
  try {
    // Get the current workflow state
    const { data: workflow, error: fetchError } = await supabase
      .from('supplier_approval_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentStep = workflow.current_step;
    const approvalHistory = (typeof workflow.approval_history === 'object' && workflow.approval_history !== null 
      ? workflow.approval_history as Record<string, any>
      : { steps: [] });
    
    // Update the current step to completed
    const updatedSteps = (approvalHistory.steps || []).map((step: any) => {
      if (step.step === currentStep) {
        return {
          ...step,
          status: 'completed',
          completed_at: new Date().toISOString(),
          approved_by: approver,
          notes: notes
        };
      } else if (step.step === currentStep + 1) {
        return {
          ...step,
          status: 'current',
          started_at: new Date().toISOString()
        };
      }
      return step;
    });
    
    // Determine if this was the final step
    const isLastStep = !(approvalHistory.steps || []).some((step: any) => step.step === currentStep + 1);
    const newStatus = isLastStep ? 'approved' : 'in_progress';
    
    // Update the workflow
    const { data, error } = await supabase
      .from('supplier_approval_workflows')
      .update({
        current_step: isLastStep ? currentStep : currentStep + 1,
        status: newStatus,
        approval_history: { ...approvalHistory, steps: updatedSteps },
        updated_at: new Date().toISOString(),
        completed_at: isLastStep ? new Date().toISOString() : null
      })
      .eq('id', workflowId)
      .select()
      .single();
      
    if (error) throw error;
    
    // If this was the final step, update the supplier status
    if (isLastStep) {
      await supabase
        .from('suppliers')
        .update({
          status: 'Active',
          compliance_status: 'Approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', workflow.supplier_id);
    }
    
    return {
      ...data,
      approval_history: typeof data.approval_history === 'object' && data.approval_history !== null 
        ? data.approval_history as Record<string, any>
        : {}
    };
  } catch (error) {
    console.error(`Error advancing workflow with ID ${workflowId}:`, error);
    toast.error('Failed to advance approval workflow');
    throw error;
  }
};

// Reject the approval workflow
export const rejectWorkflow = async (
  workflowId: string, 
  rejectedBy: string, 
  reason: string
): Promise<ApprovalWorkflow> => {
  try {
    // Get the current workflow state
    const { data: workflow, error: fetchError } = await supabase
      .from('supplier_approval_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentStep = workflow.current_step;
    const approvalHistory = (typeof workflow.approval_history === 'object' && workflow.approval_history !== null 
      ? workflow.approval_history as Record<string, any>
      : { steps: [] });
    
    // Update the current step to rejected
    const updatedSteps = (approvalHistory.steps || []).map((step: any) => {
      if (step.step === currentStep) {
        return {
          ...step,
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejected_by: rejectedBy,
          rejection_reason: reason
        };
      }
      return step;
    });
    
    // Update the workflow
    const { data, error } = await supabase
      .from('supplier_approval_workflows')
      .update({
        status: 'rejected',
        approval_history: { ...approvalHistory, steps: updatedSteps },
        updated_at: new Date().toISOString(),
        notes: `Rejected in step ${currentStep}: ${reason}`
      })
      .eq('id', workflowId)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update the supplier status
    await supabase
      .from('suppliers')
      .update({
        status: 'Suspended',
        compliance_status: 'Rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', workflow.supplier_id);
    
    return {
      ...data,
      approval_history: typeof data.approval_history === 'object' && data.approval_history !== null 
        ? data.approval_history as Record<string, any>
        : {}
    };
  } catch (error) {
    console.error(`Error rejecting workflow with ID ${workflowId}:`, error);
    toast.error('Failed to reject approval workflow');
    throw error;
  }
};

// Edit the workflow step (move back to a previous step)
export const editWorkflowStep = async (
  workflowId: string,
  newStep: number,
  reason: string,
  updatedBy: string
): Promise<ApprovalWorkflow> => {
  try {
    // Get the current workflow state
    const { data: workflow, error: fetchError } = await supabase
      .from('supplier_approval_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentStep = workflow.current_step;
    
    // Don't allow moving forward through this function (use the advance function for that)
    if (newStep > currentStep) {
      throw new Error('Cannot advance steps through the edit function');
    }
    
    // Don't allow editing completed or rejected workflows
    if (workflow.status === 'approved' || workflow.status === 'rejected') {
      throw new Error('Cannot edit completed or rejected workflows');
    }
    
    const approvalHistory = (typeof workflow.approval_history === 'object' && workflow.approval_history !== null 
      ? workflow.approval_history as Record<string, any>
      : { steps: [] });
    
    // Update step statuses
    const updatedSteps = (approvalHistory.steps || []).map((step: any) => {
      if (step.step === currentStep) {
        // Current step becomes pending
        return {
          ...step,
          status: 'pending',
          started_at: null
        };
      } else if (step.step === newStep) {
        // New step becomes current
        return {
          ...step,
          status: 'current',
          started_at: new Date().toISOString(),
          // If this step was previously completed, add a note
          notes: step.status === 'completed' ? 
            `${step.notes || ''}\n\nStep reactivated on ${new Date().toLocaleDateString()}: ${reason}` : 
            `Step activated on ${new Date().toLocaleDateString()}: ${reason}`
        };
      } else if (step.step > newStep && step.step < currentStep) {
        // Steps in between new and current reset to pending
        return {
          ...step,
          status: 'pending',
          started_at: null,
          completed_at: null
        };
      }
      return step;
    });
    
    // Add an edit history entry
    const editHistory = approvalHistory.edits || [];
    editHistory.push({
      timestamp: new Date().toISOString(),
      edited_by: updatedBy,
      previous_step: currentStep,
      new_step: newStep,
      reason: reason
    });
    
    // Update the workflow
    const { data, error } = await supabase
      .from('supplier_approval_workflows')
      .update({
        current_step: newStep,
        status: 'in_progress',
        approval_history: { 
          ...approvalHistory, 
          steps: updatedSteps,
          edits: editHistory
        },
        updated_at: new Date().toISOString(),
        notes: `${workflow.notes || ''}\n\nWorkflow edited on ${new Date().toLocaleDateString()}: moved from step ${currentStep} to step ${newStep}. Reason: ${reason}`
      })
      .eq('id', workflowId)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      approval_history: typeof data.approval_history === 'object' && data.approval_history !== null 
        ? data.approval_history as Record<string, any>
        : {}
    };
  } catch (error) {
    console.error(`Error editing workflow step for workflow ID ${workflowId}:`, error);
    toast.error(error.message || 'Failed to edit approval workflow step');
    throw error;
  }
};

export default {
  fetchApprovalWorkflows,
  fetchApprovalWorkflowById,
  createApprovalWorkflow,
  advanceWorkflowStep,
  rejectWorkflow,
  editWorkflowStep
};
