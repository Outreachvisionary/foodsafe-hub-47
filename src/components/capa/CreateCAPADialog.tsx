import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Check, ClipboardList, Plus, AlertTriangle, FileText } from 'lucide-react';
import CAPAAuditIntegration from './CAPAAuditIntegration';
import { createCAPA } from '@/services/capaService';
import { useUser } from '@/contexts/UserContext';
import { CAPASource, SourceReference } from '@/types/capa';

interface SourceDataType {
  title?: string;
  description?: string;
  source?: CAPASource;
  sourceId?: string;
  priority?: string;
  sourceReference?: SourceReference;
}

interface CreateCAPADialogProps {
  onCAPACreated?: (data: any) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  sourceData?: SourceDataType;
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
  
  const [title, setTitle] = useState(sourceData?.title || '');
  const [description, setDescription] = useState(sourceData?.description || '');
  const [source, setSource] = useState<CAPASource>(sourceData?.source || 'audit');
  const [priority, setPriority] = useState<string>(sourceData?.priority || 'medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [sourceId, setSourceId] = useState(sourceData?.sourceId || '');
  const [auditFinding, setAuditFinding] = useState<any>(null);
  
  useEffect(() => {
    if (sourceData) {
      setTitle(sourceData.title || '');
      setDescription(sourceData.description || '');
      setSource(sourceData.source || 'audit');
      setPriority(sourceData.priority || 'medium');
      setSourceId(sourceData.sourceId || '');
    }
  }, [sourceData]);
  
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
      const sourceReference = sourceData ? {
        type: sourceData.type,
        title: sourceData.title,
        id: sourceData.id,
        url: `/non-conformance/${sourceData.id}`,
        date: sourceData.date,
      } : undefined;
      
      const formData = {
        title,
        description,
        source,
        sourceId: sourceId || (auditFinding ? auditFinding.id : ''),
        priority: priority as any,
        status: 'Open' as const,
        assignedTo: assignedTo || user?.full_name || 'Unassigned',
        department: '',
        dueDate,
        rootCause: '',
        correctiveAction: '',
        preventiveAction: '',
        sourceReference,
        fsma204Compliant: false
      };
      
      const newCAPA = await createCAPA(formData);
      
      toast.success('CAPA created successfully');
      
      if (onCAPACreated) {
        onCAPACreated(newCAPA);
      }
      
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
    setPriority(finding.severity === 'Critical' ? 'critical' : 
                finding.severity === 'Major' ? 'high' : 
                finding.severity === 'Minor' ? 'medium' : 'low');
    setSourceId(finding.id);
  };

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
        
        {sourceData && sourceData.sourceReference && (
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Creating CAPA from {sourceData.sourceReference.type}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {sourceData.sourceReference.title}
                </p>
                {sourceData.sourceReference.date && (
                  <p className="text-xs text-blue-500 mt-1">
                    Reported on {new Date(sourceData.sourceReference.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
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
              <Select 
                value={source} 
                onValueChange={(value) => setSource(value as CAPASource)}
                disabled={!!sourceData?.source}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="haccp">HACCP</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="traceability">Traceability</SelectItem>
                  <SelectItem value="nonconformance">Non-Conformance</SelectItem>
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
          
          {source === 'audit' && !sourceData?.source && (
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
