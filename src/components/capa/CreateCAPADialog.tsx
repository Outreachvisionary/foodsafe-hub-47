
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CAPAPriority, CAPASource } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import DepartmentSelector from '@/components/department/DepartmentSelector';

export interface CreateCAPADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCAPACreated: (data: any) => void;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({
  open,
  onOpenChange,
  onCAPACreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState<CAPASource>(CAPASource.InternalReport);
  const [priority, setPriority] = useState<CAPAPriority>(CAPAPriority.Medium);
  const [department, setDepartment] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [fsma204Compliant, setFsma204Compliant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    if (!title || !description) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would be an API call
      const newCapa = {
        id: `CAPA-${Date.now().toString().substring(6)}`,
        title,
        description,
        source,
        priority,
        department,
        due_date: dueDate?.toISOString(),
        fsma204_compliant: fsma204Compliant,
        status: 'Open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current-user',
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'CAPA Created',
        description: `Successfully created CAPA: ${title}`,
      });
      
      // Clear form
      setTitle('');
      setDescription('');
      setSource(CAPASource.InternalReport);
      setPriority(CAPAPriority.Medium);
      setDepartment('');
      setDueDate(undefined);
      setFsma204Compliant(false);
      
      // Close dialog and notify parent
      onOpenChange(false);
      onCAPACreated(newCapa);
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: 'Error',
        description: 'Failed to create CAPA. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter CAPA title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the issue and required actions" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source</Label>
              <Select value={source} onValueChange={(value) => setSource(value as CAPASource)}>
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
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as CAPAPriority)}>
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
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                placeholder="Enter department name" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePicker
                date={dueDate}
                onSelect={setDueDate}
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fsma204" 
              checked={fsma204Compliant}
              onCheckedChange={(checked) => setFsma204Compliant(checked === true)}
            />
            <Label htmlFor="fsma204">FSMA 204 Compliant</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create CAPA'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
