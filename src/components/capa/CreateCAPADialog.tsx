
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CAPASource, CAPAPriority } from '@/types/capa';
import { createCAPA } from '@/services/capaService';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface CreateCAPADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCAPACreated?: () => void;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({ 
  open, 
  onOpenChange,
  onCAPACreated 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState<CAPASource>('audit');
  const [priority, setPriority] = useState<CAPAPriority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !source || !priority) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await createCAPA({
        title,
        description,
        source,
        priority,
        rootCause,
        correctiveAction,
        preventiveAction,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });
      
      toast({
        title: "CAPA created",
        description: "The CAPA has been created successfully",
        // Fix the variant to use valid types
        variant: "default"
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSource('audit');
      setPriority('medium');
      setDueDate(undefined);
      setRootCause('');
      setCorrectiveAction('');
      setPreventiveAction('');
      
      // Close dialog and notify parent
      onOpenChange(false);
      if (onCAPACreated) {
        onCAPACreated();
      }
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: "Failed to create CAPA",
        description: "An error occurred while creating the CAPA. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
          <DialogDescription>
            Create a new Corrective and Preventive Action (CAPA) to address an issue.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Brief title of the CAPA"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source <span className="text-red-500">*</span></Label>
                <Select 
                  value={source} 
                  onValueChange={(value) => setSource(value as CAPASource)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="customer-complaint">Customer Complaint</SelectItem>
                    <SelectItem value="internal-qc">Internal QC</SelectItem>
                    <SelectItem value="supplier-issue">Supplier Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
                <Select 
                  value={priority} 
                  onValueChange={(value) => setPriority(value as CAPAPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rootCause">Root Cause</Label>
              <Textarea
                id="rootCause"
                placeholder="Identified root cause of the issue"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="correctiveAction">Corrective Action</Label>
              <Textarea
                id="correctiveAction"
                placeholder="Action to correct the immediate issue"
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preventiveAction">Preventive Action</Label>
              <Textarea
                id="preventiveAction"
                placeholder="Action to prevent recurrence"
                value={preventiveAction}
                onChange={(e) => setPreventiveAction(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create CAPA"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
