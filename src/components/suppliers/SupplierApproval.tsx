
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSuppliers } from '@/hooks/useSuppliers';
import { fetchApprovalWorkflows, createApprovalWorkflow, advanceWorkflowStep, rejectWorkflow, editWorkflowStep } from '@/services/supplierApprovalService';
import { Check, X, ClipboardCheck, Calendar, Search, ArrowRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import SupplierApprovalSteps from './SupplierApprovalSteps';
import EditStepDialog from './EditStepDialog';

const getStatusBadge = (status) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const SupplierApproval = () => {
  const { suppliers, isLoading: suppliersLoading } = useSuppliers();
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [startApprovalOpen, setStartApprovalOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [editStepDialogOpen, setEditStepDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalForm, setApprovalForm] = useState({
    supplierId: '',
    approvers: ['Quality Manager', 'Compliance Officer', 'Operations Manager'],
    dueDate: ''
  });
  const [reviewForm, setReviewForm] = useState({
    notes: ''
  });
  const [rejectForm, setRejectForm] = useState({
    reason: ''
  });
  
  useEffect(() => {
    loadWorkflows();
  }, []);
  
  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApprovalWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartApproval = async () => {
    if (!approvalForm.supplierId) {
      toast.error('Please select a supplier');
      return;
    }
    
    try {
      await createApprovalWorkflow(
        approvalForm.supplierId,
        'Current User', // This should come from auth context in a real app
        approvalForm.approvers,
        approvalForm.dueDate
      );
      
      toast.success('Approval workflow started successfully');
      setStartApprovalOpen(false);
      setApprovalForm({
        supplierId: '',
        approvers: ['Quality Manager', 'Compliance Officer', 'Operations Manager'],
        dueDate: ''
      });
      loadWorkflows();
    } catch (error) {
      console.error('Error starting approval:', error);
      // Toast is already shown in the service function
    }
  };
  
  const handleApproveStep = async () => {
    if (!selectedWorkflow) return;
    
    try {
      await advanceWorkflowStep(
        selectedWorkflow.id,
        'Current User', // This should come from auth context
        reviewForm.notes
      );
      
      toast.success('Step approved successfully');
      setReviewDialogOpen(false);
      setReviewForm({ notes: '' });
      loadWorkflows();
    } catch (error) {
      console.error('Error approving step:', error);
      toast.error('Failed to approve step');
    }
  };
  
  const handleRejectWorkflow = async () => {
    if (!selectedWorkflow || !rejectForm.reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      await rejectWorkflow(
        selectedWorkflow.id,
        'Current User', // This should come from auth context
        rejectForm.reason
      );
      
      toast.success('Workflow rejected successfully');
      setRejectDialogOpen(false);
      setRejectForm({ reason: '' });
      loadWorkflows();
    } catch (error) {
      console.error('Error rejecting workflow:', error);
      toast.error('Failed to reject workflow');
    }
  };
  
  const handleEditStep = async (step: number, reason: string) => {
    if (!selectedWorkflow) return;
    
    try {
      await editWorkflowStep(
        selectedWorkflow.id,
        step,
        reason,
        'Current User' // This should come from auth context
      );
      
      toast.success('Workflow step updated successfully');
      setEditStepDialogOpen(false);
      loadWorkflows();
    } catch (error) {
      console.error('Error editing workflow step:', error);
      toast.error(error.message || 'Failed to edit workflow step');
    }
  };
  
  // Filter workflows based on search and status filter
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = 
      workflow.suppliers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.suppliers?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.suppliers?.country?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      workflow.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  // Transform selected workflow steps for visualization
  const getWorkflowSteps = () => {
    if (!selectedWorkflow || !selectedWorkflow.approval_history?.steps) {
      return [];
    }
    
    return selectedWorkflow.approval_history.steps.map(step => ({
      step: step.step,
      name: step.name,
      status: step.status,
      approver: step.approved_by || step.rejected_by,
      date: step.completed_at || step.rejected_at || step.started_at
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier Approval Workflow</h2>
        <Button onClick={() => setStartApprovalOpen(true)}>
          Start Approval Process
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Approval List</TabsTrigger>
          <TabsTrigger value="overview">Process Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Approvals</CardTitle>
              <CardDescription>
                Manage and track supplier approval workflows
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search suppliers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredWorkflows.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Step</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredWorkflows.map(workflow => (
                      <TableRow key={workflow.id}>
                        <TableCell className="font-medium">
                          {workflow.suppliers?.name || 'Unknown Supplier'}
                        </TableCell>
                        <TableCell>
                          {workflow.suppliers?.category || 'N/A'}
                        </TableCell>
                        <TableCell>
                          Step {workflow.current_step} of {workflow.approval_history?.steps?.length || 4}
                        </TableCell>
                        <TableCell>
                          {new Date(workflow.initiated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(workflow.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedWorkflow(workflow);
                                if (workflow.status === 'in_progress') {
                                  setReviewDialogOpen(true);
                                }
                              }}
                              disabled={workflow.status !== 'in_progress'}
                            >
                              {workflow.status === 'in_progress' ? 'Review' : 'View'}
                            </Button>
                            
                            {workflow.status === 'in_progress' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedWorkflow(workflow);
                                  setEditStepDialogOpen(true);
                                }}
                              >
                                Edit Step
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || statusFilter !== 'all' ? 
                    'No matching approval workflows found' : 
                    'No approval workflows have been started yet'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Approval Process Overview</CardTitle>
              <CardDescription>
                Understanding the supplier approval workflow
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Approval Process Steps</h3>
                  <p className="text-blue-700 mb-4">
                    All new suppliers must complete this approval process before they can be activated.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Document Review</h4>
                        <p className="text-blue-700">Verification of all required documentation and certifications</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Compliance Verification</h4>
                        <p className="text-blue-700">Assessment of compliance with food safety regulations and standards</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Quality Evaluation</h4>
                        <p className="text-blue-700">Evaluation of product quality, specifications, and service reliability</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Final Approval</h4>
                        <p className="text-blue-700">Final review and approval by authorized personnel</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <ClipboardCheck className="h-8 w-8 text-blue-600" />
                        <h3 className="text-lg font-medium">Approval Process</h3>
                      </div>
                      <p className="mt-2 text-gray-600">
                        A standardized process to ensure all suppliers meet quality and safety requirements.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-8 w-8 text-green-600" />
                        <h3 className="text-lg font-medium">Timeline</h3>
                      </div>
                      <p className="mt-2 text-gray-600">
                        The typical approval process takes 14-21 days, depending on supplier responsiveness.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-8 w-8 text-amber-600" />
                        <h3 className="text-lg font-medium">Requirements</h3>
                      </div>
                      <p className="mt-2 text-gray-600">
                        Suppliers must provide all required documentation and meet compliance criteria.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Start Approval Dialog */}
      <Dialog open={startApprovalOpen} onOpenChange={setStartApprovalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Approval Process</DialogTitle>
            <DialogDescription>
              Begin the approval workflow for a new supplier
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Select Supplier</Label>
              <Select
                value={approvalForm.supplierId}
                onValueChange={(value) => setApprovalForm({...approvalForm, supplierId: value})}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliersLoading ? (
                    <div className="p-2 text-center">Loading suppliers...</div>
                  ) : (
                    suppliers
                      .filter(supplier => supplier.status !== 'Active')
                      .map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date (Optional)</Label>
              <Input
                id="due-date"
                type="date"
                value={approvalForm.dueDate}
                onChange={(e) => setApprovalForm({...approvalForm, dueDate: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStartApprovalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartApproval}>
              Start Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Approval Step</DialogTitle>
            <DialogDescription>
              {selectedWorkflow && (
                <>
                  Reviewing {selectedWorkflow.suppliers?.name} - 
                  Step {selectedWorkflow.current_step} of {selectedWorkflow.approval_history?.steps?.length || 4}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkflow && (
            <div className="space-y-6 py-4">
              <SupplierApprovalSteps 
                steps={getWorkflowSteps()} 
                currentStep={selectedWorkflow.current_step} 
              />
              
              <div className="space-y-4">
                <Label htmlFor="review-notes">Review Notes</Label>
                <Textarea
                  id="review-notes"
                  placeholder="Enter your review notes..."
                  value={reviewForm.notes}
                  onChange={(e) => setReviewForm({...reviewForm, notes: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => {
                setReviewDialogOpen(false);
                setRejectDialogOpen(true);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApproveStep}>
                <Check className="mr-2 h-4 w-4" />
                Approve Step
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Approval</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this supplier
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectForm.reason}
              onChange={(e) => setRejectForm({...rejectForm, reason: e.target.value})}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectWorkflow}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Step Dialog */}
      {selectedWorkflow && (
        <EditStepDialog
          open={editStepDialogOpen}
          onOpenChange={setEditStepDialogOpen}
          currentStep={selectedWorkflow.current_step}
          maxSteps={selectedWorkflow.approval_history?.steps?.length || 4}
          onConfirm={handleEditStep}
        />
      )}
    </div>
  );
};

export default SupplierApproval;
