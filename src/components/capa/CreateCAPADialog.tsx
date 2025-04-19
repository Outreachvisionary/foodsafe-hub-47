
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CAPA, CAPASource, CAPAPriority, SourceReference } from '@/types/capa';
import { createCAPA } from '@/services/capaService';
import { useToast } from '@/components/ui/use-toast';
import { mapStatusToInternal } from '@/services/capa/capaStatusService';

interface CreateCAPADialogProps {
  onCAPACreated?: (capa: CAPA) => void;
  trigger?: React.ReactNode;
  initialSource?: CAPASource;
  initialPriority?: CAPAPriority;
  initialSourceReference?: SourceReference;
  title?: string;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({
  onCAPACreated,
  trigger,
  initialSource = 'internal',
  initialPriority = 'medium',
  initialSourceReference,
  title = 'Create CAPA'
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CAPA>>({
    title: '',
    description: '',
    source: initialSource,
    priority: initialPriority,
    status: 'open',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedTo: '',
    department: '',
    isFsma204Compliant: false,
    sourceReference: initialSourceReference
  });
  
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Add the createdBy field
      const completeFormData: any = {
        ...formData,
        createdBy: 'Current User', // Replace with actual user in a real application
        createdDate: new Date().toISOString()
      };
      
      const capa = await createCAPA(completeFormData);
      
      toast({
        title: 'Success',
        description: 'CAPA created successfully',
      });
      
      if (onCAPACreated) {
        onCAPACreated(capa);
      }
      
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: 'Error',
        description: 'Failed to create CAPA',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      source: initialSource,
      priority: initialPriority,
      status: 'open',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: '',
      department: '',
      isFsma204Compliant: false,
      sourceReference: initialSourceReference
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create CAPA
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Create a new Corrective and Preventive Action (CAPA) record.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Brief title describing the issue"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Detailed description of the issue"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="source" className="text-sm font-medium">
                  Source
                </label>
                <select
                  id="source"
                  name="source"
                  required
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="internal">Internal</option>
                  <option value="audit">Audit</option>
                  <option value="complaint">Complaint</option>
                  <option value="non-conformance">Non-Conformance</option>
                  <option value="haccp">HACCP</option>
                  <option value="traceability">Traceability</option>
                  <option value="supplier">Supplier</option>
                  <option value="customer">Customer</option>
                  <option value="regulatory">Regulatory</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  required
                  value={typeof formData.dueDate === 'string' ? formData.dueDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="assignedTo" className="text-sm font-medium">
                  Assigned To
                </label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  required
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Person responsible"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Responsible department"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFsma204Compliant"
                name="isFsma204Compliant"
                checked={formData.isFsma204Compliant || false}
                onChange={handleCheckboxChange}
                className="rounded border-gray-300"
              />
              <label htmlFor="isFsma204Compliant" className="text-sm">
                FSMA 204 Compliant
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create CAPA'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
