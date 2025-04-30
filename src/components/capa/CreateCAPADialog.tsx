
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createCAPA } from '@/services/capaService';
import { CAPA } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource } from '@/types/enums';

interface CreateCAPADialogProps {
  onSuccess?: (capa: CAPA) => void;
  trigger?: React.ReactNode;
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
  onCAPACreated?: (capa: CAPA) => void;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({ 
  onSuccess, 
  trigger, 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onCAPACreated
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CAPAPriority>(CAPAPriority.Medium);
  const [source, setSource] = useState<CAPASource>(CAPASource.Audit);
  const [sourceReference, setSourceReference] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [department, setDepartment] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [fsma204Compliant, setFsma204Compliant] = useState(false);
  
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      setControlledOpen(newOpen);
    } else {
      setOpen(newOpen);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !priority || !source || !assignedTo) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const now = new Date().toISOString();
      const capaData: Partial<CAPA> = {
        title,
        description,
        status: CAPAStatus.Open,
        priority,
        created_at: now,
        created_by: "Current User", // This would come from auth context in a real app
        due_date: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: assignedTo,
        source,
        source_reference: sourceReference,
        department,
        root_cause: rootCause,
        fsma204_compliant: fsma204Compliant
      };
      
      const newCAPA = await createCAPA(capaData);
      
      toast({
        title: "CAPA Created",
        description: "The CAPA has been successfully created",
      });
      
      if (onSuccess) {
        onSuccess(newCAPA);
      }
      
      if (onCAPACreated) {
        onCAPACreated(newCAPA);
      }
      
      handleOpenChange(false);
      resetForm();
      
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: "Error",
        description: "Failed to create CAPA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(CAPAPriority.Medium);
    setSource(CAPASource.Audit);
    setSourceReference('');
    setAssignedTo('');
    setDueDate('');
    setDepartment('');
    setRootCause('');
    setFsma204Compliant(false);
  };
  
  return (
    <Dialog open={isControlled ? controlledOpen : open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>Create New CAPA</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter CAPA title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={priority} 
                  onValueChange={(value) => setPriority(value as CAPAPriority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CAPAPriority.Low}>Low</SelectItem>
                    <SelectItem value={CAPAPriority.Medium}>Medium</SelectItem>
                    <SelectItem value={CAPAPriority.High}>High</SelectItem>
                    <SelectItem value={CAPAPriority.Critical}>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Select 
                  value={source} 
                  onValueChange={(value) => setSource(value as CAPASource)}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CAPASource.Audit}>Audit</SelectItem>
                    <SelectItem value={CAPASource.CustomerComplaint}>Customer Complaint</SelectItem>
                    <SelectItem value={CAPASource.NonConformance}>Non-Conformance</SelectItem>
                    <SelectItem value={CAPASource.SupplierIssue}>Supplier Issue</SelectItem>
                    <SelectItem value={CAPASource.RegulatoryInspection}>Regulatory Inspection</SelectItem>
                    <SelectItem value={CAPASource.InternalReport}>Internal Report</SelectItem>
                    <SelectItem value={CAPASource.Other}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sourceReference">Source Reference</Label>
              <Input
                id="sourceReference"
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                placeholder="Audit #, NC #, etc."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="User name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department"
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="fsma"
                  checked={fsma204Compliant}
                  onCheckedChange={(checked) => setFsma204Compliant(!!checked)}
                />
                <Label htmlFor="fsma">FSMA 204 Compliant</Label>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="rootCause">Root Cause</Label>
              <Textarea
                id="rootCause"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="Initial assessment of root cause"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline" 
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create CAPA'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
