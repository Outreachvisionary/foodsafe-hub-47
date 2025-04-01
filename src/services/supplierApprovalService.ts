
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
  approvers?: string[];
  approvalHistory?: Record<string, any>;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

// Fetch supplier approval workflow
export const fetchSupplierApprovalWorkflow = async (supplierId: string): Promise<ApprovalWorkflow | null> => {
  const { data, error } = await supabase
    .from('supplier_approval_workflows')
    .select('*')
    .eq('supplier_id', supplierId)
    .maybeSingle();
  
  if (error) {
    console.error(`Error fetching approval workflow for supplier ${supplierId}:`, error);
    throw new Error('Failed to fetch supplier approval workflow');
  }
  
  if (!data) {
    return null;
  }
  
  return {
    id: data.id,
    supplierId: data.supplier_id,
    status: data.status,
    initiatedBy: data.initiated_by,
    initiatedAt: data.initiated_at,
    currentStep: data.current_step,
    approvers: data.approvers,
    approvalHistory: data.approval_history,
    dueDate: data.due_date,
    completedAt: data.completed_at,
    notes: data.notes
  };
};

// Create a new approval workflow
export const createApprovalWorkflow = async (workflow: Omit<ApprovalWorkflow, 'id'>): Promise<ApprovalWorkflow> => {
  const id = uuidv4();
  
  const { data, error } = await supabase
    .from('supplier_approval_workflows')
    .insert({
      id,
      supplier_id: workflow.supplierId,
      status: workflow.status,
      initiated_by: workflow.initiatedBy,
      initiated_at: workflow.initiatedAt || new Date().toISOString(),
      current_step: workflow.currentStep || 1,
      approvers: workflow.approvers,
      approval_history: workflow.approvalHistory || {},
      due_date: workflow.dueDate,
      completed_at: workflow.completedAt,
      notes: workflow.notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating approval workflow:', error);
    throw new Error('Failed to create approval workflow');
  }
  
  return {
    id: data.id,
    supplierId: data.supplier_id,
    status: data.status,
    initiatedBy: data.initiated_by,
    initiatedAt: data.initiated_at,
    currentStep: data.current_step,
    approvers: data.approvers,
    approvalHistory: data.approval_history,
    dueDate: data.due_date,
    completedAt: data.completed_at,
    notes: data.notes
  };
};

// Update an approval workflow
export const updateApprovalWorkflow = async (id: string, updates: Partial<ApprovalWorkflow>): Promise<void> => {
  const { error } = await supabase
    .from('supplier_approval_workflows')
    .update({
      status: updates.status,
      current_step: updates.currentStep,
      approvers: updates.approvers,
      approval_history: updates.approvalHistory,
      due_date: updates.dueDate,
      completed_at: updates.completedAt,
      notes: updates.notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating approval workflow ${id}:`, error);
    throw new Error('Failed to update approval workflow');
  }
};

// Fetch all approval workflows
export const fetchAllApprovalWorkflows = async (): Promise<ApprovalWorkflow[]> => {
  const { data, error } = await supabase
    .from('supplier_approval_workflows')
    .select(`
      *,
      suppliers (
        name
      )
    `)
    .order('initiated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching approval workflows:', error);
    throw new Error('Failed to fetch approval workflows');
  }
  
  return data.map(workflow => ({
    id: workflow.id,
    supplierId: workflow.supplier_id,
    status: workflow.status,
    initiatedBy: workflow.initiated_by,
    initiatedAt: workflow.initiated_at,
    currentStep: workflow.current_step,
    approvers: workflow.approvers,
    approvalHistory: workflow.approval_history,
    dueDate: workflow.due_date,
    completedAt: workflow.completed_at,
    notes: workflow.notes,
    supplierName: workflow.suppliers?.name
  }));
};

// Get pending approval count
export const getPendingApprovalCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('supplier_approval_workflows')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Pending Approval');
  
  if (error) {
    console.error('Error fetching pending approval count:', error);
    throw new Error('Failed to fetch pending approval count');
  }
  
  return count || 0;
};

// Advance an approval workflow to the next step
export const advanceWorkflow = async (workflowId: string, nextStatus: string, notes?: string): Promise<void> => {
  const { data: workflow, error: fetchError } = await supabase
    .from('supplier_approval_workflows')
    .select('current_step, supplier_id, approval_history')
    .eq('id', workflowId)
    .single();
  
  if (fetchError) {
    console.error(`Error fetching approval workflow ${workflowId}:`, fetchError);
    throw new Error('Failed to fetch approval workflow');
  }
  
  const nextStep = workflow.current_step + 1;
  const approvalHistory = workflow.approval_history || {};
  approvalHistory[`step_${workflow.current_step}`] = {
    completedAt: new Date().toISOString(),
    notes: notes
  };
  
  // Update workflow
  const { error: updateError } = await supabase
    .from('supplier_approval_workflows')
    .update({
      status: nextStatus,
      current_step: nextStep,
      approval_history: approvalHistory,
      updated_at: new Date().toISOString()
    })
    .eq('id', workflowId);
  
  if (updateError) {
    console.error(`Error updating approval workflow ${workflowId}:`, updateError);
    throw new Error('Failed to update approval workflow');
  }
  
  // If approving or rejecting the supplier, also update the supplier status
  if (nextStatus === 'Approved' || nextStatus === 'Rejected') {
    const supplierStatus = nextStatus === 'Approved' ? 'Active' : 'Inactive';
    
    const { error: supplierError } = await supabase
      .from('suppliers')
      .update({
        status: supplierStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflow.supplier_id);
    
    if (supplierError) {
      console.error(`Error updating supplier ${workflow.supplier_id}:`, supplierError);
      throw new Error('Failed to update supplier status');
    }
  }
};

// Export all functions
export default {
  fetchSupplierApprovalWorkflow,
  createApprovalWorkflow,
  updateApprovalWorkflow,
  fetchAllApprovalWorkflows,
  getPendingApprovalCount,
  advanceWorkflow
};
