
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Check, ClipboardList, Plus } from 'lucide-react';
import CAPAAuditIntegration from './CAPAAuditIntegration';
import { createCAPA } from '@/services/capaService';
import { useUser } from '@/contexts/UserContext';

interface CreateCAPADialogProps {
  onCAPACreated?: (data: any) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sourceData?: any;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({ 
  onCAPACreated, 
  trigger,
  open,
  onOpenChange,
  sourceData
}) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // CAPA form state
  const [title, setTitle] = useState(sourceData?.title || '');
  const [description, setDescription] = useState(sourceData?.description || '');
  const [source, setSource] = useState<string>(sourceData?.source || 'audit');
  const [priority, setPriority] = useState<string>(sourceData?.priority || 'medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [sourceId, setSourceId] = useState(sourceData?.sourceId || '');
  const [auditFinding, setAuditFinding] = useState<any>(null);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSource('audit');
    setPriority('medium');
    setDueDate('');
    setAssignedTo('');
    setSourceId('');
    setAuditFinding(null);
  };
  
  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
    resetForm();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !source || !priority || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new CAPA
      const newCAPA = await createCAPA({
        title,
        description,
        source: source as any,
        sourceId: sourceId || (auditFinding ? auditFinding.id : ''),
        priority: priority as any,
        status: 'open',
        assignedTo: assignedTo || user?.full_name || 'Unassigned',
        department: '',
        dueDate,
        rootCause: '',
        correctiveAction: '',
        preventiveAction: '',
        fsma204Compliant: false
      });
      
      toast.success('CAPA created successfully');
      
      // Notify parent component
      if (onCAPACreated) {
        onCAPACreated(newCAPA);
      }
      
      // Close dialog and reset form
      handleClose();
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast.error('Failed to create CAPA');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFindingSelected = (finding: any) => {
    setAuditFinding(finding);
    setTitle(finding.description);
    setDescription(`Finding from audit ${finding.auditId}: ${finding.description}`);
    setPriority(finding.severity === 'critical' ? 'critical' : 
                finding.severity === 'major' ? 'high' : 
                finding.severity === 'minor' ? 'medium' : 'low');
    setSourceId(finding.id);
  };

  // Use the controlled open state if provided, otherwise use the internal state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create CAPA
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
          <DialogDescription>
            Create a new Corrective and Preventive Action (CAPA) to address compliance issues
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Enter CAPA title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source <span className="text-red-500">*</span></Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="haccp">HACCP</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="traceability">Traceability</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              placeholder="Describe the issue or non-conformance requiring corrective action"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                placeholder="Person responsible"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {source === 'audit' && (
            <div className="space-y-2">
              <Label htmlFor="auditFinding">Link to Audit Finding</Label>
              <CAPAAuditIntegration onFindingSelected={handleFindingSelected} />
              {auditFinding && (
                <div className="flex items-center mt-2 p-2 bg-green-50 border border-green-100 rounded-md">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-green-700">
                    Linked to finding: {auditFinding.id}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ClipboardList className="h-4 w-4 mr-2 animate-pulse" />
                  Creating...
                </>
              ) : (
                <>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Create CAPA
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
