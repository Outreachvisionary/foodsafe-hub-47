
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ClipboardList, 
  FileCheck, 
  FilePenLine, 
  ClipboardCheck, 
  AlertOctagon,
  Plus 
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Supplier } from '@/types/supplier';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ApprovalWorkflow {
  id: string;
  supplier_id: string;
  status: string;
  current_step: number;
  initiated_at: string;
  initiated_by: string;
  notes?: string;
  due_date?: string;
}

const SupplierApproval: React.FC = () => {
  const { suppliers } = useSuppliers();
  const [approvalWorkflows, setApprovalWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    fetchApprovalWorkflows();
  }, []);

  const fetchApprovalWorkflows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('supplier_approval_workflows')
        .select(`
          *,
          suppliers(name)
        `)
        .order('initiated_at', { ascending: false });

      if (error) throw error;
      
      setApprovalWorkflows(data || []);
    } catch (error) {
      console.error('Error fetching approval workflows:', error);
      toast.error('Failed to load approval workflows');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewApprovalProcess = async () => {
    if (!selectedSupplier) {
      toast.error('Please select a supplier');
      return;
    }

    try {
      // Get current user info (mocked for now)
      const currentUser = 'Quality Manager';
      
      const { data, error } = await supabase
        .from('supplier_approval_workflows')
        .insert({
          supplier_id: selectedSupplier,
          status: 'In Progress',
          current_step: 1,
          initiated_by: currentUser,
          notes: notes,
          due_date: dueDate || null
        })
        .select();

      if (error) throw error;
      
      toast.success('New approval process started');
      setIsNewWorkflowDialogOpen(false);
      setSelectedSupplier('');
      setDueDate('');
      setNotes('');
      fetchApprovalWorkflows();
    } catch (error) {
      console.error('Error starting approval process:', error);
      toast.error('Failed to start approval process');
    }
  };

  const handleAdvanceStep = async (workflowId: string, currentStep: number) => {
    try {
      const newStep = currentStep + 1;
      let status = 'In Progress';
      
      if (newStep > 4) {
        status = 'Completed';
      }

      const { error } = await supabase
        .from('supplier_approval_workflows')
        .update({ 
          current_step: newStep,
          status: status,
          ...(status === 'Completed' ? { completed_at: new Date().toISOString() } : {})
        })
        .eq('id', workflowId);

      if (error) throw error;
      
      toast.success(`Moved to step ${newStep}`);
      fetchApprovalWorkflows();
    } catch (error) {
      console.error('Error advancing workflow step:', error);
      toast.error('Failed to update workflow');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" />
            Supplier Approval Workflow
          </CardTitle>
          <CardDescription>
            Streamline the onboarding process for new suppliers with our automated approval workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            {/* Step 1: Initial Registration */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
              <FilePenLine className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Initial Registration</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Supplier completes registration form with basic information</p>
            </div>
            
            {/* Step 2: Document Collection */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
              <FileCheck className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Document Collection</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Upload certificates, audit reports, and regulatory documents</p>
            </div>
            
            {/* Step 3: Risk Assessment */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
              <AlertOctagon className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Risk Assessment</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Evaluate potential risks and determine assessment requirements</p>
            </div>
            
            {/* Step 4: Review & Approval */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
              <ClipboardCheck className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Review & Approval</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Quality team reviews documents and risk assessment results</p>
            </div>
            
            {/* Step 5: Onboarding Complete */}
            <div className="bg-gray-50 border border-green-200 rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</div>
              <FileCheck className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-medium text-sm md:text-base">Onboarding Complete</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Supplier approved and added to the approved supplier list</p>
            </div>
          </div>
          
          <div className="mt-8">
            <Button onClick={() => setIsNewWorkflowDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Start New Approval Process
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Approval Processes</CardTitle>
          <CardDescription>Track ongoing supplier approval workflows</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {approvalWorkflows.length > 0 ? (
                approvalWorkflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">{workflow.suppliers?.name || 'Unknown Supplier'}</h3>
                      <p className="text-sm text-gray-500">
                        Started: {new Date(workflow.initiated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className={`
                        rounded-full px-3 py-1 text-xs
                        ${workflow.current_step === 1 ? 'bg-blue-100 text-blue-800' : 
                         workflow.current_step === 2 ? 'bg-indigo-100 text-indigo-800' :
                         workflow.current_step === 3 ? 'bg-orange-100 text-orange-800' : 
                         workflow.current_step === 4 ? 'bg-purple-100 text-purple-800' :
                         'bg-green-100 text-green-800'}
                      `}>
                        Stage {workflow.current_step}: {
                          workflow.current_step === 1 ? 'Initial Registration' : 
                          workflow.current_step === 2 ? 'Document Collection' :
                          workflow.current_step === 3 ? 'Risk Assessment' : 
                          workflow.current_step === 4 ? 'Review & Approval' :
                          'Onboarding Complete'
                        }
                      </div>
                      {workflow.current_step < 5 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => handleAdvanceStep(workflow.id, workflow.current_step)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active approval processes
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Approval Process Dialog */}
      <Dialog open={isNewWorkflowDialogOpen} onOpenChange={setIsNewWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Approval Process</DialogTitle>
            <DialogDescription>
              Select a supplier to begin the approval workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers
                    .filter(s => s.status === 'Pending')
                    .map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Additional information" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewWorkflowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={startNewApprovalProcess}>
              Start Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierApproval;
