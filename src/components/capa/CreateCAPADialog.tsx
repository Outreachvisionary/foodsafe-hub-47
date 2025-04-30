
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createCAPA } from '@/services/capaService';
import { CAPAPriority, CAPASource, CAPAStatus } from '@/types/enums';

interface CreateCAPADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCAPACreated: (capa: any) => void;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({
  open,
  onOpenChange,
  onCAPACreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CAPAPriority>(CAPAPriority.Medium);
  const [source, setSource] = useState<CAPASource>(CAPASource.Audit);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [department, setDepartment] = useState('');
  const [sourceReference, setSourceReference] = useState('');
  const [fsma204Compliant, setFsma204Compliant] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !dueDate || !priority || !source) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const capaData = {
        title,
        description,
        priority,
        source,
        due_date: dueDate,
        assigned_to: assignedTo,
        department,
        source_reference: sourceReference,
        fsma204_compliant: fsma204Compliant,
        status: CAPAStatus.Open,
      };
      
      const createdCAPA = await createCAPA(capaData);
      
      onCAPACreated(createdCAPA);
      resetForm();
      onOpenChange(false);
      
      toast({
        title: 'CAPA Created',
        description: 'The CAPA has been created successfully',
      });
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: 'Error',
        description: 'Failed to create CAPA. Please try again.',
        variant: 'destructive',
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
    setDueDate('');
    setAssignedTo('');
    setDepartment('');
    setSourceReference('');
    setFsma204Compliant(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new Corrective and Preventive Action (CAPA).
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter CAPA title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue or non-conformance"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as CAPAPriority)}
              >
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select 
                value={source} 
                onValueChange={(value) => setSource(value as CAPASource)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CAPASource.Audit}>Audit</SelectItem>
                  <SelectItem value={CAPASource.CustomerComplaint}>Customer Complaint</SelectItem>
                  <SelectItem value={CAPASource.InternalReport}>Internal Report</SelectItem>
                  <SelectItem value={CAPASource.NonConformance}>Non-Conformance</SelectItem>
                  <SelectItem value={CAPASource.RegulatoryInspection}>Regulatory Inspection</SelectItem>
                  <SelectItem value={CAPASource.SupplierIssue}>Supplier Issue</SelectItem>
                  <SelectItem value={CAPASource.Other}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="pr-10"
                />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                placeholder="Enter person or role"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Enter department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sourceReference">Source Reference</Label>
              <Input
                id="sourceReference"
                placeholder="e.g., Audit ID, Complaint #"
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fsma204"
              checked={fsma204Compliant}
              onCheckedChange={(checked) => setFsma204Compliant(!!checked)}
            />
            <Label htmlFor="fsma204">FSMA 204 Compliant</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create CAPA'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
