
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Interface for approval workflow
interface ApprovalWorkflow {
  id: string;
  supplierId: string;
  status: 'Initiated' | 'Document Review' | 'Risk Assessment' | 'Audit Scheduled' | 'Audit Completed' | 'Pending Approval' | 'Approved' | 'Rejected';
  initiatedBy: string;
  initiatedAt: string;
  currentStep: number;
  approvers: string[];
  approvalHistory: Record<string, any>;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  supplierName?: string;
}

// Fetch an approval workflow for a supplier
export const fetchApprovalWorkflow = async (supplierId: string): Promise<ApprovalWorkflow | null> => {
  const { data, error } = await supabase
    .from('supplier_approval_workflows')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('initiated_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No workflow found
      return null;
    }
    console.error(`Error fetching approval workflow for supplier ${supplierId}:`, error);
    throw new Error('Failed to fetch supplier approval workflow');
  }
  
  return {
    id: data.id,
    supplierId: data.supplier_id,
    status: data.status,
    initiatedBy: data.initiated_by,
    initiatedAt: data.initiated_at,
    currentStep: data.current_step,
    approvers: data.approvers || [],
    approvalHistory: data.approval_history || {},
    dueDate: data.due_date,
    completedAt: data.completed_at,
    notes: data.notes
  };
};

// Create a new approval workflow
export const createApprovalWorkflow = async (
  workflow: Omit<ApprovalWorkflow, 'id' | 'initiatedAt' | 'currentStep'>
): Promise<ApprovalWorkflow> => {
  const id = uuidv4();
  const initiatedAt = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('supplier_approval_workflows')
    .insert({
      id,
      supplier_id: workflow.supplierId,
      status: workflow.status || 'Initiated',
      initiated_by: workflow.initiatedBy,
      initiated_at: initiatedAt,
      current_step: 1,
      approvers: workflow.approvers || [],
      approval_history: workflow.approvalHistory || {},
      due_date: workflow.dueDate,
      notes: workflow.notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating approval workflow:', error);
    throw new Error('Failed to create approval workflow');
  }
  
  // Update the supplier status if needed
  if (workflow.status === 'Approved') {
    await supabase
      .from('suppliers')
      .update({ 
        status: 'Active',
        updated_at: new Date().toISOString()
      })
      .eq('id', workflow.supplierId);
  } else if (workflow.status === 'Rejected') {
    await supabase
      .from('suppliers')
      .update({ 
        status: 'Inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', workflow.supplierId);
  }
  
  return {
    id: data.id,
    supplierId: data.supplier_id,
    status: data.status,
    initiatedBy: data.initiated_by,
    initiatedAt: data.initiated_at,
    currentStep: data.current_step,
    approvers: data.approvers || [],
    approvalHistory: data.approval_history || {},
    dueDate: data.due_date,
    completedAt: data.completed_at,
    notes: data.notes
  };
};

// Update an approval workflow
export const updateApprovalWorkflow = async (
  workflowId: string,
  updates: Partial<ApprovalWorkflow>
): Promise<void> => {
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString()
  };
  
  if (updates.status) updateData.status = updates.status;
  if (updates.currentStep) updateData.current_step = updates.currentStep;
  if (updates.approvers) updateData.approvers = updates.approvers;
  if (updates.approvalHistory) updateData.approval_history = updates.approvalHistory;
  if (updates.dueDate) updateData.due_date = updates.dueDate;
  if (updates.notes) updateData.notes = updates.notes;
  
  if (updates.status === 'Approved' || updates.status === 'Rejected') {
    updateData.completed_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from('supplier_approval_workflows')
    .update(updateData)
    .eq('id', workflowId);
  
  if (error) {
    console.error(`Error updating approval workflow ${workflowId}:`, error);
    throw new Error('Failed to update approval workflow');
  }
  
  // If workflow is completed, update the supplier status
  if (updates.status === 'Approved' || updates.status === 'Rejected') {
    // First get the supplier ID
    const { data: workflow, error: fetchError } = await supabase
      .from('supplier_approval_workflows')
      .select('supplier_id')
      .eq('id', workflowId)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching supplier ID for workflow ${workflowId}:`, fetchError);
      return;
    }
    
    const newStatus = updates.status === 'Approved' ? 'Active' : 'Inactive';
    
    await supabase
      .from('suppliers')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflow.supplier_id);
  }
};

// Fetch all active approval workflows
export const fetchActiveWorkflows = async (): Promise<ApprovalWorkflow[]> => {
  const { data, error } = await supabase
    .from('supplier_approval_workflows')
    .select(`
      *,
      suppliers (name)
    `)
    .not('status', 'in', '("Approved", "Rejected")')
    .order('initiated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching active approval workflows:', error);
    throw new Error('Failed to fetch active approval workflows');
  }
  
  return data.map(workflow => ({
    id: workflow.id,
    supplierId: workflow.supplier_id,
    status: workflow.status,
    initiatedBy: workflow.initiated_by,
    initiatedAt: workflow.initiated_at,
    currentStep: workflow.current_step,
    approvers: workflow.approvers || [],
    approvalHistory: workflow.approval_history || {},
    dueDate: workflow.due_date,
    completedAt: workflow.completed_at,
    notes: workflow.notes,
    supplierName: workflow.suppliers?.name
  }));
};

// Add an approval action to the workflow history
export const addApprovalAction = async (
  workflowId: string,
  action: {
    user: string;
    action: 'approve' | 'reject' | 'comment';
    step: number;
    notes?: string;
    timestamp?: string;
  }
): Promise<void> => {
  // First get the current workflow
  const { data: workflow, error: fetchError } = await supabase
    .from('supplier_approval_workflows')
    .select('approval_history')
    .eq('id', workflowId)
    .single();
  
  if (fetchError) {
    console.error(`Error fetching workflow ${workflowId} for action:`, fetchError);
    throw new Error('Failed to fetch workflow for action');
  }
  
  // Update the approval history
  const history = workflow.approval_history || {};
  const timestamp = action.timestamp || new Date().toISOString();
  const actionId = uuidv4();
  
  history[actionId] = {
    user: action.user,
    action: action.action,
    step: action.step,
    notes: action.notes,
    timestamp
  };
  
  // Determine new status based on action
  let newStatus;
  let nextStep;
  
  if (action.action === 'approve') {
    if (action.step === 1) newStatus = 'Document Review';
    else if (action.step === 2) newStatus = 'Risk Assessment';
    else if (action.step === 3) newStatus = 'Audit Scheduled';
    else if (action.step === 4) newStatus = 'Audit Completed';
    else if (action.step === 5) newStatus = 'Pending Approval';
    else if (action.step === 6) newStatus = 'Approved';
    
    nextStep = action.step + 1;
  } else if (action.action === 'reject') {
    newStatus = 'Rejected';
    nextStep = action.step; // Keep the same step
  }
  
  // Update the workflow
  const updateData: Record<string, any> = {
    approval_history: history,
    updated_at: new Date().toISOString()
  };
  
  if (newStatus) updateData.status = newStatus;
  if (nextStep) updateData.current_step = nextStep;
  if (newStatus === 'Approved' || newStatus === 'Rejected') {
    updateData.completed_at = timestamp;
  }
  
  const { error } = await supabase
    .from('supplier_approval_workflows')
    .update(updateData)
    .eq('id', workflowId);
  
  if (error) {
    console.error(`Error updating workflow ${workflowId} with action:`, error);
    throw new Error('Failed to update workflow with action');
  }
  
  // If workflow is completed, update the supplier status
  if (newStatus === 'Approved' || newStatus === 'Rejected') {
    const { data: workflowData } = await supabase
      .from('supplier_approval_workflows')
      .select('supplier_id')
      .eq('id', workflowId)
      .single();
    
    const newSupplierStatus = newStatus === 'Approved' ? 'Active' : 'Inactive';
    
    await supabase
      .from('suppliers')
      .update({ 
        status: newSupplierStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowData.supplier_id);
  }
};

// Export all functions
export default {
  fetchApprovalWorkflow,
  createApprovalWorkflow,
  updateApprovalWorkflow,
  fetchActiveWorkflows,
  addApprovalAction
};
