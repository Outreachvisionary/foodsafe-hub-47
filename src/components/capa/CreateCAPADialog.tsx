
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateCAPADialogProps, CreateCAPARequest } from '@/types/capa';
import { CAPAPriority, CAPASource } from '@/types/enums';

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CAPAPriority>(CAPAPriority.Medium);
  const [source, setSource] = useState<CAPASource>(CAPASource.Internal_Report);
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const capaData: CreateCAPARequest = {
      title,
      description,
      priority,
      source,
      assigned_to: assignedTo,
      due_date: dueDate,
      department
    };

    onSubmit(capaData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority(CAPAPriority.Medium);
    setSource(CAPASource.Internal_Report);
    setAssignedTo('');
    setDueDate('');
    setDepartment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter CAPA title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={(value: CAPAPriority) => setPriority(value)}>
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
              <Select value={source} onValueChange={(value: CAPASource) => setSource(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CAPASource.Audit}>Audit</SelectItem>
                  <SelectItem value={CAPASource.Customer_Complaint}>Customer Complaint</SelectItem>
                  <SelectItem value={CAPASource.Internal_Report}>Internal Report</SelectItem>
                  <SelectItem value={CAPASource.Non_Conformance}>Non-Conformance</SelectItem>
                  <SelectItem value={CAPASource.Supplier_Issue}>Supplier Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To *</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Enter assignee name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter department name"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create CAPA
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
