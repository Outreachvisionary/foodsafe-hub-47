
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ClipboardList, Search, PlusCircle, CalendarIcon, ArrowRight } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define workflow status types that match the database constraints
type WorkflowStatus = 
  'Initiated' | 
  'Document Review' | 
  'Risk Assessment' | 
  'Audit Scheduled' | 
  'Audit Completed' | 
  'Pending Approval' | 
  'Approved' | 
  'Rejected';

interface ApprovalWorkflow {
  id: string;
  supplier_id: string;
  status: WorkflowStatus;
  initiated_by: string;
  initiated_at: string;
  current_step: number;
  notes?: string;
  due_date?: string;
  completed_at?: string;
  suppliers?: { name: string };
}

const SupplierApproval: React.FC = () => {
  const { suppliers } = useSuppliers();
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdvanceDialogOpen, setIsAdvanceDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [nextStatus, setNextStatus] = useState<WorkflowStatus | ''>('');
  const [notes, setNotes] = useState('');
  
  const [newWorkflow, setNewWorkflow] = useState({
    supplierId: '',
    dueDate: '',
    notes: '',
  });
  
  useEffect(() => {
    loadWorkflows();
  }, []);
  
  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('supplier_approval_workflows')
        .select(`
          *,
          suppliers (name)
        `)
        .order('initiated_at', { ascending: false });
      
      if (error) throw error;
      
      setWorkflows(data || []);
    } catch (err) {
      console.error('Error loading approval workflows:', err);
      toast.error('Failed to load approval workflows');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredWorkflows = workflows.filter(workflow => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      (workflow.suppliers?.name.toLowerCase().includes(searchTerms)) ||
      workflow.status.toLowerCase().includes(searchTerms)
    );
  });
  
  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'Initiated':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Document Review':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Risk Assessment':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Audit Scheduled':
        return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100';
      case 'Audit Completed':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'Pending Approval':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const getNextStepOptions = (currentStatus: WorkflowStatus): WorkflowStatus[] => {
    switch(currentStatus) {
      case 'Initiated':
        return ['Document Review'];
      case 'Document Review':
        return ['Risk Assessment'];
      case 'Risk Assessment':
        return ['Audit Scheduled'];
      case 'Audit Scheduled':
        return ['Audit Completed'];
      case 'Audit Completed':
        return ['Pending Approval'];
      case 'Pending Approval':
        return ['Approved', 'Rejected'];
      default:
        return [];
    }
  };
  
  const startNewApprovalProcess = async () => {
    if (!newWorkflow.supplierId) {
      toast.error('Please select a supplier');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('supplier_approval_workflows')
        .insert({
          supplier_id: newWorkflow.supplierId,
          status: 'Initiated' as WorkflowStatus,
          initiated_by: 'Quality Manager', // Hardcoded for now, should come from authentication
          current_step: 1,
          notes: newWorkflow.notes,
          due_date: newWorkflow.dueDate || null
        })
        .select(`*, suppliers (name)`)
        .single();
      
      if (error) {
        console.error('Error starting approval process:', error);
        throw error;
      }
      
      toast.success('Approval process started successfully');
      setWorkflows([data, ...workflows]);
      setIsDialogOpen(false);
      setNewWorkflow({
        supplierId: '',
        dueDate: '',
        notes: '',
      });
    } catch (err) {
      console.error('Error starting approval process:', err);
      toast.error('Failed to start approval process');
    }
  };
  
  const advanceWorkflow = async () => {
    if (!selectedWorkflow || !nextStatus) {
      toast.error('Please select the next status');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('supplier_approval_workflows')
        .update({
          status: nextStatus,
          current_step: selectedWorkflow.current_step + 1,
          notes: notes || selectedWorkflow.notes,
          completed_at: (nextStatus === 'Approved' || nextStatus === 'Rejected') ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedWorkflow.id);
      
      if (error) throw error;
      
      // If approving or rejecting, update the supplier status as well
      if (nextStatus === 'Approved' || nextStatus === 'Rejected') {
        const supplierStatus = nextStatus === 'Approved' ? 'Active' : 'Inactive';
        
        const { error: supplierError } = await supabase
          .from('suppliers')
          .update({
            status: supplierStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedWorkflow.supplier_id);
        
        if (supplierError) throw supplierError;
      }
      
      toast.success(`Workflow advanced to ${nextStatus} stage`);
      await loadWorkflows(); // Reload the workflows
      setIsAdvanceDialogOpen(false);
      setSelectedWorkflow(null);
      setNextStatus('');
      setNotes('');
    } catch (err) {
      console.error('Error advancing approval workflow:', err);
      toast.error('Failed to advance workflow');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewWorkflow({ ...newWorkflow, [id]: value });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center">
          <ClipboardList className="mr-2 h-5 w-5" />
          Supplier Approval Workflow
        </CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search workflows..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Start Approval Process
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Supplier Approval Process</DialogTitle>
                <DialogDescription>
                  Start a new approval workflow for a supplier. This will initiate the review process.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="supplier" className="text-right">Supplier</label>
                  <Select
                    value={newWorkflow.supplierId}
                    onValueChange={(value) => setNewWorkflow({...newWorkflow, supplierId: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers
                        .filter(s => s.status !== 'Active') // Only show suppliers that are not already active
                        .map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="dueDate" className="text-right">Due Date</label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newWorkflow.dueDate ? (
                            format(new Date(newWorkflow.dueDate), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newWorkflow.dueDate ? new Date(newWorkflow.dueDate) : undefined}
                          onSelect={(date) => setNewWorkflow({
                            ...newWorkflow,
                            dueDate: date ? date.toISOString() : ''
                          })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="notes" className="text-right">Notes</label>
                  <Textarea
                    id="notes"
                    className="col-span-3"
                    value={newWorkflow.notes}
                    onChange={handleInputChange}
                    placeholder="Add any notes or requirements for the approval process"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={startNewApprovalProcess}>
                  Start Process
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Initiated By</TableHead>
                <TableHead>Initiated Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Step</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.suppliers?.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeStyle(workflow.status)} variant="outline">
                        {workflow.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{workflow.initiated_by}</TableCell>
                    <TableCell>{new Date(workflow.initiated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {workflow.due_date ? new Date(workflow.due_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{workflow.current_step}</TableCell>
                    <TableCell>
                      {workflow.status !== 'Approved' && workflow.status !== 'Rejected' && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            setNextStatus('');
                            setNotes(workflow.notes || '');
                            setIsAdvanceDialogOpen(true);
                          }}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" /> Advance
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No workflows match your search criteria' : 'No approval workflows found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Advance Workflow Dialog */}
      <Dialog open={isAdvanceDialogOpen} onOpenChange={setIsAdvanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advance Workflow</DialogTitle>
            <DialogDescription>
              Move this supplier to the next step in the approval process
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkflow && (
            <div className="grid gap-4 py-4">
              <div>
                <p className="text-sm font-medium mb-2">Current Status</p>
                <Badge className={getStatusBadgeStyle(selectedWorkflow.status)} variant="outline">
                  {selectedWorkflow.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="nextStatus" className="text-right">Next Status</label>
                <Select
                  value={nextStatus}
                  onValueChange={(value) => setNextStatus(value as WorkflowStatus)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select next status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNextStepOptions(selectedWorkflow.status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="advanceNotes" className="text-right">Notes</label>
                <Textarea
                  id="advanceNotes"
                  className="col-span-3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this step"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAdvanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={advanceWorkflow}
              disabled={!nextStatus}
            >
              Advance to Next Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SupplierApproval;
